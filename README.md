# TDM Nexus (Task & Delivery Management)

[![CI](https://github.com/Amrsono/TDM-Nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/Amrsono/TDM-Nexus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow?logo=vitest)](https://vitest.dev/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)

**TDM Nexus** is an enterprise-grade Release Management, Governance, and Plan-on-a-Page (POAP) platform built for modern engineering organizations. It streamlines complex delivery cycles from initial demand funnel analysis to stage-gate approvals, QA verification, financial forecasting, and post-launch Early Life Support (ELS).

---

## 🚀 Key Features

- **📊 Interactive E2E Delivery Journey**: Multi-phase walkthrough tracking work from Demand Funnel, Reviewing (Stop/Go gates), Analysing (BRS/HLD), to Implementing and Hypercare.
- **📑 POAP (Plan on a Page) Slide Builder**: Visual, multi-track timeline architect for creating executive-ready PowerPoint decks (`.pptx`) with VOIS brand alignment, phase banding, and swimlane layouts.
- **🛡️ Governance & Release Planning**: Full lifecycle stage-gate governance supporting RPM (Release Planning Meetings), CP1 (Build Scope Freeze), CP2 (Final Scope Freeze), and Change Requests.
- **💰 Financial Health & Allocation**: Real-time CAPEX/OPEX tracking, variance modeling, budget burn rates, and inter-squad fund transfers.
- **🧪 QA & Defect Tracking**: Integrated testing matrices across SIT, UAT, PAT, OAT, and PEN phases with defect severity breakdowns.
- **🤖 AI Assistant & Predictive Intelligence**: Multi-provider AI assistant supporting Gemini, OpenAI, Anthropic Claude, and custom local/proxy endpoints with Zod runtime validation.
- **📦 Enterprise Export Engine**: Single-click export of executive Steering Committee decks, Governance summaries, and detailed Excel spreadsheets.

---

## 🏛️ Architecture & Project Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI workflow (lint, typecheck, test, build)
├── src/
│   ├── components/
│   │   ├── poap/                # POAP subcomponents (SlidePreview, POAPMilestoneTable)
│   │   ├── planning/            # Governance subcomponents (GateSlidePreview, GateEditorForm)
│   │   ├── wizard/              # Delivery journey step views (Funnel, Reviewing, Analysing, etc.)
│   │   ├── AIAssistantApplet.tsx# Copilot drawer widget
│   │   └── ThreeCanvas.tsx      # 3D interactive stage-gate canvas
│   ├── context/
│   │   └── AIAssistantContext.tsx# Global assistant and project state management
│   ├── types/
│   │   └── poap.ts              # Typed interfaces for milestones and POAP decks
│   ├── utils/
│   │   ├── mockData/            # Modular domain mock data (Finance, QA, Governance, Project)
│   │   ├── aiService.ts         # Multi-provider AI integration & prompt orchestration
│   │   ├── aiValidation.ts      # Zod schema validation for runtime inputs and settings
│   │   ├── timelineLayout.ts    # Date math, phase mapping, and collision layout algorithm
│   │   ├── poapPptxExporter.ts  # PPTX slide generation engine for POAP
│   │   ├── pptxExporter.ts      # Executive Steering Committee slide deck builder
│   │   ├── governancePptxExporter.ts # Gate and AI insight PPTX generators
│   │   ├── pptxStyles.ts        # Official brand colors, layout helpers, and slide headers
│   │   └── excelExporter.ts     # Multi-tab XLSX financial and QA workbook exporter
│   ├── views/                   # Top-level view modules (all < 500 LOC)
│   ├── App.tsx                  # Root layout & phase navigation
│   └── main.tsx                 # React entrypoint
├── .env.example                 # Template for environment configuration
├── vitest.config.ts             # Vitest test framework configuration
├── CONTRIBUTING.md              # Engineering workflow and commit guidelines
└── package.json                 # Project dependencies and npm scripts
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Amrsono/TDM-Nexus.git
cd TDM-Nexus

# Install dependencies with lockfile fidelity
npm install
```

### Environment Configuration

Copy the example environment template and configure any optional keys:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini AI API key (optional) |
| `VITE_OPENAI_API_KEY` | OpenAI API key (optional) |
| `VITE_ANTHROPIC_API_KEY` | Anthropic Claude API key (optional) |
| `VITE_AI_PROXY_URL` | Optional server-side AI proxy endpoint |

### Docker Containerization

Run the production build in an isolated multi-stage container with Nginx:

```bash
# Build and launch with Docker Compose
docker compose up --build -d

# Access the application at http://localhost:8080
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local Vite development server with Hot Module Replacement |
| `npm run test` | Run the complete Vitest test suite |
| `npm run test:coverage` | Run Vitest with v8 code coverage and threshold enforcement |
| `npm run test:watch` | Run Vitest in interactive watch mode |
| `npm run typecheck` | Run TypeScript compiler type check (`tsc -b --noEmit`) |
| `npm run lint` | Run ESLint across all TypeScript and React files |
| `npm run build` | Build optimized production bundle to `dist/` |
| `npm run preview` | Locally preview the production build |

---

## 🧪 Testing & CI Enforcement

The test suite contains **19 test suites** and **93 passing unit/integration tests** with strict threshold enforcement (`>= 70%` lines, `>= 60%` branches):
- **State Store (`src/store/projectReducer.ts`)**: 100% line coverage for state actions, financial transfers, and squad mutations.
- **Timeline Math & Layout**: Automated date boundary calculation, phase detection, and multi-row task collision handling.
- **AI Service & Providers**: Verification of `buildSystemPrompt`, `getEndpointUrl`, `buildRequestBody`, and response parsers across all providers.
- **Exporters Engine**: End-to-end testing for Excel spreadsheets (9 worksheets), SteerCo PowerPoint decks, POAP roadmap slides, and Governance Gate decks.
- **Views & Components**: Interactive testing for all stage-gate views, defect logging, checklist additions, and wizard steps.

Every push and pull request triggers `.github/workflows/ci.yml` (vulnerability audit, lint, typecheck, coverage tests, and build) to guarantee zero regressions.

---

## 🤝 Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming conventions, Conventional Commits format, and pull request guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
