_GSOC2_TRACEBACK_FILE="___GSOC2_TRACEBACK_FILE___"
_GSOC2_LOG_FILE="___GSOC2_LOG_FILE___"

if [ "${GSOC2_CLI_NO_EXIT_TRAP-0}" != 1 ]; then
  trap _gsoc2_exit_trap EXIT
fi
trap _gsoc2_err_trap ERR

_gsoc2_shown_traceback=0

_gsoc2_exit_trap() {
  local _exit_code="$?"
  local _command="${BASH_COMMAND:-unknown}"
  if [[ $_exit_code != 0 && "${_gsoc2_shown_traceback}" != 1 ]]; then
    _gsoc2_err_trap "$_command" "$_exit_code"
  fi
  rm -f "$_GSOC2_TRACEBACK_FILE" "$_GSOC2_LOG_FILE"
  exit $_exit_code
}

_gsoc2_err_trap() {
  local _exit_code="$?"
  local _command="${BASH_COMMAND:-unknown}"
  if [ $# -ge 1 ] && [ "x$1" != x ]; then
    _command="$1"
  fi
  if [ $# -ge 2 ] && [ "x$2" != x ]; then
    _exit_code="$2"
  fi
  _gsoc2_traceback 1
  echo "@command:${_command}" >> "$_GSOC2_TRACEBACK_FILE"
  echo "@exit_code:${_exit_code}" >> "$_GSOC2_TRACEBACK_FILE"

  : >> "$_GSOC2_LOG_FILE"
  export GSOC2_LAST_EVENT=$(___GSOC2_CLI___ bash-hook --send-event --traceback "$_GSOC2_TRACEBACK_FILE" ___GSOC2_TAGS___ ___GSOC2_RELEASE___ --log "$_GSOC2_LOG_FILE" ___GSOC2_NO_ENVIRON___)
  rm -f "$_GSOC2_TRACEBACK_FILE" "$_GSOC2_LOG_FILE"
}

_gsoc2_traceback() {
  _gsoc2_shown_traceback=1
  local -i start=$(( ${1:-0} + 1 ))
  local -i end=${#BASH_SOURCE[@]}
  local -i i=0
  local -i j=0

  : > "$_GSOC2_TRACEBACK_FILE"
  for ((i=${start}; i < ${end}; i++)); do
    j=$(( $i - 1 ))
    local function="${FUNCNAME[$i]}"
    local file="${BASH_SOURCE[$i]}"
    local line="${BASH_LINENO[$j]}"
    echo "${function}:${file}:${line}" >> "$_GSOC2_TRACEBACK_FILE"
  done
}

: > "$_GSOC2_LOG_FILE"

if command -v perl >/dev/null; then
  exec \
    1> >(tee >(perl '-MPOSIX' -ne '$|++; print strftime("%Y-%m-%d %H:%M:%S %z: ", localtime()), "stdout: ", $_;' >> "$_GSOC2_LOG_FILE")) \
    2> >(tee >(perl '-MPOSIX' -ne '$|++; print strftime("%Y-%m-%d %H:%M:%S %z: ", localtime()), "stderr: ", $_;' >> "$_GSOC2_LOG_FILE") >&2)
else
  exec \
    1> >(tee >(awk '{ system(""); print strftime("%Y-%m-%d %H:%M:%S %z:"), "stdout:", $0; system(""); }' >> "$_GSOC2_LOG_FILE")) \
    2> >(tee >(awk '{ system(""); print strftime("%Y-%m-%d %H:%M:%S %z:"), "stderr:", $0; system(""); }' >> "$_GSOC2_LOG_FILE") >&2)
fi
