# Contributing to DevOps TCG

Thank you for helping improve DevOps TCG. The project is currently
pre-implementation, so use the approved design and implementation plan as the
source of truth for scope and technical decisions.

## Before You Start

- Read the [product design](docs/superpowers/specs/2026-08-13-devops-tcg-design.md).
- Review the [implementation plan](docs/superpowers/plans/2026-08-13-devops-tcg.md).
- Keep changes focused on one plan task or one clearly described concern.
- Open an issue before proposing a material change to architecture or scope.

## Development Expectations

- Use Node.js 20, pnpm 9, and the Terraform versions defined by the project once
  their configuration files are available.
- Add or update tests for behavior changes.
- Run every available formatting, linting, type, test, build, and infrastructure
  check relevant to the changed files.
- Do not weaken security, accessibility, or test requirements to make a check
  pass.
- Never commit credentials, populated variable files, Terraform state, plan
  files that may contain sensitive values, or local environment files.

## Commits and Pull Requests

- Create a focused branch from the latest `main` branch.
- Use a concise conventional commit-style subject such as `feat:`, `fix:`,
  `docs:`, `test:`, `ci:`, or `chore:`.
- Explain what changed, why it changed, and how it was verified.
- Include screenshots for visible interface changes.
- Keep pull requests small enough to review confidently.
