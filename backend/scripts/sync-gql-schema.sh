#!/usr/bin/env bash

set -euo pipefail

BACKEND_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
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

  cp "${SCHEMA_SOURCE}" "${app_dir}/schema.graphql"
  pnpm --filter "../${app_name}" gen:gql
}

sync_schema_for_app "frontend"
sync_schema_for_app "mobile"
