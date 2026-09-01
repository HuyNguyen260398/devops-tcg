import type { ConceptCardData } from "@/types/concept";

export const conceptCards = [
  {
    id: "proxy",
    cardNumber: "#001",
    type: "NETWORK",
    title: "Proxy",
    image: {
      src: "/images/proxy-thumbnail.webp",
      alt: "Ethernet cables connected to network equipment",
      sketch: {
        src: "/images/proxy-sketch.svg",
        alt: "Line drawing of a client, a proxy, and a destination server joined by arrows",
      },
    },
    definition:
      "A proxy receives a request from one system and forwards it to another on the requester’s behalf.",
    keywords: [
      "intermediary",
      "forward proxy",
      "reverse proxy",
      "routing",
      "caching",
    ],
    components: [
      { name: "Client", description: "Originates the request." },
      {
        name: "Proxy",
        description:
          "Receives traffic and applies routing, security, or caching rules.",
      },
      {
        name: "Destination server",
        description: "Processes the forwarded request and returns a response.",
      },
    ],
    howItWorks: [
      { step: 1, description: "The client sends its request to the proxy." },
      {
        step: 2,
        description:
          "The proxy evaluates the request and applies configured policies.",
      },
      {
        step: 3,
        description:
          "An allowed request is forwarded to the destination server.",
      },
      {
        step: 4,
        description: "The response returns through the proxy to the client.",
      },
    ],
  },
  {
    id: "cdn",
    cardNumber: "#002",
    type: "NETWORK",
    title: "CDN",
    image: {
      src: "/images/cdn-thumbnail.webp",
      alt: "Isometric CDN edge nodes distributing content around a globe",
      sketch: {
        src: "/images/cdn-sketch.svg",
        alt: "Line drawing of an origin server feeding edge locations set around a globe",
      },
    },
    definition:
      "A content delivery network distributes cached content across geographically dispersed edge locations so users can receive it from a nearby server.",
    keywords: ["edge location", "origin", "cache", "latency", "cache hit"],
    components: [
      { name: "Client", description: "Requests content from the CDN." },
      {
        name: "Edge location",
        description: "Serves cached content from a location near the client.",
      },
      {
        name: "Origin server",
        description: "Provides the canonical content when the edge has a miss.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description: "The client request is routed to a nearby edge location.",
      },
      {
        step: 2,
        description: "The edge checks whether the requested content is cached.",
      },
      {
        step: 3,
        description:
          "On a cache miss, the edge fetches content from the origin.",
      },
      {
        step: 4,
        description:
          "The edge caches the content and returns it to the client.",
      },
    ],
  },
  {
    id: "nginx",
    cardNumber: "#003",
    type: "PLATFORM",
    title: "NGINX",
    image: {
      src: "/images/nginx-thumbnail.webp",
      alt: "Isometric web server routing requests to application services",
      sketch: {
        src: "/images/nginx-sketch.svg",
        alt: "Line drawing of three requests entering a web server and fanning out to application services",
      },
    },
    definition:
      "NGINX is a high-performance web server that can also route, proxy, cache, and load-balance HTTP and TCP traffic.",
    keywords: [
      "web server",
      "event loop",
      "reverse proxy",
      "load balancing",
      "static files",
    ],
    components: [
      {
        name: "Configuration",
        description: "Defines listeners, virtual servers, and routing rules.",
      },
      {
        name: "Worker process",
        description: "Uses event-driven processing to handle many connections.",
      },
      {
        name: "Upstream",
        description: "Receives requests that NGINX proxies to an application.",
      },
    ],
    howItWorks: [
      { step: 1, description: "NGINX accepts an incoming connection." },
      {
        step: 2,
        description:
          "It matches the request against server and location rules.",
      },
      {
        step: 3,
        description: "It serves content locally or sends the request upstream.",
      },
      {
        step: 4,
        description: "NGINX returns the resulting response to the client.",
      },
    ],
  },
  {
    id: "reverse-proxy",
    cardNumber: "#004",
    type: "NETWORK",
    title: "Reverse Proxy",
    image: {
      src: "/images/reverse-proxy-thumbnail.webp",
      alt: "Isometric reverse proxy directing clients to backend servers",
      sketch: {
        src: "/images/reverse-proxy-sketch.svg",
        alt: "Line drawing of three clients reaching two backend servers through one reverse proxy",
      },
    },
    definition:
      "A reverse proxy receives client traffic for one or more services, then forwards each request to an appropriate backend.",
    keywords: [
      "backend",
      "routing",
      "load balancing",
      "TLS termination",
      "gateway",
    ],
    components: [
      { name: "Client", description: "Uses the public service endpoint." },
      {
        name: "Reverse proxy",
        description: "Applies policies and selects an appropriate backend.",
      },
      {
        name: "Backend service",
        description: "Processes the work forwarded by the reverse proxy.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The client sends a request to the reverse proxy endpoint.",
      },
      {
        step: 2,
        description: "The proxy evaluates routing and security policies.",
      },
      {
        step: 3,
        description:
          "A selected backend service handles the forwarded request.",
      },
      {
        step: 4,
        description: "The response returns to the client through the proxy.",
      },
    ],
  },
  {
    id: "osi-model",
    cardNumber: "#005",
    type: "NETWORK",
    title: "OSI Model",
    image: {
      src: "/images/osi-model-thumbnail.webp",
      alt: "Seven illuminated network layers in an isometric stack",
      sketch: {
        src: "/images/osi-model-sketch.svg",
        alt: "Line drawing of seven stacked network layers with an arrow running down them",
      },
    },
    definition:
      "The OSI model organizes network communication into seven conceptual layers so protocols and responsibilities can be discussed consistently.",
    keywords: ["seven layers", "encapsulation", "protocol", "packet", "frame"],
    components: [
      {
        name: "Application layers (7–5)",
        description: "Shape user-facing data and communication sessions.",
      },
      {
        name: "Transport layer (4)",
        description: "Manages end-to-end delivery between hosts.",
      },
      {
        name: "Network access layers (3–1)",
        description: "Address, frame, signal, and physically transmit data.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description: "An application creates data for another system.",
      },
      {
        step: 2,
        description: "Each descending layer adds its control information.",
      },
      {
        step: 3,
        description: "The physical layer transmits the resulting bits.",
      },
      {
        step: 4,
        description: "The receiver removes layer information in reverse order.",
      },
    ],
  },
  {
    id: "dns",
    cardNumber: "#006",
    type: "NETWORK",
    title: "DNS",
    image: {
      src: "/images/dns-thumbnail.webp",
      alt: "Isometric DNS hierarchy resolving a domain to a server",
      sketch: {
        src: "/images/dns-sketch.svg",
        alt: "Line drawing of a lookup descending a name hierarchy to an answering server",
      },
    },
    definition:
      "The Domain Name System maps human-readable domain names to records that computers use to locate and communicate with services.",
    keywords: ["resolver", "authoritative", "record", "cache", "nameserver"],
    components: [
      { name: "Stub resolver", description: "Starts the lookup for a device." },
      {
        name: "Recursive resolver",
        description: "Queries other name servers and caches their answers.",
      },
      {
        name: "Authoritative nameserver",
        description: "Returns source-of-truth records for a DNS zone.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description: "The device asks a recursive resolver for a DNS record.",
      },
      {
        step: 2,
        description:
          "The resolver uses its cache or queries the DNS hierarchy.",
      },
      {
        step: 3,
        description:
          "An authoritative nameserver returns the requested record.",
      },
      {
        step: 4,
        description:
          "The resolver caches the answer and returns it to the device.",
      },
    ],
  },
  {
    id: "ssl",
    cardNumber: "#007",
    type: "SECURITY",
    title: "SSL",
    image: {
      src: "/images/ssl-thumbnail.webp",
      alt: "Dim legacy security tunnel beside a deprecated lock",
      sketch: {
        src: "/images/ssl-sketch.svg",
        alt: "Line drawing of a padlock struck through, its tunnel broken on both sides",
      },
    },
    definition:
      "Secure Sockets Layer (SSL) is a deprecated predecessor to TLS; modern systems should disable SSL and use TLS instead.",
    keywords: [
      "legacy protocol",
      "certificate",
      "encryption",
      "handshake",
      "deprecated",
    ],
    components: [
      {
        name: "Legacy client",
        description: "Offers an obsolete SSL protocol version.",
      },
      {
        name: "Legacy server",
        description: "Selects legacy parameters when SSL remains enabled.",
      },
      {
        name: "Certificate",
        description: "Binds a server identity to a public key.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description: "Peers negotiate a legacy protocol version and cipher.",
      },
      {
        step: 2,
        description: "The legacy server presents its certificate.",
      },
      {
        step: 3,
        description: "The historical handshake derives shared session keys.",
      },
      {
        step: 4,
        description:
          "SSL encrypts records, but this obsolete protocol must be replaced by TLS.",
      },
    ],
  },
  {
    id: "tls",
    cardNumber: "#008",
    type: "SECURITY",
    title: "TLS",
    image: {
      src: "/images/tls-thumbnail.webp",
      alt: "Bright encrypted TLS tunnel joining a client and server",
      sketch: {
        src: "/images/tls-sketch.svg",
        alt: "Line drawing of a sealed pipe joining two hosts with a closed padlock at its centre",
      },
    },
    definition:
      "Transport Layer Security (TLS) is the modern protocol for authenticating servers and optionally clients while protecting data in transit with encryption and integrity checks.",
    keywords: [
      "certificate",
      "handshake",
      "encryption",
      "integrity",
      "session key",
    ],
    components: [
      { name: "Client", description: "Initiates secure negotiation." },
      {
        name: "Server certificate",
        description: "Proves the server identity to the client.",
      },
      {
        name: "Session keys",
        description: "Encrypt and authenticate application records.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description: "A ClientHello offers supported security parameters.",
      },
      {
        step: 2,
        description:
          "The server selects parameters and presents its certificate.",
      },
      {
        step: 3,
        description:
          "The client authenticates the server and both derive keys; client authentication is optional.",
      },
      {
        step: 4,
        description: "Encrypted, integrity-protected application data flows.",
      },
    ],
  },
  {
    id: "ssh",
    cardNumber: "#009",
    type: "SECURITY",
    title: "SSH",
    image: {
      src: "/images/ssh-thumbnail.webp",
      alt: "Encrypted terminal connection to a remote server",
      sketch: {
        src: "/images/ssh-sketch.svg",
        alt: "Line drawing of a terminal window joined to a remote host by a key",
      },
    },
    definition:
      "Secure Shell (SSH) provides authenticated, encrypted remote login, command execution, and tunneling over an untrusted network.",
    keywords: ["remote access", "host key", "public key", "port 22", "tunnel"],
    components: [
      { name: "SSH client", description: "Starts the remote session." },
      {
        name: "SSH daemon",
        description: "Accepts and manages connections on the remote host.",
      },
      {
        name: "Credentials",
        description: "Authenticate the server host and connecting user.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The client opens a transport connection to the SSH server.",
      },
      {
        step: 2,
        description: "Peers negotiate security and verify the server host key.",
      },
      {
        step: 3,
        description: "The user authenticates with an approved method.",
      },
      {
        step: 4,
        description:
          "An encrypted channel carries commands, files, or tunnels.",
      },
    ],
  },
  {
    id: "lambda-throttle",
    cardNumber: "#010",
    type: "COMPUTE",
    title: "Lambda Throttle",
    image: {
      src: "/images/lambda-throttle-thumbnail.webp",
      alt: "Isometric queue of Lambda invocations blocked by a concurrency wall",
      sketch: {
        src: "/images/lambda-throttle-sketch.svg",
        alt: "Line drawing of queued invocations stopped by a brick wall, with one passing above it",
      },
    },
    definition:
      "AWS Lambda throttles a function once its concurrent executions reach the available concurrency limit, rejecting further invocations with a 429 TooManyRequestsException until capacity frees up.",
    keywords: [
      "concurrency limit",
      "reserved concurrency",
      "burst limit",
      "429",
      "retry",
    ],
    components: [
      {
        name: "Invocation source",
        description:
          "Calls the function directly or through an event source such as a queue or stream.",
      },
      {
        name: "Concurrency limit",
        description:
          "Caps simultaneous executions through the account quota, reserved concurrency, and the burst rate.",
      },
      {
        name: "Throttle response",
        description:
          "Rejects invocations beyond the limit and records them in the Throttles metric.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "An invocation arrives and Lambda counts the executions already running.",
      },
      {
        step: 2,
        description:
          "Spare concurrency lets Lambda run the request in an execution environment.",
      },
      {
        step: 3,
        description:
          "With no concurrency left, Lambda throttles the invocation and returns a 429 TooManyRequestsException.",
      },
      {
        step: 4,
        description:
          "Synchronous callers retry themselves, while asynchronous and event source invocations are retried by Lambda until they succeed or expire.",
      },
    ],
  },
  {
    id: "public-ca",
    cardNumber: "#011",
    type: "SECURITY",
    title: "Public CA",
    image: {
      src: "/images/public-ca-thumbnail.webp",
      alt: "Isometric certificate authority signing a certificate that browsers around a globe already trust",
      sketch: {
        src: "/images/public-ca-sketch.svg",
        alt: "Line drawing of a root authority signing a stamped certificate accepted by browser windows",
      },
    },
    definition:
      "A public certificate authority issues certificates that browsers and operating systems already trust, so any client on the internet can verify the holder without extra configuration.",
    keywords: [
      "root program",
      "domain validation",
      "trust store",
      "chain of trust",
      "publicly trusted",
    ],
    components: [
      {
        name: "Root CA",
        description:
          "Anchors trust in browser and operating system trust stores.",
      },
      {
        name: "Intermediate CA",
        description: "Signs subscriber certificates on the root's behalf.",
      },
      {
        name: "Domain validation",
        description: "Proves the applicant controls the name being certified.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A subscriber requests a certificate for a domain it operates.",
      },
      {
        step: 2,
        description:
          "The certificate authority validates control of that domain before issuing anything.",
      },
      {
        step: 3,
        description:
          "An intermediate signs the certificate, chaining it to a trusted root.",
      },
      {
        step: 4,
        description:
          "Clients verify the chain against their own trust store, so nothing has to be configured.",
      },
    ],
  },
  {
    id: "private-ca",
    cardNumber: "#012",
    type: "SECURITY",
    title: "Private CA",
    image: {
      src: "/images/private-ca-thumbnail.webp",
      alt: "Isometric internal certificate authority issuing certificates inside a closed organization boundary",
      sketch: {
        src: "/images/private-ca-sketch.svg",
        alt: "Line drawing of a private root inside a fenced boundary signing certificates for internal services",
      },
    },
    definition:
      "A private certificate authority issues certificates for an organization's own systems, and only clients configured to trust its root will accept them.",
    keywords: [
      "internal PKI",
      "private root",
      "trust distribution",
      "mTLS",
      "service identity",
    ],
    components: [
      {
        name: "Private root",
        description:
          "Acts as the organization's own trust anchor, kept offline.",
      },
      {
        name: "Issuing CA",
        description: "Signs certificates for internal services and workloads.",
      },
      {
        name: "Trust distribution",
        description: "Installs the root in every client that must accept it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The organization creates its own root and keeps it offline.",
      },
      {
        step: 2,
        description:
          "That root is distributed to every client and host that must trust it.",
      },
      {
        step: 3,
        description:
          "An issuing certificate authority signs certificates for internal services and workloads.",
      },
      {
        step: 4,
        description:
          "Configured clients accept those certificates, while anything outside the organization does not.",
      },
    ],
  },
  {
    id: "jwt",
    cardNumber: "#013",
    type: "SECURITY",
    title: "JWT",
    image: {
      src: "/images/jwt-thumbnail.webp",
      alt: "Isometric authorization server signing a token that a service verifies on its own",
      sketch: {
        src: "/images/jwt-sketch.svg",
        alt: "Line drawing of a three-part token between an issuer rack holding a key and a shield marked with a check",
      },
    },
    definition:
      "A JSON Web Token carries signed claims about a subject, so any service holding the issuer's key can verify the caller without calling back to the issuer.",
    keywords: ["signed claims", "issuer", "signature", "expiry", "stateless"],
    components: [
      {
        name: "Issuer",
        description:
          "Authenticates the subject and signs the token with its key.",
      },
      {
        name: "Token",
        description:
          "Carries the claims in three base64url parts, so the payload is encoded and readable, not encrypted.",
      },
      {
        name: "Verifying service",
        description:
          "Holds the issuer's key and decides whether to accept the token.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description: "The subject authenticates with the issuer.",
      },
      {
        step: 2,
        description:
          "The issuer signs a token carrying the claims and an expiry.",
      },
      {
        step: 3,
        description: "The subject presents that token with each request.",
      },
      {
        step: 4,
        description:
          "The service verifies the signature against the issuer's key and rejects an altered or expired token, with no lookup of its own.",
      },
    ],
  },
  {
    id: "aws-lambda",
    cardNumber: "#014",
    type: "COMPUTE",
    title: "AWS Lambda",
    image: {
      src: "/images/aws-lambda-thumbnail.webp",
      alt: "Isometric event source invoking a Lambda function whose execution environments scale out behind it",
      sketch: {
        src: "/images/aws-lambda-sketch.svg",
        alt: "Line drawing of an event reaching a Lambda function that returns a result, with spare execution environments stacked behind it",
      },
    },
    definition:
      "AWS Lambda runs a function in an execution environment it creates on demand for each event, so there is no server to provision and the bill covers only the time the code runs.",
    keywords: [
      "serverless",
      "event source",
      "handler",
      "execution environment",
      "cold start",
    ],
    components: [
      {
        name: "Event source",
        description:
          "Delivers the event that invokes the function, whether a direct call, an HTTP request, or a queue, stream, or bucket notification.",
      },
      {
        name: "Function",
        description:
          "Packages the handler, its runtime, and settings such as memory, timeout, and environment variables.",
      },
      {
        name: "Execution environment",
        description:
          "The isolated sandbox Lambda starts to run the handler and then keeps for a while to serve later events.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "An event source invokes the function and Lambda looks for an execution environment already idle.",
      },
      {
        step: 2,
        description:
          "With none free, Lambda pays a cold start: it provisions an environment, downloads the package, and runs the initialisation code outside the handler.",
      },
      {
        step: 3,
        description:
          "The handler receives the event, runs until it returns or hits the configured timeout, and Lambda bills the duration and memory it used.",
      },
      {
        step: 4,
        description:
          "Lambda freezes the environment for reuse by the next event, and meets concurrent events by scaling out more environments rather than queueing behind one.",
      },
    ],
  },
  {
    id: "aws-iam-role",
    cardNumber: "#015",
    type: "SECURITY",
    title: "AWS IAM Role",
    image: {
      src: "/images/aws-iam-role-thumbnail.webp",
      alt: "Isometric principal passing a trust gate to assume a role and collect an expiring credential set",
      sketch: {
        src: "/images/aws-iam-role-sketch.svg",
        alt: "Line drawing of a service assuming a role through a trust gate and receiving a session badge marked with a clock",
      },
    },
    definition:
      "An IAM role is an identity nobody owns and nobody signs in as: a principal assumes it and is handed temporary credentials for one session, so access is borrowed for a while rather than issued as a lasting secret.",
    keywords: [
      "identity",
      "trust policy",
      "AssumeRole",
      "temporary credentials",
      "STS",
    ],
    components: [
      {
        name: "Trust policy",
        description:
          "Names who may assume the role — a service, another account, or a federated identity provider — and is the only policy that answers that question.",
      },
      {
        name: "Permissions policies",
        description:
          "The identity policies attached to the role, which decide what an assumed session is allowed to do once it exists.",
      },
      {
        name: "STS",
        description:
          "The token service that mints the session's access key, secret, and session token, and stamps them with an expiry.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A principal — an EC2 instance, a Lambda function, a user, or a workload in another account — calls AssumeRole on the role's ARN.",
      },
      {
        step: 2,
        description:
          "IAM reads the trust policy first: unless it names that principal, the call is refused before any permission is even considered.",
      },
      {
        step: 3,
        description:
          "STS returns a temporary credential set for the session and records when it expires, typically an hour later.",
      },
      {
        step: 4,
        description:
          "Requests signed with those credentials are judged against the role's permissions, and stop working the moment the session expires rather than waiting to be revoked.",
      },
    ],
  },
  {
    id: "aws-iam-policy",
    cardNumber: "#016",
    type: "SECURITY",
    title: "AWS IAM Policy",
    image: {
      src: "/images/aws-iam-policy-thumbnail.webp",
      alt: "Isometric request meeting a policy document whose deny tile stands in front of its allow tile",
      sketch: {
        src: "/images/aws-iam-policy-sketch.svg",
        alt: "Line drawing of a request reaching a policy document of statements, with a deny stamp overlapping the allow beside it",
      },
    },
    definition:
      "An IAM policy is a JSON document of statements that allow or deny actions on resources, and AWS reads every policy that applies to a request together before deciding.",
    keywords: [
      "JSON document",
      "statement",
      "least privilege",
      "explicit deny",
      "condition",
    ],
    components: [
      {
        name: "Statement",
        description:
          "The unit AWS evaluates: an Effect of Allow or Deny, the Actions it covers, the Resources it covers, and an optional Condition.",
      },
      {
        name: "Identity and resource policies",
        description:
          "The same document attached in two places — to a user, group, or role, or to the resource itself, which can also grant across accounts.",
      },
      {
        name: "Condition",
        description:
          "Keys that narrow when a statement applies at all, such as the source network, whether MFA was used, or a tag on the resource.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A signed request arrives naming a principal, an action, and the resource it means to act on.",
      },
      {
        step: 2,
        description:
          "AWS gathers every policy in scope — the principal's identity policies, the resource's own policy, any permissions boundary, session policy, or service control policy.",
      },
      {
        step: 3,
        description:
          "An explicit deny in any one of them ends the evaluation there, and no allow anywhere else can overrule it.",
      },
      {
        step: 4,
        description:
          "Otherwise the request still needs an allow that matches it, because the default is deny — a permission nobody granted is one the request does not have.",
      },
    ],
  },
  {
    id: "oidc",
    cardNumber: "#017",
    type: "SECURITY",
    title: "OIDC",
    image: {
      src: "/images/oidc-thumbnail.webp",
      alt: "Isometric identity provider authenticating a user and handing an application a signed identity card",
      sketch: {
        src: "/images/oidc-sketch.svg",
        alt: "Line drawing of a person reaching a provider holding a key, which issues an identity card that an application checks",
      },
    },
    definition:
      "OpenID Connect is an identity layer over OAuth 2.0: the provider authenticates the user and returns a signed ID token saying who they are, so an application can learn the user's identity without ever handling their password.",
    keywords: [
      "ID token",
      "identity provider",
      "relying party",
      "authorization code",
      "single sign-on",
    ],
    components: [
      {
        name: "Identity provider",
        description:
          "Authenticates the user, issues the ID token, and publishes the signing keys anyone verifying it needs.",
      },
      {
        name: "Relying party",
        description:
          "The application that sends the user to the provider and reads the identity out of the token it gets back.",
      },
      {
        name: "ID token",
        description:
          "A JWT of claims about the user — subject, issuer, audience, expiry — and the thing OAuth 2.0 alone never states; an access token grants access and is not proof of who is calling.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The relying party redirects the browser to the provider, asking for the openid scope.",
      },
      {
        step: 2,
        description:
          "The provider authenticates the user with whatever it requires, and those credentials never reach the relying party.",
      },
      {
        step: 3,
        description:
          "The browser returns with a short-lived authorization code, which the relying party exchanges at the token endpoint for an ID token.",
      },
      {
        step: 4,
        description:
          "The relying party verifies the signature against the provider's published keys and checks the issuer, audience, and expiry before believing the identity.",
      },
    ],
  },
  {
    id: "kafka",
    cardNumber: "#018",
    type: "PLATFORM",
    title: "Kafka",
    image: {
      src: "/images/kafka-thumbnail.webp",
      alt: "Isometric scene of a producer feeding a topic whose segmented log two consumer groups read from different cells",
      sketch: {
        src: "/images/kafka-sketch.svg",
        alt: "Line drawing of a producer appending records to a segmented log that two consumer groups read at different points",
      },
    },
    definition:
      "Apache Kafka is a distributed event streaming platform: producers append events to partitioned topics that brokers store on disk and retain for a set period, so many independent consumers can read the same stream at their own pace.",
    keywords: [
      "event streaming",
      "topic",
      "partition",
      "offset",
      "consumer group",
    ],
    components: [
      {
        name: "Broker cluster",
        description:
          "Holds the topics on disk and replicates every partition across brokers, so the stream outlives any one machine.",
      },
      {
        name: "Topic",
        description:
          "A named, append-only log split into partitions, where every event keeps a numbered offset until retention expires — reading an event does not remove it.",
      },
      {
        name: "Producers and consumer groups",
        description:
          "Producers append events without knowing who reads them, and each consumer group tracks its own offset, so a second group reads the same events without disturbing the first.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A producer sends an event to a topic, and the key it sets decides which partition the event lands in.",
      },
      {
        step: 2,
        description:
          "The broker appends the event to the end of that partition's log on disk and copies it to the brokers that hold the follower replicas.",
      },
      {
        step: 3,
        description:
          "Consumers in a group each read the partitions assigned to them, in order, committing the offset they have reached.",
      },
      {
        step: 4,
        description:
          "The event stays until retention expires, so another group — or the same one, rewound to an earlier offset — reads the same stream again.",
      },
    ],
  },
  {
    id: "redis",
    cardNumber: "#019",
    type: "PLATFORM",
    title: "Redis",
    image: {
      src: "/images/redis-thumbnail.webp",
      alt: "Isometric scene of clients queued at a single command loop that reads a bank of memory cells, with a disk file to one side",
      sketch: {
        src: "/images/redis-sketch.svg",
        alt: "Line drawing of clients waiting at one command loop that reaches into a grid of memory cells, with a snapshot file beneath it",
      },
    },
    definition:
      "Redis is an in-memory data structure store: keys hold typed values \u2014 strings, hashes, lists, sets, sorted sets \u2014 that live in RAM and are served by a single command loop, so an operation takes microseconds and durability is something you turn on rather than something you get.",
    keywords: [
      "in-memory",
      "key-value",
      "data structure",
      "TTL",
      "persistence",
    ],
    components: [
      {
        name: "Keyspace",
        description:
          "One flat namespace of keys, each holding a typed value rather than a blob of text \u2014 a hash, a list, a set, a sorted set \u2014 and each able to carry a TTL that removes it when the deadline passes.",
      },
      {
        name: "Command loop",
        description:
          "A single thread that runs one command at a time to completion, which is what makes every command atomic without a lock \u2014 and why one slow command holds up every other client.",
      },
      {
        name: "Persistence and replication",
        description:
          "RDB snapshots and the AOF command log copy the keyspace to disk, and replicas receive the same writes, but memory stays the source of truth and both are opt-in.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A client opens one connection and sends a command naming a key, such as setting a field on a hash.",
      },
      {
        step: 2,
        description:
          "The server takes that command into its command loop and runs it to completion against memory, so no other client observes a half-finished change.",
      },
      {
        step: 3,
        description:
          "The reply goes back in microseconds, while the write is passed to any replicas and, where AOF is enabled, appended to the log on disk.",
      },
      {
        step: 4,
        description:
          "The key stays until it is deleted, its TTL expires, or Redis evicts it to stay under maxmemory \u2014 and with no persistence configured, a restart brings the server back empty.",
      },
    ],
  },
  {
    id: "rbac",
    cardNumber: "#020",
    type: "SECURITY",
    title: "RBAC",
    image: {
      src: "/images/rbac-thumbnail.webp",
      alt: "Isometric scene of three people assigned to two role cards, whose listed permissions open a locked resource while a dashed tile beside it stays crossed out",
      sketch: {
        src: "/images/rbac-sketch.svg",
        alt: "Line drawing of three subjects joined to two role cards, the permissions listed on those cards reaching a keyhole panel that a dashed crossed-out tile sits beneath",
      },
    },
    definition:
      "Role-based access control grants permissions to named roles rather than to people, then assigns roles to subjects — a subject's access is the union of the permissions its roles carry, so a change of job is a change of assignment and never a change to anyone's own permission list.",
    keywords: [
      "role assignment",
      "permission",
      "least privilege",
      "separation of duties",
      "role explosion",
    ],
    components: [
      {
        name: "Subject",
        description:
          "The user, group, or service account that acts. It holds role assignments and never permissions of its own — the moment one is granted directly, the model has been abandoned for that subject.",
      },
      {
        name: "Role",
        description:
          "A named bundle of permissions defined by a job rather than a person, reviewed and reused as a unit; cutting roles finer than the jobs they describe is where role explosion starts.",
      },
      {
        name: "Permission",
        description:
          "One operation on one resource — the smallest thing that can be granted, and under RBAC it is only ever collected into a role, never bound straight to a subject.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Permissions are written as operations on resources and gathered into roles named for the jobs people actually do.",
      },
      {
        step: 2,
        description:
          "An administrator assigns roles to a subject, and that assignment is the whole grant — nothing is handed to the person directly.",
      },
      {
        step: 3,
        description:
          "On a request the system takes the union of the subject's assigned roles and allows it only if some permission covers the operation. RBAC is additive, so there is no deny rule to write: what no role names is already refused.",
      },
      {
        step: 4,
        description:
          "Editing one role moves every holder at once and revoking an assignment removes the access, which is also the model's limit — a rule that depends on the request itself, such as who owns the record or what time it is, needs attributes instead.",
      },
    ],
  },
  {
    id: "redis-cluster",
    cardNumber: "#021",
    type: "PLATFORM",
    title: "Redis Cluster",
    image: {
      src: "/images/redis-cluster-thumbnail.webp",
      alt: "Isometric scene of a client holding a slot map beside three shard stacks labelled with slot ranges, one request bouncing off the wrong shard onto the one that owns the slot",
      sketch: {
        src: "/images/redis-cluster-sketch.svg",
        alt: "Line drawing of a client reading a slot map, three shard stacks each marked with a slot range, and an arrow turned away from one stack towards the owner of the slot",
      },
    },
    definition:
      "Redis Cluster shards one keyspace across many primaries by hashing every key into one of 16384 slots: a shard owns a range of slots and answers only for the keys inside them, so a client is redirected to the owner rather than routed through a proxy \u2014 and the scale costs you any command that touches two slots at once.",
    keywords: ["sharding", "hash slot", "redirect", "resharding", "failover"],
    components: [
      {
        name: "Hash slot map",
        description:
          "The keyspace is cut into 16384 slots and a key\u2019s slot is CRC16 of the key \u2014 or of just the part inside a {\u2026} hash tag, which is how two keys are forced into the same slot on purpose. Slots, not keys, are what a shard owns and what a resharding moves.",
      },
      {
        name: "Shard",
        description:
          "One primary and its replicas, holding a range of slots. Nodes gossip health on a second port, and when a majority of primaries agree a primary is gone one of its replicas is promoted \u2014 slots left with no live owner go out of service while the rest of the keyspace keeps serving.",
      },
      {
        name: "Cluster-aware client",
        description:
          "Every node knows the whole map but serves only its own slots, so the client caches the map and follows a MOVED or ASK redirect itself. That is what lets a cluster run with no proxy in front of it, and why an old client library cannot talk to one.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The client hashes the key it wants into a slot and looks up which shard owns that slot in the map it cached when it connected.",
      },
      {
        step: 2,
        description:
          "It sends the command straight to that shard\u2019s primary, which runs it against its own memory exactly as a single Redis does \u2014 a node that does not own the slot will not run the command.",
      },
      {
        step: 3,
        description:
          "If the slot has since moved, the node answers MOVED with its new owner and the client refreshes its map. Mid-resharding an ASK redirect sends that one key\u2019s command to the shard receiving the slot, so moving slots never has to stop writes.",
      },
      {
        step: 4,
        description:
          "When a primary stops answering the heartbeats, a majority of primaries mark it failed and one of its replicas takes over its slots. What the model will not do is span them: a multi-key command whose keys hash apart is refused with CROSSSLOT, and holding them together means choosing a hash tag.",
      },
    ],
  },
  {
    id: "container",
    cardNumber: "#022",
    type: "COMPUTE",
    title: "Container",
    image: {
      src: "/images/container-thumbnail.webp",
      alt: "Isometric scene of read-only image layers stacked under one writable layer, starting a single process inside a namespace frame, with a cgroup ceiling capping how much it may take from the host kernel below",
      sketch: {
        src: "/images/container-sketch.svg",
        alt: "Line drawing of three read-only image layers beneath a dashed writable layer, a process boxed inside a namespace frame, and a limit bar above it marked with a memory ceiling",
      },
    },
    definition:
      "A container is an ordinary process on the host\u2019s kernel that has been handed its own view of the machine \u2014 its own filesystem, network, and process tree \u2014 and a ceiling on what it may consume. The image is what makes it identical on every host; the shared kernel is what makes it cost a process rather than a machine, and also what makes it a thinner boundary than a virtual machine.",
    keywords: ["image", "namespace", "cgroup", "layer", "ephemeral"],
    components: [
      {
        name: "Image",
        description:
          "Read-only layers plus a manifest naming the command, environment, and user the process starts as. It is content-addressed, so a digest is the same bytes everywhere \u2014 a tag is not, and a moving tag is why \u201cit worked yesterday\u201d is no evidence the same image ran. Layers are shared between containers on a host rather than copied.",
      },
      {
        name: "Namespaces",
        description:
          "What the process is allowed to see: its own mounts, process tree, network interfaces, and users. Isolation is granted one resource at a time, so it is given away one resource at a time \u2014 --net=host hands back the host\u2019s network, and mounting the runtime\u2019s own socket hands back the host.",
      },
      {
        name: "cgroups",
        description:
          "What the process is allowed to consume: CPU, memory, PIDs. CPU is throttling and a busy container merely runs slower, but memory is a hard ceiling the kernel enforces by killing the process. Nothing inside the container gets to refuse, which is why an unset limit is a host-wide risk and a tight one is a restart loop.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A definition file builds the image one instruction at a time, each producing a layer. Only what the build copies in exists at runtime \u2014 an image that builds is not yet an image that runs.",
      },
      {
        step: 2,
        description:
          "The runtime resolves the reference to a digest and pulls only the layers the host lacks, stacking them read-only and adding one writable layer on top. The union is copy-on-write, so a write copies the file up into the writable layer and the image beneath is never touched.",
      },
      {
        step: 3,
        description:
          "The runtime asks the kernel for fresh namespaces and a cgroup, then starts the command inside them. There is no boot and no second kernel \u2014 that is why it starts in milliseconds, and why an escape from the sandbox lands on the host rather than in a hypervisor.",
      },
      {
        step: 4,
        description:
          "The container lives exactly as long as PID 1 lives: when that process exits \u2014 or the kernel kills it for crossing the memory limit \u2014 the container is over and its writable layer goes with it. Anything that must outlive the process belongs in a volume or outside the host entirely.",
      },
    ],
  },
  {
    id: "terraform-state",
    cardNumber: "#023",
    type: "PLATFORM",
    title: "Terraform State",
    image: {
      src: "/images/terraform-state-thumbnail.webp",
      alt: "Isometric scene of a configuration document and a cloud of real objects with a locked ledger standing between them, its rows binding each resource address to the object it created, and a plan reading all three",
      sketch: {
        src: "/images/terraform-state-sketch.svg",
        alt: "Line drawing of a padlocked state ledger whose rows join a configuration block above to the real objects below, with one object drawn outside every row",
      },
    },
    definition:
      "Terraform state is the record binding each resource address in your configuration to the real object it created. It is why a plan is not a diff of your code against the cloud but a three-way comparison \u2014 what you declared, what state last saw, and what the provider reports now \u2014 and why every surprising plan turns out to be that third input being something other than you assumed.",
    keywords: ["desired state", "drift", "lock", "refresh", "import"],
    components: [
      {
        name: "State file",
        description:
          "A JSON map from a resource address such as module.frontend.aws_s3_bucket.site to the provider\u2019s own identifier, plus a snapshot of the attributes it returned. Nothing else holds that binding: lose the file and Terraform destroys nothing, it proposes to create everything again beside infrastructure it can no longer see. The snapshot keeps whatever the provider handed back, secrets included, so the file belongs in an encrypted, versioned bucket and never in git.",
      },
      {
        name: "Backend",
        description:
          "Where the state lives and who may write it. The default is local \u2014 a file beside the configuration, which is enough for one person and fatal for a team, because two laptops each holding a private answer to what exists will each plan to build it. Making state shared is the whole job of a remote backend, and sharing a file two people can write is what forces the next component.",
      },
      {
        name: "Lock",
        description:
          "A claim held for the length of a write so two applies cannot interleave into a state that describes neither run. Backends implement it differently, but the failure is the same everywhere: an interrupted run leaves the lock held, and reaching for force-unlock without knowing whether the other apply finished is how state and reality come apart quietly.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Terraform reads the configuration and the state, then refreshes \u2014 asking the provider what each recorded object looks like now. What comes back is reality; what was in state is the last thing Terraform saw. The gap between them is drift, and it always has an author: someone who changed it in the console.",
      },
      {
        step: 2,
        description:
          "The plan compares three things, not two, and emits one action per resource: create where the configuration has it and state does not, update where both do and the attributes differ, destroy where state has it and the configuration no longer does. That last rule is why deleting a resource block is not tidying up \u2014 it is a destroy, and removing code ships.",
      },
      {
        step: 3,
        description:
          "Apply takes the lock, calls the provider in dependency order, and writes state after each resource rather than at the end. A run that fails halfway therefore leaves a state that is accurate for the half that finished, which is why the answer to a failed apply is another apply and never a hand-edit of the file.",
      },
      {
        step: 4,
        description:
          "Because the binding is by address, renaming a resource block reads as destroy-plus-create until a moved block or a state move re-points the old address, and an object created outside Terraform stays invisible until it is imported. Neither operation touches the cloud \u2014 both edit only the map.",
      },
    ],
  },
  {
    id: "kubernetes-pod",
    cardNumber: "#024",
    type: "COMPUTE",
    title: "Kubernetes Pod",
    image: {
      src: "/images/kubernetes-pod-thumbnail.webp",
      alt: "Isometric scene of two containers standing inside one shared sandbox frame that carries a single network address and a volume beneath it, with a deleted pod crossed out beside the differently named pod created to replace it",
      sketch: {
        src: "/images/kubernetes-pod-sketch.svg",
        alt: "Line drawing of two containers inside one dashed pod boundary sharing a single IP label and a volume, with an arrow from a crossed-out pod to the new one that replaces it",
      },
    },
    definition:
      "A pod is the smallest thing Kubernetes schedules: one or more containers placed on a single node inside one shared sandbox \u2014 one network namespace, one IP, one set of volumes. It is mortal by design. Nothing repairs a pod in place, and what takes over is not that pod recovered but a different one, with a new name and a new address.",
    keywords: ["sandbox", "sidecar", "probe", "request", "ephemeral"],
    components: [
      {
        name: "Shared sandbox",
        description:
          "The namespaces the containers are put inside rather than each being given their own: one network namespace, so they share an IP and reach each other on localhost, plus whatever volumes the spec mounts. That sharing is the only reason to place two containers in one pod \u2014 and its price is that a port is claimed pod-wide, so two containers cannot both bind :8080 any more than two processes on one host could.",
      },
      {
        name: "Containers",
        description:
          "Init containers run to completion, in order, before any of the others start, which is where waiting on a dependency belongs; the rest run alongside each other for the life of the pod. The pod counts as Ready only when every one of them does, so a sidecar that never comes up takes the whole pod out of service even though the application beside it is fine.",
      },
      {
        name: "Requests and limits",
        description:
          "A request is what the scheduler subtracts from a node\u2019s capacity to decide where the pod fits \u2014 a claim, not a measurement, which is why a node full of idle pods has no room. A limit is the container card\u2019s cgroup ceiling, enforced per container. Ask for more than any node has and the pod stays Pending indefinitely: a scheduling failure, which never restarts, because nothing ever started.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The spec is admitted and the scheduler picks one node \u2014 filtering on requests, then scoring what survives. The choice is written into the pod and never revisited: a pod is never rescheduled, so it does not drift to a roomier node later, and a node that grows crowded is resolved by deleting pods rather than moving them.",
      },
      {
        step: 2,
        description:
          "The kubelet on that node builds the sandbox first, so the network namespace and the IP exist before anything runs in them, then works through the init containers and starts the rest. A container that crashes is restarted inside that same sandbox, which is why the pod keeps its IP across a restart and why a restart count is a container\u2019s, not the pod\u2019s.",
      },
      {
        step: 3,
        description:
          "Probes answer two independent questions, and mixing them up is the classic outage: a failing liveness probe restarts the container, while a failing readiness probe only takes the pod out of its Service endpoints. Point liveness at a slow start with no startup probe and the container is killed before it can ever finish; point readiness at a shared dependency and every replica leaves at once.",
      },
      {
        step: 4,
        description:
          "Deletion is the end of it. An eviction, a drain, a lost node, or a rolling update deletes the pod, and the controller above it creates a different pod \u2014 new name, new IP, fresh writable layers. That is why anything that must survive belongs in a volume outliving the pod, and why nothing addresses a pod directly; it addresses a Service, which follows whichever pods are currently Ready.",
      },
    ],
  },
] as const satisfies readonly ConceptCardData[];
