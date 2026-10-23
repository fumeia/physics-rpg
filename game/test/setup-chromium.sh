#!/bin/sh
# Headless Chromium for tests in this container: the Debian build aborts because its crash handler
# is started without --database. Copy it and wrap the handler. Result: /tmp/chr-local/chromium
set -e
[ -x /tmp/chr-local/chromium ] && exit 0
mkdir -p /tmp/chr-local /tmp/crashdb
cp -r /usr/lib/chromium/. /tmp/chr-local/
cat > /tmp/chr-local/chrome_crashpad_handler <<'EOS'
#!/bin/sh
case "$*" in *--database=*) exec /usr/lib/chromium/chrome_crashpad_handler "$@";; esac
exec /usr/lib/chromium/chrome_crashpad_handler "$@" --database=/tmp/crashdb
EOS
chmod +x /tmp/chr-local/chrome_crashpad_handler
