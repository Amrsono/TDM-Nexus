#!/usr/bin/env bash
set -euo pipefail

echo "======================================================="
echo "   TDM Nexus - Fresh Clone Verification Smoke Test   "
echo "======================================================="

echo "Step 1: Installing dependencies with npm ci..."
npm ci

echo "Step 2: Running TypeScript typecheck..."
npm run typecheck

echo "Step 3: Running ESLint linting..."
npm run lint

echo "Step 4: Running Vitest test suite with coverage enforcement..."
npm run test:coverage

echo "Step 5: Running production Vite build..."
npm run build

echo "Step 6: Running dependency vulnerability audit..."
npm audit --audit-level=critical

echo "======================================================="
echo "  [SUCCESS] All verification steps passed cleanly!     "
echo "======================================================="
