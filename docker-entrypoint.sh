#!/bin/sh

# For compatibility with older entrypoints
if [ "${1}" == "gsoc2-cli" ]; then
  shift
elif [ "${1}" == "sh" ] || [ "${1}" == "/bin/sh" ]; then
  exec "$@"
fi

exec /bin/gsoc2-cli "$@"
