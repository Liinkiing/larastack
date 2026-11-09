#!/usr/bin/env bash

set -euo pipefail

BACKEND_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-sync}"
if [[ "$#" -gt 1 || ( "${MODE}" != "sync" && "${MODE}" != "--check" ) ]]; then
  printf 'Usage: %s [--check]\n' "$0" >&2
  exit 1
fi

SCHEMA_SOURCE="${BACKEND_DIR}/storage/app/private/lighthouse-schema.graphql"

if [[ ! -f "${SCHEMA_SOURCE}" ]]; then
  printf 'GraphQL schema not found: %s\n' "${SCHEMA_SOURCE}" >&2
  exit 1
fi

sync_schema_for_app() {
  local app_name="$1"
  local app_dir="${BACKEND_DIR}/../${app_name}"

  if [[ ! -d "${app_dir}" ]]; then
    return
  fi

  if [[ "${MODE}" == "--check" ]]; then
    if ! cmp -s "${SCHEMA_SOURCE}" "${app_dir}/schema.graphql"; then
      printf 'GraphQL schema is out of sync: %s/schema.graphql. Run pnpm --filter @larastack/backend gql:dump.\n' "${app_name}" >&2
      exit 1
    fi
    return
  fi

  cp "${SCHEMA_SOURCE}" "${app_dir}/schema.graphql"
  pnpm --filter "../${app_name}" gen:gql
}

sync_schema_for_app "frontend"
sync_schema_for_app "mobile"
