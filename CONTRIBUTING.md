# Contributing to TDM Nexus

Thank you for your interest in contributing to **TDM Nexus**! This document provides guidelines for contributing to ensure high code quality, test coverage, and smooth reviews.

---

## 1. Development Workflow

1. **Fork or Branch**: Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b fix/your-fix-name
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Local Development**:
   ```bash
   npm run dev
   ```

---

## 2. Commit Message Standards

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard. Commit messages should be structured as follows:

```
<type>(<scope>): <subject>

[optional body]
```

### Types:
- `feat`: A new feature (must include tests)
- `fix`: A bug fix (must include regression tests)
- `refactor`: Code restructuring without functional change
- `test`: Adding or updating test suites
- `docs`: Documentation updates
- `ci`: CI/CD workflow configuration

---

## 3. Code Standards & Quality Gates

Before submitting a Pull Request, verify that all quality gates pass:

1. **Type Checking**:
   ```bash
   npm run typecheck
   ```
2. **Linting**:
   ```bash
   npm run lint
   ```
3. **Test Suite**:
   ```bash
   npm run test
   ```
4. **Production Build**:
   ```bash
   npm run build
   ```

### Architecture Rule
- **No God Files**: Every file should have a single responsibility and stay below **500 LOC**. Extract layout math, complex subcomponents, and exporters into dedicated modules in `src/utils/` or `src/components/`.

---

## 4. Pull Request Process

1. Ensure the CI pipeline passes on your pull request.
2. Link any related issues or work items in the PR description.
3. Keep pull requests focused on a single logical change with matching tests.
