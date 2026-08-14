# Repository Baseline Design

**Date:** 2026-08-14

**Status:** Approved design

## Objective

Establish a collaboration-ready repository baseline before implementing the
DevOps TCG application plan. The baseline documents the project accurately in
its current pre-implementation state, applies the MIT License, and defines
safe defaults for source control and collaboration without introducing
premature automation or governance.

## Scope

### Included

- A concise root `README.md` describing the project goal, current status,
  planned architecture and technology, repository documentation, and roadmap.
- A canonical `LICENSE` file containing the MIT License with copyright
  `2026 Huy Nguyen`.
- An expanded `.gitignore` covering Node.js, pnpm, Next.js, test tooling,
  Terraform local data and state, environment files, editor metadata, and
  operating-system artifacts.
- An `.editorconfig` defining UTF-8, LF line endings, final newlines, whitespace
  cleanup, and format-appropriate indentation.
- A `.gitattributes` file normalizing text files and identifying common binary
  assets.
- A `CONTRIBUTING.md` file defining prerequisites, the planned quality gates,
  branch and commit expectations, and pull-request guidance.
- A `SECURITY.md` file defining supported-version expectations, private
  vulnerability reporting, and safe handling of credentials and Terraform
  artifacts.
- A small update to the existing implementation plan so its documentation task
  updates the root README instead of assuming that README does not exist.

### Excluded

- GitHub issue or pull-request templates, `CODEOWNERS`, Dependabot, release
  automation, and a code of conduct.
- Application, frontend, infrastructure, or CI/CD implementation.
- Dependency manifests, tool installations, or generated lock files.
- Deployment credentials, account identifiers, bucket names, or Terraform
  backend configuration values.

These exclusions keep the baseline useful now while leaving automation and
maintainer policy to the implementation tasks that have enough context to
configure them correctly.

## File Design

### README.md

The README is an honest pre-implementation landing page, not an operations
guide for commands that do not yet exist. It will include:

- The DevOps TCG purpose and first Proxy learning card.
- A prominent pre-implementation status note.
- Planned product characteristics and AWS delivery architecture.
- The intended Next.js, TypeScript, Terraform, AWS, and GitHub Actions stack.
- The current repository documentation layout.
- Links to the approved product design and implementation plan.
- A short roadmap aligned with the plan's ten tasks.

The final documentation task in the implementation plan remains responsible
for expanding the README with verified setup, test, deployment, and teardown
commands after those commands exist.

### LICENSE

Use the unmodified MIT License text with `2026 Huy Nguyen`. The conventional
extensionless filename makes the license easy for GitHub and other tooling to
detect.

### .gitignore

Group ignore rules by purpose. Ignore dependency directories, framework build
outputs, coverage and browser-test artifacts, logs, local environment files,
Terraform working directories and state, local variable files, override files,
IDE settings, and OS metadata.

Do not ignore source-controlled or reproducibility files, including
`pnpm-lock.yaml`, `.nvmrc`, Terraform source files, `.terraform.lock.hcl`, or
`*.tfvars.example`. Preserve the existing `.superpowers/` exclusion.

### .editorconfig and .gitattributes

Use two-space indentation by default for the planned TypeScript, JSON, YAML,
Markdown, and Terraform files, with tabs reserved for Makefiles. Normalize text
to LF in Git while marking image and font formats as binary. These files should
not duplicate formatter configuration that belongs to the future frontend.

### CONTRIBUTING.md

Describe the future contribution workflow without presenting unavailable
commands as currently runnable. Contributors should consult the approved plan,
keep changes focused, use conventional commit-style subjects, add tests with
behavior changes, avoid committing secrets or state, and run all quality gates
available for the files they change. Once the planned toolchain exists, the
document can list its concrete commands.

### SECURITY.md

State that the project is not yet released and that only the latest `main`
branch will receive security updates after release. Direct reporters to use
GitHub private vulnerability reporting when available, or contact
`huynguyen260398@gmail.com` without including secrets in a public issue.

Call out cloud-specific safety rules: never commit AWS credentials, GitHub
secrets, Terraform state, plans that may contain sensitive values, or populated
variable files.

## Plan Integration

The existing implementation plan remains authoritative for building the
application. Its Task 10 root-documentation step will be changed from creating
`README.md` to updating it. The planned final README sections and verified
operator instructions remain unchanged.

No new application implementation task is needed because this repository
baseline is completed before Task 1 begins.

## Verification

Before completion:

1. Confirm all seven baseline files exist.
2. Validate that `.gitignore` ignores representative generated and sensitive
   paths while retaining lockfiles and examples.
3. Scan documentation for placeholder text and references to commands or files
   that do not exist yet.
4. Confirm the MIT copyright line is exact.
5. Confirm the implementation plan describes the README as an update.
6. Run `git diff --check` to catch whitespace errors.

## Acceptance Criteria

- A new visitor can understand what DevOps TCG will become and can see that
  implementation has not started.
- The repository has a clearly detected MIT License owned by Huy Nguyen.
- Common local, generated, secret-bearing, and Terraform state files are not
  accidentally committed.
- Reproducibility files and example configuration remain trackable.
- Collaboration and security guidance match a public DevOps/IaC repository.
- No baseline document claims that unimplemented tooling is currently usable.
- The existing application design and implementation plan remain otherwise
  unchanged.
