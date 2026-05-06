#!/usr/bin/env bash
# healthcheck.sh – Simple health-check script for TRUVIS DevOps containers.
set -euo pipefail

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Health check: OK"
