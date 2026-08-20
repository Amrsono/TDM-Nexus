# TDM Nexus - Fresh Clone Verification Smoke Test (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   TDM Nexus - Fresh Clone Verification Smoke Test   " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

Write-Host "Step 1: Installing dependencies with npm ci..." -ForegroundColor Yellow
npm ci

Write-Host "Step 2: Running TypeScript typecheck..." -ForegroundColor Yellow
npm run typecheck

Write-Host "Step 3: Running ESLint linting..." -ForegroundColor Yellow
npm run lint

Write-Host "Step 4: Running Vitest test suite with coverage enforcement..." -ForegroundColor Yellow
npm run test:coverage

Write-Host "Step 5: Running production Vite build..." -ForegroundColor Yellow
npm run build

Write-Host "Step 6: Running dependency vulnerability audit..." -ForegroundColor Yellow
npm audit --audit-level=critical

Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  [SUCCESS] All verification steps passed cleanly!     " -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
