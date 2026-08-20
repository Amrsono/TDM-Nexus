# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-08-20

### Added
- **Project State Context Layer (`ProjectContext`)**: Extracted domain state and derived delivery metrics into a context layer, eliminating monolithic prop drilling in `App.tsx`.
- **Phase Navigation Configuration Module (`src/config/phases.ts`)**: Decoupled phase metadata and icons from root layout, shrinking `App.tsx` below 400 LOC.
- **Dedicated AI Providers Module (`src/utils/aiProviders.ts`)**: Modularized provider adapter registry away from service orchestration.
- **End-to-End Delivery Journey Test (`src/__tests__/integration/deliveryJourney.test.tsx`)**: Full user flow verification covering stage transitions, state mutations, and export triggers.
- **Parallel GitHub Actions Matrix Pipeline**: Refactored `.github/workflows/ci.yml` into 5 parallel jobs (`audit`, `lint`, `typecheck`, `test`, `build`) with pinned immutable action commit SHAs.
- **Expanded Test Coverage**: Added dedicated test suites for `POAPMilestoneTable`, `FunnelReviewing`, `pptxExporter`, and `phases`, raising test suite count to **29 files and 119 passing tests**.

## [0.2.0] - 2026-08-20

### Added
- **Structured Error Boundary**: Added React `ErrorBoundary` component with crash diagnostics, stack copy, and state recovery capabilities.
- **Client-Side Structured Logger**: Built telemetry `Logger` buffer supporting `debug`, `info`, `warn`, and `error` log levels with timestamped metadata.
- **Typed AI Result Pattern**: Introduced `Result<T, E>` and `AIResult<T>` interfaces eliminating fragile string parsing and try/catch exceptions.
- **Consolidated AI Provider Registry**: De-duplicated provider adapters for Gemini, OpenAI, Claude, Copilot, and Custom endpoints.
- **ThreeJS Canvas & Governance Tests**: Added unit tests for 3D stage-gate WebGL viewport and governance slide deck generators bringing test suite count to 23 files and 105 tests.
- **Fresh-Clone Verification Scripts**: Added `scripts/verify-fresh-install.sh` and `scripts/verify-fresh-install.ps1` for automated zero-account CI/local validation.
- **CI Coverage Artifacts & Renovate**: Uploading code coverage reports in GitHub Actions and added `renovate.json`.

### Removed
- Removed unused `puppeteer` and `puppeteer-screen-recorder` dependencies, reducing total package count by 70 packages.

## [0.1.0] - 2026-08-20

### Added
- **Unified State Store**: Extracted root state management from `App.tsx` into a typed, deterministic `projectReducer` handling cascading domain mutations and fund transfers.
- **Enterprise Test Infrastructure**: Integrated Vitest v8 coverage suite with strict global coverage thresholds (`>= 70%` lines, `>= 60%` branches) and 93 unit/integration tests across models, reducers, views, contexts, and exporters.
- **Docker Containerization**: Multi-stage production `Dockerfile` (Node 20 build -> Nginx Alpine runtime), `nginx.conf` SPA routing with security headers, and `docker-compose.yml` for single-command deployment.
- **CI/CD Hardening**: Automated high-severity dependency security auditing (`npm audit --audit-level=high`), weekly Dependabot vulnerability updates, and automated test coverage enforcement.
- **Enhanced AI Error Resilience**: Added typed error boundary states and descriptive UI error notifications in `Settings.tsx` to prevent silent network/API key failures.
- **Export Verification**: Full test suites for Excel workbooks (9 sheets), SteerCo PowerPoint decks, POAP roadmap slide decks, and Governance Gate presentations.
