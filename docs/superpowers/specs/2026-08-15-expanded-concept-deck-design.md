# Expanded DevOps Concept Deck Design

**Date:** 2026-08-15
**Status:** Approved for implementation

## Purpose

Expand the existing DevOps TCG study deck from one card to nine cards while
preserving its focused, accessible flash-card experience. The new cards teach
common networking, web delivery, and transport-security concepts at the same
introductory depth as the existing Proxy card.

## Scope

The implementation adds these cards in order:

1. `#001` Proxy (existing)
2. `#002` CDN
3. `#003` NGINX
4. `#004` Reverse Proxy
5. `#005` OSI Model
6. `#006` DNS
7. `#007` SSL
8. `#008` TLS
9. `#009` SSH

The requested term “TSL” is normalized to TLS (Transport Layer Security). SSL
and TLS remain separate cards: SSL explains the obsolete predecessor and its
historical role, while TLS explains the modern protocol used to protect data in
transit. The content must not recommend SSL for current deployments.

Out of scope:

- Category filters, search, grid browsing, or favorites.
- A route or shareable URL for each card.
- User-created cards, persistence, authentication, or APIs.
- Changes to AWS infrastructure or deployment workflows.
- Changes to the established card-front and card-back visual structure.

## Content Model

The existing `ConceptCardData` contract remains unchanged. Every new card
contains:

- A unique slug-like `id` and sequential `cardNumber`.
- A series, broad type, title, and short descriptor.
- One committed local WebP illustration with meaningful alternative text.
- A concise, technically accurate definition.
- A non-empty keyword collection.
- Three named components with short descriptions.
- Four sequential “how it works” steps numbered 1 through 4.

The hardcoded `conceptCards` array remains the source of truth. The card order in
that array determines navigation order and numbering. No remote content source
or runtime data fetch is introduced.

## Learning Content Direction

Each card explains one bounded concept without turning the back face into a
reference manual:

- **CDN:** edge locations cache and deliver content closer to users, with an
  origin used on cache misses.
- **NGINX:** a web server and traffic-management process that can serve static
  content and operate as a reverse proxy or load balancer.
- **Reverse Proxy:** a server-side intermediary that receives client traffic
  and forwards it to selected backend services.
- **OSI Model:** seven conceptual layers that describe how network communication
  moves from application data to physical transmission and back.
- **DNS:** resolvers and authoritative name servers translate domain names into
  records such as IP addresses.
- **SSL:** the deprecated predecessor to TLS, included to explain legacy naming
  and why modern systems must not negotiate SSL.
- **TLS:** the modern protocol that authenticates peers and provides encrypted,
  integrity-protected transport.
- **SSH:** authenticated, encrypted remote access and command execution over an
  untrusted network.

Definitions avoid absolute claims that depend on a single product or deployment
topology. NGINX is written as the product name and displayed as `NGINX`.

## Illustration System

Each new card receives a unique AI-generated illustration committed beneath
`frontend/public/images/`. Assets use a consistent neon technical isometric
direction:

- Dark infrastructure environments.
- Cyan and violet luminous connection paths.
- A distinct visual metaphor for the topic.
- No text, trademarks, logos, mascots, or copied trading-card artwork.
- No people or unnecessary decorative detail.
- A composition that remains legible when cropped inside the existing card
  thumbnail frame.

Images are optimized as WebP files before commit. The attribution file records
that the eight assets were generated for this project rather than sourced from
a third party. The existing Proxy asset and its attribution remain unchanged.

## Deck Interaction

The existing click, Enter, Space, and explicit Flip button behavior remains
unchanged. Previous and Next continue to stop at the first and last cards. When
navigation selects another card, React keys the card by its unique ID so the new
card begins on its front face.

The header counter becomes stateful and displays the active one-based position
and total in two-digit form, beginning at `01 / 09` and ending at `09 / 09`.
Because `ConceptDeck` owns the active index, the existing deck header markup
moves from `page.tsx` into `ConceptDeck`, where the counter can be rendered from
that state without a callback or duplicate state. Counter updates use a polite
live region so assistive technology announces them without interrupting other
content.

No wrap-around, swipe gesture, keyboard arrow navigation, filter, or randomize
behavior is added.

## Component Boundaries

- `conceptCards.ts` owns all nine typed content records.
- `ConceptDeck` continues to own the active index, navigation bounds, and current
  card selection; it additionally renders the existing deck header and live
  counter.
- `ConceptCard`, `CardFront`, `CardBack`, and `DeckControls` retain their current
  responsibilities and consume the existing data contract.
- `page.tsx` renders the decorative page shell, deck, and usage instruction
  without maintaining a second copy of active-card state.

This keeps the expansion data-driven and avoids a new global store, context, or
client-side route layer.

## Accessibility and Failure Behavior

- Every illustration has concept-specific alternative text.
- Missing-image fallback behavior continues to leave the definition readable.
- Navigation buttons use their current native disabled behavior at deck bounds.
- The card’s accessible name continues to expose the current title and face.
- Reduced-motion behavior and the 320-pixel no-overflow contract remain intact.
- Long titles such as “Reverse Proxy” and “OSI Model” must fit without clipping
  at supported mobile widths and at 200% text zoom.

## Testing

Implementation follows test-driven development.

Data tests first fail for the missing expansion, then verify:

- Exactly nine cards in the approved order.
- Sequential `#001` through `#009` numbers.
- Unique IDs, card numbers, and local image paths.
- Complete non-empty required content.
- Exactly three components and four sequential steps for every card.
- SSL is described as deprecated and TLS is represented as the modern protocol.

Component tests first fail for the missing live counter, then verify:

- Initial `01 / 09` rendering.
- Next and Previous update both card content and the counter.
- First/last navigation bounds remain correct.
- Navigating away from a flipped card presents the next card front-first.

Browser tests verify the shipped deck rather than a synthetic two-card fixture:

- Navigation from Proxy through at least the next card and to the last card.
- Correct counter changes and boundary states.
- All card images are local and load successfully.
- Existing keyboard, reduced-motion, flip, and small-screen behaviors still
  pass.

The final verification runs formatting, linting, type checking, unit tests with
coverage, a production build, and Playwright tests.

## Success Criteria

- Users can study all nine concepts in the approved order.
- Every new card has accurate beginner-friendly content and a unique consistent
  illustration.
- The live counter always matches the active card.
- Existing accessibility, responsive layout, and local-only asset contracts are
  preserved.
- The complete frontend quality suite passes without infrastructure changes.
