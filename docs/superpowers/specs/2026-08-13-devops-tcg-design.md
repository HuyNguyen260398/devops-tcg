# DevOps TCG Design Specification

**Date:** 2026-08-13

**Status:** Approved design

## Objective

Build a read-only flash-card website for learning technical concepts. The first
release contains one hardcoded card for the concept **Proxy**. The site uses an
original, modern trading-card visual language inspired by contemporary Pokémon
TCG cards without copying Pokémon names, logos, characters, artwork, card scans,
or proprietary layouts.

The production site is available at `https://tcg.nghuy.link` and has no backend,
database, authentication, content-management interface, or browser persistence.

## Scope

### Included

- A static Next.js application using the App Router and TypeScript.
- One read-only Proxy concept card.
- An accessible front/back card-flip interaction.
- A locally stored and optimized Proxy thumbnail image.
- Responsive layouts for mobile, tablet, and desktop.
- Terraform-managed AWS static hosting and custom-domain resources.
- GitHub Actions workflows for quality checks, infrastructure planning, and
  production deployment.
- Setup, deployment, verification, and teardown documentation.

### Excluded

- Backend services, Next.js server runtime, API routes, middleware, or SSR.
- Databases, authentication, accounts, or user-specific state.
- Creating, editing, deleting, importing, or exporting cards in the browser.
- Search, filtering, categories, quizzes, scores, or spaced repetition.
- Runtime downloads of card content or images.
- Creation or ownership of the existing `nghuy.link` Route 53 hosted zone.

## Reference Architecture Adaptation

The project adapts `/Users/huyng/ws/aws-serverless-webapp/` as its local AWS
reference. It retains that sample's frontend delivery and delivery-pipeline
patterns:

- Next.js static export.
- Private Amazon S3 bucket.
- Amazon CloudFront using Origin Access Control (OAC).
- Terraform with a one-time remote-state bootstrap.
- GitHub Actions authentication to AWS through OpenID Connect (OIDC).
- Separate pull-request quality/plan and `main` branch deployment workflows.

Because this project explicitly has no backend, it removes the sample's Amazon
Cognito, API Gateway, Lambda, DynamoDB, Amplify authentication, and CloudFront
`/api/*` behavior.

The custom-domain extension adds an ACM certificate in `us-east-1` and Route 53
records for `tcg.nghuy.link`.

## Product Experience

### Page Structure

The single page contains:

1. A compact `DEVOPS TCG` deck header and `01 / 01` card counter.
2. One centered card with a modern full-art presentation.
3. Previous, Flip, and Next controls below the card.
4. A short instruction announcing that the card can be flipped.

Previous and Next are rendered disabled because version one contains one card.
Their logic remains data-driven so future hardcoded cards require no component
redesign.

### Visual Direction

The approved visual direction uses:

- A dark navy stage with restrained cyan and violet lighting.
- A full-bleed thumbnail on the front face.
- A holographic gradient edge, layered highlights, and glass-like content panels.
- Compact metadata, modern typography, rounded geometry, and strong spacing.
- An original `DEVOPS TCG` identity and network-series labeling.

The result may evoke a premium modern trading card, but must not reproduce a
specific Pokémon card frame or use protected Pokémon visual assets.

### Card Front

The front contains:

- Card number `#001`.
- Type label `NETWORK`.
- Concept name `Proxy`.
- Descriptor `INTERMEDIARY`.
- A locally stored network-equipment thumbnail.
- **Basic definition:** “A proxy receives a request from one system and forwards
  it to another on the requester’s behalf.”
- **Key words:** `intermediary`, `forward proxy`, `reverse proxy`, `routing`, and
  `caching`.
- A visible invitation to flip the card.

The proposed thumbnail source is Manuel Luikenga's Unsplash photo “Ethernet
cables connected to the back of a network device,” which the source page marks
as free to use under the Unsplash License:
`https://unsplash.com/photos/ethernet-cables-connected-to-the-back-of-a-network-device-y4GHs9GEFdM`.
The implementation downloads, crops, optimizes, and commits this asset as
`frontend/public/images/proxy-thumbnail.webp`. Production never hotlinks it.
The repository documents its source and attribution.

### Card Back

The back contains no image. It is a text-first surface with:

- Concept name and `ANATOMY / FLOW` label.
- **Components:**
  - Client — originates the request.
  - Proxy — receives traffic and applies routing, security, or caching rules.
  - Destination server — processes the forwarded request and returns a response.
