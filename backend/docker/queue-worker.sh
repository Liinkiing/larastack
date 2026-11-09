#!/bin/sh
# Restarts in-process because queue:work exits 0 on `artisan reload`, and a Docker restart
# policy cannot recover it: Rancher Desktop's WSL bind mount is gone on daemon-driven restarts.
trap 'kill -TERM "$worker" 2>/dev/null; wait "$worker"; exit 0' TERM INT

while true; do
    php artisan queue:work "$@" &
    worker=$!
    wait "$worker" || exit "$?"
    sleep 1
done
