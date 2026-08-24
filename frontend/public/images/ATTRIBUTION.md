# Image attribution

`proxy-thumbnail.webp` is derived from “Ethernet cables connected to the back
of a network device” by Manuel Luikenga.

- Source: https://unsplash.com/photos/ethernet-cables-connected-to-the-back-of-a-network-device-y4GHs9GEFdM
- License: https://unsplash.com/license

## Project-generated illustrations

The following illustrations were generated specifically for DevOps TCG with
OpenAI image generation on 2026-08-15 and are stored locally:

- `cdn-thumbnail.webp`
- `nginx-thumbnail.webp`
- `reverse-proxy-thumbnail.webp`
- `osi-model-thumbnail.webp`
- `dns-thumbnail.webp`
- `ssl-thumbnail.webp`
- `tls-thumbnail.webp`
- `ssh-thumbnail.webp`

## Project-drawn illustrations

`lambda-throttle-thumbnail.webp` was drawn for DevOps TCG on 2026-08-19,
`public-ca-thumbnail.webp` and `private-ca-thumbnail.webp` on 2026-08-20, and
`jwt-thumbnail.webp` on 2026-08-21, each as an isometric SVG scene composed
in-repo and rendered to WebP with headless Chromium. They contain no
third-party artwork.

## Sketch-theme drawings

The sixteen `*-sketch.svg` files are original hand-authored SVG line drawings
made for DevOps TCG on 2026-08-19, on 2026-08-20 for the two certificate
authority cards, on 2026-08-21 for JWT, on 2026-08-23 for AWS Lambda, and on
2026-08-24 for the two IAM cards. Their line work is plain `<path>` geometry —
no tracing of any third-party image, no generator, and no external asset — and
they are the artwork the sketch theme shows in place of the photographs above.
Ink is `#1d1d1b`, the highlighter block is `#fff2c4`, and the subject block is
`#dbe7ff`, matching the sketch theme's tokens. `aws-lambda-sketch.svg`,
`aws-iam-role-sketch.svg` and `aws-iam-policy-sketch.svg` are the exceptions to
the own-geometry rule: each drawing is hand-authored, but the AWS mark inside
it is an official AWS icon described below.

## AWS Architecture Icons

`aws-lambda-thumbnail.webp` and `aws-lambda-sketch.svg` embed the official AWS
Lambda service icon, `Arch_AWS-Lambda_48`, taken from the AWS Architecture
Icons asset package (Release 23-2026.04.28). It appears exactly as AWS ships
it — the `#ED7100` Compute tile and the white lambda mark, uniformly scaled,
neither recoloured nor otherwise modified — and it stays that way on both
themes, since the terms below do not permit altering the icons. Everything
around it in those two files was drawn for DevOps TCG on 2026-08-23.

The four IAM files embed two resource icons from the same asset package, out of
its `Resource-Icons_04302026` set:

- `aws-iam-role-thumbnail.webp` and `aws-iam-role-sketch.svg` carry
  `Res_AWS-Identity-Access-Management_Role_48`.
- `aws-iam-policy-thumbnail.webp` and `aws-iam-policy-sketch.svg` carry
  `Res_AWS-Identity-Access-Management_Permissions_48`.

Both are the `#DD344C` line-art marks AWS publishes for light backgrounds, and
both appear uniformly scaled, neither recoloured nor otherwise modified. That
is why the neon theme seats each one on a light plate instead of inverting it:
the terms do not permit a dark-theme variant of an icon AWS does not ship one
for. Everything around them in those four files was drawn for DevOps TCG on
2026-08-24.

- Source: https://aws.amazon.com/architecture/icons/
- Terms: https://aws.amazon.com/architecture/icons/ ("AWS Architecture Icons
  Terms of Use", linked from that page)

AWS, AWS Lambda and AWS Identity and Access Management are trademarks of
Amazon.com, Inc. or its affiliates. This deck is an independent study project
and is not affiliated with, endorsed by, or sponsored by AWS.