- **How it works:**
  1. The client sends its request to the proxy.
  2. The proxy evaluates the request and applies configured policies.
  3. An allowed request is forwarded to the destination server.
  4. The response returns through the proxy to the client.
- A visible invitation to return to the front.

## Component Design

The frontend separates hardcoded content from presentation:

- `ConceptDeck` owns the active index and deck-level navigation state.
- `ConceptCard` owns front/back state and exposes mouse and keyboard flip
  behavior.
- `CardFront` renders the thumbnail, definition, and keyword chips.
- `CardBack` renders components and the numbered flow.
- `DeckControls` renders Previous, Flip, and Next controls with correct disabled
  states.
- A typed `ConceptCardData` interface defines the required content shape.
- A `conceptCards` constant contains the single Proxy object.

Adding a future concept requires one new typed data object and one local image;
it does not require changes to deck or card component logic.

## Interaction and Accessibility

- Clicking the card or Flip button changes faces.
- When the card has focus, Enter and Space change faces.
- The card exposes a descriptive accessible label and its current face/state.
- The visible content remains semantic HTML rather than being represented only
  by decorative graphics.
- Focus states meet WCAG 2.2 AA visibility expectations.
- Text and controls meet WCAG 2.2 AA contrast expectations.
- The 3D animation honors `prefers-reduced-motion: reduce` by switching faces
  without rotation or transition.
- The local image has meaningful alternative text.
- Disabled Previous and Next controls use actual disabled semantics.
- The layout does not overflow at a 320-pixel viewport width.

## Runtime and Build Data Flow

### Build and Deployment

```text
typed concept data + local image
  -> Next.js production build and static export
  -> frontend/out
  -> aws s3 sync to private site bucket
  -> CloudFront invalidation
```

### User Request

```text
browser
  -> Route 53 alias for tcg.nghuy.link
  -> CloudFront HTTPS distribution
  -> private S3 origin through OAC
  -> static HTML, CSS, JavaScript, and local image
```

There are no runtime API calls, application credentials, cookies, database
queries, user data, or third-party image requests.

## Frontend Technology

The implementation follows the local reference project's established baseline:

- Next.js 14 static export with `output: "export"`.
- React 18 and TypeScript.
- Tailwind CSS for tokens, responsive styling, and reusable visual utilities.
- pnpm 9 with a committed lockfile.
- Node.js 20.x through `.nvmrc` and GitHub Actions.
- Vitest, React Testing Library, and `@testing-library/user-event` for unit and
  component tests.
- Playwright for desktop and mobile end-to-end interaction checks.

No AWS frontend SDK is needed because the application has no authentication or
API integration.

## AWS Infrastructure

### Remote State Bootstrap

As in the reference project, `infra/bootstrap` creates the one-time Terraform
backend:

- A versioned, encrypted, private S3 state bucket.
- A DynamoDB state-lock table, matching the reference repository's Terraform
  1.6 backend convention.

The application stack does not create or destroy its own backend resources.

### Production Stack

`infra/envs/prod` composes focused modules and uses Terraform `>= 1.6`, AWS
provider `~> 5.0`, and two AWS provider configurations:

- The default provider in the chosen deployment region for S3 and Route 53.
- An aliased `us-east-1` provider for CloudFront ACM certificates.

The stack creates:

- A private, encrypted, versioned S3 site bucket with all public access blocked.
- A CloudFront OAC and a bucket policy scoped to the distribution.
- A CloudFront distribution whose only origin is the private site bucket.
- HTTPS redirect, HTTP/2 or newer support, compression, and a managed optimized
  cache policy.
- A response-headers policy providing practical browser security headers.
- An ACM certificate for `tcg.nghuy.link` in `us-east-1`.
- DNS validation records in the existing public `nghuy.link` Route 53 zone.
- Route 53 `A` and `AAAA` alias records targeting CloudFront.

The stack discovers the hosted zone with a Terraform data source using the exact
zone name `nghuy.link.` and `private_zone = false`. It never creates, imports,
or manages the parent hosted zone.

The stack outputs the site bucket name, distribution ID, distribution domain,
certificate ARN, and canonical site URL.

## CI/CD

### Pull Request Quality Workflow

The quality workflow runs on pull requests to `main` and on manual dispatch.
It grants `contents: read` by default and contains these gates:

1. Frontend:
   - Frozen pnpm install.
   - Formatting check.
   - ESLint.
   - TypeScript check.
   - Vitest with coverage.
   - Next.js production build/static export.
   - Playwright test against the built application.
