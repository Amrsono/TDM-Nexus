# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-20

### Added
- **Unified State Store**: Extracted root state management from `App.tsx` into a typed, deterministic `projectReducer` handling cascading domain mutations and fund transfers.
- **Enterprise Test Infrastructure**: Integrated Vitest v8 coverage suite with strict global coverage thresholds (`>= 70%` lines, `>= 60%` branches) and 93 unit/integration tests across models, reducers, views, contexts, and exporters.
- **Docker Containerization**: Multi-stage production `Dockerfile` (Node 20 build -> Nginx Alpine runtime), `nginx.conf` SPA routing with security headers, and `docker-compose.yml` for single-command deployment.
- **CI/CD Hardening**: Automated high-severity dependency security auditing (`npm audit --audit-level=high`), weekly Dependabot vulnerability updates, and automated test coverage enforcement.
- **Enhanced AI Error Resilience**: Added typed error boundary states and descriptive UI error notifications in `Settings.tsx` to prevent silent network/API key failures.
- **Export Verification**: Full test suites for Excel workbooks (9 sheets), SteerCo PowerPoint decks, POAP roadmap slide decks, and Governance Gate presentations.
