package app.physicsrpg;

// Physics RPG for Android: a full-screen WebView around the game on your own server.
// - The game, its content and every update come from the server (nothing to reinstall when content changes).
// - Offline: the game's service worker keeps a copy of all files, so the app starts and plays without a network;
//   progress is saved on the phone and merged with the server (and your other devices) as soon as it is online again.
// - The server's login (Caddy basic auth) is asked once and remembered. Long-press the app icon -> "Server settings" to change it.
// - Back closes the open panel (like Esc); back twice quickly leaves the app.

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.CookieManager;
import android.webkit.HttpAuthHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView web;
    private SharedPreferences prefs;
    private long lastBack = 0;
    private int authTries = 0;
    private ValueCallback<Uri[]> fileCb;
    private static final int PICK = 7;

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        prefs = getSharedPreferences("rpg", MODE_PRIVATE);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#070a12"));
        setContentView(web);
        immersive();
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setUserAgentString(s.getUserAgentString() + " PhysicsRPG-Android/1.0");
        CookieManager.getInstance().setAcceptCookie(true);
        web.setWebViewClient(new Client());
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                try { startActivityForResult(p.createIntent(), PICK); } catch (Exception e) { fileCb = null; return false; }
                return true;
            }
        });
        web.setDownloadListener((url, ua, cd, mime, len) -> {
            if (url.startsWith("http")) startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
            else Toast.makeText(this, "Export: use the server's profile backup instead (Menu > Profile)", Toast.LENGTH_LONG).show();
        });
        if (b != null) web.restoreState(b);
        else if (server().isEmpty() || isSettingsIntent(getIntent())) askSettings(true);
        else web.loadUrl(server());
    }

    private String server() { return prefs.getString("url", ""); }
    private boolean isSettingsIntent(Intent i) { return i != null && "app.physicsrpg.SETTINGS".equals(i.getAction()); }

    @Override protected void onNewIntent(Intent i) { super.onNewIntent(i); if (isSettingsIntent(i)) askSettings(false); }
    @Override protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); web.saveState(o); }
    @Override protected void onActivityResult(int req, int res, Intent data) {
        if (req == PICK && fileCb != null) { fileCb.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(res, data)); fileCb = null; }
        else super.onActivityResult(req, res, data);
    }
    // the game syncs when it comes back to the front and right before the app goes to the background
    @Override protected void onResume() { super.onResume(); web.onResume(); kickSync(); immersive(); }
    @Override protected void onPause() { kickSync(); web.onPause(); super.onPause(); }
    private void kickSync() { if (web != null) web.evaluateJavascript("try{window.dispatchEvent(new Event('online'))}catch(e){}", null); }

    @Override public void onWindowFocusChanged(boolean f) { super.onWindowFocusChanged(f); if (f) immersive(); }
    private void immersive() {
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) { c.hide(WindowInsets.Type.systemBars()); c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE); }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    @SuppressWarnings("deprecation")
    @Override public void onBackPressed() {
        long now = System.currentTimeMillis();
        if (now - lastBack < 1500) { moveTaskToBack(true); return; }
        lastBack = now;
        web.evaluateJavascript("(function(){var t=document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName)?document.activeElement:document;"
            + "['keydown','keyup'].forEach(function(n){t.dispatchEvent(new KeyboardEvent(n,{key:'Escape',code:'Escape',keyCode:27,bubbles:true}))});})()", null);
        Toast.makeText(this, "Back again to leave", Toast.LENGTH_SHORT).show();
    }

    private EditText field(LinearLayout box, String label, String value, int type) {
        TextView t = new TextView(this); t.setText(label); t.setPadding(0, 18, 0, 0); box.addView(t);
        EditText e = new EditText(this); e.setText(value); e.setInputType(type); e.setSingleLine(true); box.addView(e); return e;
    }

    // first start and "Server settings": the game's address and the login of the server (Caddy basic auth), if it has one
    private void askSettings(boolean first) {
        LinearLayout box = new LinearLayout(this); box.setOrientation(LinearLayout.VERTICAL); box.setPadding(48, 16, 48, 0);
        EditText url = field(box, "Game address (your server)", server().isEmpty() ? "https://" : server(), InputType.TYPE_TEXT_VARIATION_URI);
        EditText user = field(box, "Login name (leave empty if the server has none)", prefs.getString("user", ""), InputType.TYPE_CLASS_TEXT);
        EditText pass = field(box, "Password", prefs.getString("pass", ""), InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        AlertDialog.Builder d = new AlertDialog.Builder(this).setTitle("Physics RPG: your server").setView(box).setCancelable(!first)
            .setPositiveButton("Save and open", (x, y) -> {
                String u = url.getText().toString().trim();
                if (!u.matches("^https?://.+")) u = "https://" + u.replaceFirst("^https?://", "");
                if (!u.endsWith("/")) u += "/";
                prefs.edit().putString("url", u).putString("user", user.getText().toString().trim()).putString("pass", pass.getText().toString()).apply();
                authTries = 0; web.loadUrl(u);
            });
        if (!first) d.setNegativeButton("Cancel", null);
        d.show();
    }

    private class Client extends WebViewClient {
        @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
            Uri u = r.getUrl(), home = Uri.parse(server());
            if (u.getHost() != null && u.getHost().equals(home.getHost())) return false; // the game and its pages stay in the app
            try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception e) { /* no app for it */ }
            return true;
        }
        @Override public void onReceivedHttpAuthRequest(WebView v, HttpAuthHandler h, String host, String realm) {
            String u = prefs.getString("user", ""), p = prefs.getString("pass", "");
            if (!u.isEmpty() && authTries++ < 2) { h.proceed(u, p); return; }
            // no login saved, or the saved one was refused: ask
            LinearLayout box = new LinearLayout(MainActivity.this); box.setOrientation(LinearLayout.VERTICAL); box.setPadding(48, 16, 48, 0);
            EditText eu = field(box, "Login name", u, InputType.TYPE_CLASS_TEXT);
            EditText ep = field(box, "Password", "", InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            new AlertDialog.Builder(MainActivity.this).setTitle("Login for " + host).setView(box).setCancelable(false)
                .setPositiveButton("Log in", (x, y) -> { prefs.edit().putString("user", eu.getText().toString().trim()).putString("pass", ep.getText().toString()).apply(); authTries = 1; h.proceed(eu.getText().toString().trim(), ep.getText().toString()); })
                .setNegativeButton("Settings", (x, y) -> { h.cancel(); askSettings(false); }).show();
        }
        @Override public void onPageFinished(WebView v, String url) { authTries = 0; }
        @Override public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
            if (!r.isForMainFrame()) return;
            // only reached when there is no offline copy yet (the first start needs the network once)
            v.loadDataWithBaseURL(null, "<html><body style='background:#070a12;color:#dde;font:16px sans-serif;padding:32px'><h2>Physics RPG</h2>"
                + "<p>Could not reach <b>" + server() + "</b> (" + e.getDescription() + ").</p><p>The first start needs the internet once; after that the game also works offline.</p>"
                + "<p><a style='color:#9cc0ff' href='" + server() + "'>Try again</a></p><p style='opacity:.7'>Wrong address? Long-press the app icon &rarr; Server settings.</p></body></html>", "text/html", "utf-8", null);
        }
    }
}