2. Terraform offline quality:
   - `terraform fmt -check -recursive`.
   - `terraform init -backend=false`.
   - `terraform validate`.
   - TFLint.
   - Checkov.
3. Terraform plan when `infra/**` changes:
   - Assume a read-only/plan AWS role through GitHub OIDC.
   - Initialize the remote backend.
   - Run `terraform plan` with the production inputs.

Frontend- or documentation-only pull requests do not contact the Terraform
backend.

### Production Deployment Workflow

The deployment workflow runs on pushes to `main` and manual dispatch. It:

1. Uses a protected GitHub `production` environment.
2. Uses a non-cancelling `deploy-production` concurrency group.
3. Assumes a least-privilege deploy role through GitHub OIDC.
4. Installs dependencies with the frozen lockfile and runs the frontend quality
   gates again.
5. Initializes and applies the production Terraform stack.
6. Captures the bucket and distribution outputs.
7. Builds the static Next.js export.
8. Synchronizes `frontend/out/` to S3 with `--delete`.
9. Creates a CloudFront invalidation for `/*`.
10. Performs an HTTPS smoke check against `https://tcg.nghuy.link`.

No long-lived AWS access keys are stored in GitHub.

## Required Configuration

The repository documentation defines these GitHub values:

### Secrets

- `AWS_PLAN_ROLE_ARN`
- `AWS_DEPLOY_ROLE_ARN`

### Variables

- `AWS_REGION`
- `STATE_BUCKET_NAME`
- `LOCK_TABLE_NAME`
- `SITE_BUCKET_NAME`
- `ROUTE53_ZONE_NAME` with value `nghuy.link`
- `SITE_DOMAIN` with value `tcg.nghuy.link`

Terraform variable defaults may encode the two domain values, but workflows pass
them explicitly so deployment intent remains visible.

## Failure Handling

- An incomplete concept object fails TypeScript compilation.
- Content-contract unit tests catch empty required strings and arrays.
- If the local thumbnail cannot render, the front shows a styled fallback with
  readable alternative context; definition and keywords remain usable.
- Deployment stops before S3 synchronization if any quality gate, Terraform
  apply, or frontend build fails.
- S3 synchronization happens only after Terraform produces valid outputs.
- The final smoke check makes DNS, certificate, CloudFront, and uploaded-asset
  failures visible in the workflow.
- CloudFront serves a custom static 404 page for unknown asset/document paths;
  the application does not silently rewrite every missing asset to HTML.

## Test Strategy and Acceptance Criteria

### Unit and Component Tests

- The Proxy card front renders the exact basic definition and five keywords.
- The back renders all three components and all four flow steps.
- Mouse, Enter, Space, and Flip-button interactions change the visible face.
- Previous and Next are disabled for a one-card deck.
- The image uses the committed local asset path and exposes alternative text.
- An image error reveals the readable fallback.
- Reduced-motion mode applies a non-animated face transition.
- The content collection passes runtime contract assertions in tests.

### End-to-End Tests

- At a desktop viewport, `#001 Proxy` loads front-first and flips to Components
  and How It Works.
- At a 320-pixel mobile viewport, all card content and controls remain reachable
  without horizontal page overflow.
- Keyboard-only navigation focuses the card and controls, flips both directions,
  and preserves visible focus.
- The production export serves the locally bundled thumbnail without a request
  to an external image host.

### Infrastructure Checks

- Terraform formatting and validation pass from a clean checkout.
- TFLint and Checkov pass with documented, narrowly scoped skips only if a check
  conflicts with an explicit architecture requirement.
- The plan contains only the frontend, certificate, DNS, and supporting hosting
  resources described here.
- The S3 bucket rejects public access and CloudFront can fetch objects through
  OAC.
- `https://tcg.nghuy.link` returns a successful response with a valid certificate
  after deployment.

## Documentation Deliverables

- Root README with architecture, local development, testing, and CI/CD summary.
- Frontend README with content-extension instructions and asset attribution.
- Infrastructure README covering bootstrap, variables, outputs, apply, and safe
  teardown order.
- Architecture document with runtime and deployment diagrams.
- `.env` files are unnecessary because the static frontend consumes no runtime
  configuration.

## Safe Teardown Order

1. Destroy `infra/envs/prod` after emptying the versioned site bucket as
   documented.
2. Confirm no application state still uses the remote backend.
3. Empty all versions from the state bucket.
4. Destroy `infra/bootstrap` only when the backend is no longer needed.

Destroying the application stack removes only `tcg.nghuy.link` records and its
certificate. It does not remove the `nghuy.link` hosted zone or other records.
