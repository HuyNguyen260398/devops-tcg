# Security Policy

## Supported Versions

DevOps TCG is currently in pre-implementation and has no released version.
After the first release, security updates will target the latest version on the
`main` branch.

## Reporting a Vulnerability

Do not disclose suspected vulnerabilities in a public issue.

Use GitHub private vulnerability reporting for this repository when available.
If that channel is unavailable, email `huynguyen260398@gmail.com` with a concise
description, reproduction steps, potential impact, and any suggested
mitigation. Do not include active credentials or sensitive production data.

The maintainer will acknowledge the report, assess its impact, and coordinate a
fix and disclosure timeline when the issue is confirmed.

## Protecting Cloud and Infrastructure Data

Never commit:

- AWS access keys, session tokens, account credentials, or GitHub secrets.
- Terraform state or state backups.
- Terraform plans that may contain sensitive values.
- Populated `.tfvars` files or backend configuration containing account data.
- Local `.env` files or deployment credentials.

If a credential is exposed, revoke or rotate it immediately before removing it
from repository history.
