#!/usr/bin/env bash
# healthcheck.sh — Container health probe for TRUVIS DevOs base container.
# Checks that the shell environment is functional and Node is reachable.
# Extend with a real HTTP check once your service exposes an endpoint.
set -euo pipefail

# Verify Node.js is available and responsive
node --version > /dev/null 2>&1 || { echo "FAIL: node not found"; exit 1; }

# Verify bash and core tools are present
command -v curl  > /dev/null 2>&1 || { echo "FAIL: curl not found"; exit 1; }
command -v git   > /dev/null 2>&1 || { echo "FAIL: git not found"; exit 1; }

# If an HTTP service is running on port 3000, uncomment:
# curl --fail --silent --max-time 3 http://localhost:3000/health || exit 1

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Health check: OK"
