#!/bin/bash
# Runs the game's tests side by side (each starts its own server on its own port). Usage:
#   test/run-tests.sh            all of them, in parallel (about 4 minutes instead of 13)
#   test/run-tests.sh quick      the fast ones only (logic, notifier, desktop): about 1 minute
#   test/run-tests.sh touch features   just the named tests (store-check, active-smoke, touch-smoke, theme-smoke, features-smoke, notify-parity, desktop-smoke, remind-smoke, pile-smoke, exam-smoke, python)
cd "$(dirname "$0")/.." || exit 1
export CHROMIUM=${CHROMIUM:-/opt/pw-browsers/chromium}; JOBS=${JOBS:-4}
[ -e node_modules ] || { echo "node_modules is missing (npm install playwright-core)"; exit 1; }
ALL="features-smoke theme-smoke touch-smoke active-smoke notify-parity remind-smoke desktop-smoke pile-smoke exam-smoke store-check python"   # slowest first
case "${1:-all}" in all) LIST=$ALL;; quick) LIST="store-check python desktop-smoke remind-smoke";; *) LIST="$*";; esac
run() { t=$1; case $t in python) cmd="python3 -W ignore ../deploy/test_notify.py";; *) n=${t%-smoke}; f=test/$t.mjs; [ -f "$f" ] || f=test/${t}.mjs; cmd="node $f";; esac
  out=$(timeout 900 $cmd 2>&1); code=$?; res=$(echo "$out" | grep -E "FAIL|FAILED|Error" | head -6)
  if [ $code -eq 0 ]; then echo "PASS  $t"; else echo "FAIL  $t"; echo "$res" | sed 's/^/        /'; fi; }
export -f run
START=$(date +%s)
printf '%s\n' $LIST | xargs -P "$JOBS" -I{} bash -c 'run {}' | tee /tmp/run-tests.out
echo "took $(( $(date +%s) - START )) s"; ! grep -q '^FAIL' /tmp/run-tests.out
