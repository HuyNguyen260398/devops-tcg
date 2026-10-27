import type { ConceptCardData } from "@/types/concept";

export const conceptCards = [
  {
    id: "proxy",
    cardNumber: "#001",
    type: "NETWORK",
    title: "Proxy",
    image: {
      src: "/images/proxy-thumbnail.webp",
      alt: "Three clients sending requests into a proxy, which forwards one on to a destination server",
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
      "AWS Lambda runs a function in an execution environment it creates on demand for each event — no server to provision, and you pay only while the code runs.",
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
          "Delivers the event that invokes the function: a direct call, an HTTP request, or a queue, stream, or bucket notification.",
      },
      {
        name: "Function",
        description:
          "The handler plus its runtime and settings: memory, timeout, and environment variables.",
      },
      {
        name: "Execution environment",
        description:
          "The isolated sandbox that runs the handler, kept warm for a while to serve later events.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "An event arrives and Lambda looks for an idle execution environment.",
      },
      {
        step: 2,
        description:
          "With none free, it pays a cold start: provision an environment, load the package, run the init code.",
      },
      {
        step: 3,
        description:
          "The handler runs until it returns or times out, and Lambda bills the duration and memory used.",
      },
      {
        step: 4,
        description:
          "The environment is frozen for reuse, and concurrent events scale out to more environments instead of queueing.",
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
      "An IAM role is an identity nobody owns or signs in as: a principal assumes it and receives temporary credentials, so access is borrowed rather than issued as a lasting secret.",
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
          "Names who may assume the role — a service, another account, or a federated identity provider.",
      },
      {
        name: "Permissions policies",
        description: "Decide what an assumed session may do once it exists.",
      },
      {
        name: "STS",
        description:
          "Mints the session’s temporary access key, secret, and token, stamped with an expiry.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A principal — an EC2 instance, a Lambda function, a user, or another account — calls AssumeRole on the role’s ARN.",
      },
      {
        step: 2,
        description:
          "IAM checks the trust policy first; if it does not name that principal, the call is refused.",
      },
      {
        step: 3,
        description:
          "STS returns temporary credentials that expire, typically after an hour.",
      },
      {
        step: 4,
        description:
          "Requests signed with them are judged against the role’s permissions and stop working when the session ends.",
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
      "An IAM policy is a JSON document of statements that allow or deny actions on resources, and AWS evaluates every policy that applies to a request together.",
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
          "The unit AWS evaluates: an Allow or Deny effect, the actions and resources it covers, and an optional condition.",
      },
      {
        name: "Identity and resource policies",
        description:
          "One document format, attached to a user, group, or role — or to the resource itself, which can grant across accounts.",
      },
      {
        name: "Condition",
        description:
          "Keys that narrow when a statement applies, such as the source network, MFA, or a resource tag.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A signed request names a principal, an action, and a resource.",
      },
      {
        step: 2,
        description:
          "AWS gathers every policy in scope: identity, resource, permissions boundary, session, and service control policies.",
      },
      {
        step: 3,
        description:
          "An explicit deny anywhere ends evaluation, and no allow can overrule it.",
      },
      {
        step: 4,
        description:
          "Otherwise the request needs a matching allow, because the default is deny.",
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
      "OpenID Connect is an identity layer on OAuth 2.0: the provider authenticates the user and returns a signed ID token saying who they are, so the app never handles the password.",
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
          "Authenticates the user, issues the ID token, and publishes the keys that verify it.",
      },
      {
        name: "Relying party",
        description:
          "The application that sends the user to the provider and reads the identity from the token.",
      },
      {
        name: "ID token",
        description:
          "A JWT stating who the user is — what OAuth 2.0 alone never says; an access token grants access and is not proof of identity.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The relying party redirects the browser to the provider with the openid scope.",
      },
      {
        step: 2,
        description:
          "The provider authenticates the user, and those credentials never reach the relying party.",
      },
      {
        step: 3,
        description:
          "The browser returns with a short-lived code, which the relying party exchanges for an ID token.",
      },
      {
        step: 4,
        description:
          "The relying party checks the signature, issuer, audience, and expiry before trusting the identity.",
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
      "Apache Kafka is a distributed event streaming platform: producers append events to partitioned topics that brokers retain on disk, so many consumers can read one stream at their own pace.",
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
          "Stores topics on disk and replicates every partition across brokers, so the stream outlives any one machine.",
      },
      {
        name: "Topic",
        description:
          "A named, append-only log split into partitions; reading an event does not remove it.",
      },
      {
        name: "Producers and consumer groups",
        description:
          "Producers write without knowing who reads; each consumer group tracks its own offset.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A producer sends an event, and its key picks the partition.",
      },
      {
        step: 2,
        description:
          "The broker appends it to that partition’s log and copies it to the follower replicas.",
      },
      {
        step: 3,
        description:
          "Each consumer in a group reads its assigned partitions in order and commits its offset.",
      },
      {
        step: 4,
        description:
          "The event stays until retention expires, so another group — or a rewound one — can read it again.",
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
      "Redis is an in-memory data structure store: typed values live in RAM and are served by a single command loop, so operations take microseconds and durability is opt-in.",
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
          "One flat namespace of keys holding typed values — hashes, lists, sets, sorted sets — each able to expire via a TTL.",
      },
      {
        name: "Command loop",
        description:
          "A single thread runs one command at a time, so every command is atomic — and one slow command stalls every client.",
      },
      {
        name: "Persistence and replication",
        description:
          "RDB snapshots, the AOF log, and replicas copy the data, but memory stays the source of truth.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A client sends a command naming a key, such as setting a field on a hash.",
      },
      {
        step: 2,
        description:
          "The server runs it to completion against memory, so no client sees a half-finished change.",
      },
      {
        step: 3,
        description:
          "The reply returns in microseconds, and the write goes on to replicas and, if enabled, the AOF.",
      },
      {
        step: 4,
        description:
          "The key lives until deleted, expired, or evicted under maxmemory — and without persistence a restart comes back empty.",
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
      "Role-based access control grants permissions to roles rather than to people, then assigns roles to subjects — so a job change is a new assignment, not an edited permission list.",
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
          "A user, group, or service account. It holds role assignments and never permissions of its own.",
      },
      {
        name: "Role",
        description:
          "A named bundle of permissions for a job, not a person; cutting roles too fine leads to role explosion.",
      },
      {
        name: "Permission",
        description:
          "One operation on one resource, only ever granted through a role.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Permissions are grouped into roles named after the jobs people actually do.",
      },
      {
        step: 2,
        description:
          "An administrator assigns roles to a subject, and that assignment is the whole grant.",
      },
      {
        step: 3,
        description:
          "A request is allowed if the union of the subject’s roles covers it. RBAC is additive: there is no deny rule to write.",
      },
      {
        step: 4,
        description:
          "Editing a role updates every holder at once. Rules that depend on the request, such as who owns a record, need attributes.",
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
      "Redis Cluster shards one keyspace across many primaries by hashing each key into one of 16384 slots, and clients are redirected to a slot’s owner rather than routed through a proxy.",
    keywords: ["sharding", "hash slot", "redirect", "resharding", "failover"],
    components: [
      {
        name: "Hash slot map",
        description:
          "A key’s slot is CRC16 of the key, or of its {…} hash tag, which forces related keys into the same slot.",
      },
      {
        name: "Shard",
        description:
          "A primary and its replicas own a range of slots; when a majority of primaries agree one failed, a replica is promoted.",
      },
      {
        name: "Cluster-aware client",
        description:
          "Caches the slot map and follows MOVED and ASK redirects itself, so the cluster needs no proxy in front of it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The client hashes the key to a slot and looks up its owner in its cached map.",
      },
      {
        step: 2,
        description:
          "It sends the command straight to that owner; a node that does not own the slot will not run it.",
      },
      {
        step: 3,
        description:
          "If the slot moved, the node replies MOVED and the client refreshes its map; mid-resharding, ASK redirects one key.",
      },
      {
        step: 4,
        description:
          "A multi-key command whose keys hash to different slots is refused with CROSSSLOT — a hash tag keeps them together.",
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
      "A container is an ordinary process on the host’s kernel with its own view of the machine and a cap on what it may consume — lighter than a VM, and a thinner boundary.",
    keywords: ["image", "namespace", "cgroup", "layer", "ephemeral"],
    components: [
      {
        name: "Image",
        description:
          "Read-only layers plus a start command. A digest names the same bytes everywhere; a tag can move.",
      },
      {
        name: "Namespaces",
        description:
          "What the process may see: its own mounts, processes, network, and users. --net=host hands the host’s network back.",
      },
      {
        name: "cgroups",
        description:
          "What the process may consume: CPU, memory, PIDs. Too much CPU slows it; too much memory gets it killed.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A build file produces the image, one layer per instruction.",
      },
      {
        step: 2,
        description:
          "The runtime pulls missing layers and adds a writable layer on top; writes are copy-on-write, so the image is untouched.",
      },
      {
        step: 3,
        description:
          "The kernel creates fresh namespaces and a cgroup and starts the command — no boot and no second kernel.",
      },
      {
        step: 4,
        description:
          "The container lives as long as PID 1. When it exits the writable layer goes too, so lasting data belongs in a volume.",
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
      "Terraform state binds each resource address in your configuration to the real object it created, making every plan a three-way comparison: code, last-known state, and reality.",
    keywords: ["desired state", "drift", "lock", "refresh", "import"],
    components: [
      {
        name: "State file",
        description:
          "Maps each address to a real resource ID. Lose it and Terraform will create everything again. It holds secrets, so encrypt it.",
      },
      {
        name: "Backend",
        description:
          "Where state lives. The default is local — fine alone, fatal for a team — so teams share a remote backend.",
      },
      {
        name: "Lock",
        description:
          "Stops two applies writing state at once. Use force-unlock only when you are sure the other run has ended.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Refresh asks the provider what each object looks like now; the gap from state is drift.",
      },
      {
        step: 2,
        description:
          "The plan creates, updates, or destroys each resource — so deleting a block means destroy.",
      },
      {
        step: 3,
        description:
          "Apply takes the lock and writes state after each resource; fix a failed apply with another apply, never a hand-edit.",
      },
      {
        step: 4,
        description:
          "Renaming a block needs a moved block, and outside resources must be imported — both edit only the state.",
      },
    ],
  },
  {
    id: "kubernetes-pod",
    cardNumber: "#024",
    type: "K8S",
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
      "A pod is the smallest unit Kubernetes schedules: one or more containers on one node in a shared sandbox, with one IP and shared volumes. It is never repaired, only replaced.",
    keywords: ["sandbox", "sidecar", "probe", "request", "ephemeral"],
    components: [
      {
        name: "Shared sandbox",
        description:
          "Containers share one network namespace and IP and reach each other on localhost, so a port is claimed pod-wide.",
      },
      {
        name: "Containers",
        description:
          "Init containers run to completion first; the pod is Ready only when every other container is.",
      },
      {
        name: "Requests and limits",
        description:
          "The scheduler places pods by request, not usage. Ask for more than any node has and the pod stays Pending.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The scheduler picks one node. The pod is never rescheduled; a crowded node deletes pods rather than moving them.",
      },
      {
        step: 2,
        description:
          "The kubelet builds the sandbox and its IP first, then starts the containers; a crashed container restarts in place.",
      },
      {
        step: 3,
        description:
          "A failing liveness probe restarts the container; a failing readiness probe removes the pod from its Service.",
      },
      {
        step: 4,
        description:
          "A deleted pod is replaced by a new one with a new name and IP. Keep data in a volume and address a Service.",
      },
    ],
  },
  {
    id: "prometheus",
    cardNumber: "#025",
    type: "PLATFORM",
    title: "Prometheus",
    image: {
      src: "/images/prometheus-thumbnail.webp",
      alt: "Isometric scene of one monitoring server reaching out to pull samples from three application targets, one of them answered by an exporter beside it, writing labelled series onto the disk under the server while a rule reads them back",
      sketch: {
        src: "/images/prometheus-sketch.svg",
        alt: "Line drawing of a server pulling on arrows that run out to three targets and back, stacking rows of labelled samples on a disk beneath it",
      },
    },
    definition:
      "Prometheus is a monitoring server that pulls: it scrapes metrics from targets on a schedule and stores each as a labelled time series. Nothing is pushed to it.",
    keywords: ["scrape", "time series", "label", "PromQL", "exporter"],
    components: [
      {
        name: "Target and exporter",
        description:
          "A target exposes its current metrics over HTTP; an exporter does it for software that cannot.",
      },
      {
        name: "Series and labels",
        description:
          "Name plus labels is a series’ identity. Change a label and it is a different series; unbounded labels exhaust memory.",
      },
      {
        name: "Rules and PromQL",
        description:
          "PromQL queries series. Recording rules precompute results; alerting rules hand firing alerts to Alertmanager.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Service discovery builds the target list, and relabelling sets each target’s labels.",
      },
      {
        step: 2,
        description:
          "Every scrape interval it sends one HTTP GET per target; a spike shorter than the interval is never recorded.",
      },
      {
        step: 3,
        description:
          "Samples go to local disk with no clustering or replication, so long history needs remote write.",
      },
      {
        step: 4,
        description:
          "A target that stops answering goes stale and its up metric drops to 0 — alert on that absence.",
      },
    ],
  },
  {
    id: "prometheus-federation",
    cardNumber: "#026",
    type: "PLATFORM",
    title: "Prometheus Federation",
    image: {
      src: "/images/prometheus-federation-thumbnail.webp",
      alt: "Isometric scene of a global monitoring server pulling from two leaf servers below it through a selector box standing on each path, the leaves each holding five rows of series while only two of them arrive in the server above",
      sketch: {
        src: "/images/prometheus-federation-sketch.svg",
        alt: "Line drawing of one server above two others, pulling from each through a small filter box, so only two of the five rows every leaf holds are drawn inside it",
      },
    },
    definition:
      "Federation is one Prometheus scraping another: a global server scrapes each leaf’s /federate endpoint and copies a chosen subset of series into its own storage.",
    keywords: [
      "/federate",
      "match[]",
      "global server",
      "honor_labels",
      "resolution",
    ],
    components: [
      {
        name: "Leaf and global server",
        description:
          "Leaves scrape targets; the global scrapes leaves. A leaf does not know the global exists, so losing it costs no detail.",
      },
      {
        name: "The /federate endpoint and match[]",
        description:
          "Returns series matching match[]; an empty selector matches nothing. Too broad and the global takes every leaf’s cardinality.",
      },
      {
        name: "honor_labels and external_labels",
        description:
          "honor_labels keeps the leaf’s own labels, and external_labels tell leaves apart so their series never collide.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Each leaf scrapes its targets, and recording rules pre-aggregate what the global will ask for.",
      },
      {
        step: 2,
        description:
          "The global requests /federate?match[]=… on its own schedule and gets the latest sample of each match.",
      },
      {
        step: 3,
        description:
          "The copy has the global’s resolution, not the leaf’s, so detail between its scrapes stays on the leaf.",
      },
      {
        step: 4,
        description:
          "The global lags by up to one scrape and is still one server; long retention and a global view need remote write.",
      },
    ],
  },
  {
    id: "aws-alb",
    cardNumber: "#027",
    type: "NETWORK",
    title: "AWS ALB",
    image: {
      src: "/images/aws-alb-thumbnail.webp",
      alt: "Isometric scene of three requests whose connections stop dead on the top edge of a load balancer, two rules inside it matching on what each request carried, and two fresh connections leaving its underside for a target group apiece, one of whose targets is crossed out",
      sketch: {
        src: "/images/aws-alb-sketch.svg",
        alt: "Line drawing of two requests ending on the edge of a load balancer that holds two rules, with two new arrows starting underneath it and running to a target group each, one target struck through",
      },
    },
    definition:
      "An Application Load Balancer works at layer 7: it terminates the client’s connection, reads the HTTP request, and routes it by what the request says.",
    keywords: [
      "layer 7",
      "listener rule",
      "target group",
      "health check",
      "X-Forwarded-For",
    ],
    components: [
      {
        name: "Listener and its rules",
        description:
          "Rules run in priority order and the first match wins; a default action answers anything unmatched.",
      },
      {
        name: "Target group and its health check",
        description:
          "Holds the targets and health-checks them; with no healthy target left in the target group, clients get a 503.",
      },
      {
        name: "Two connections, not one",
        description:
          "The target sees only the balancer; the caller’s IP travels in X-Forwarded-For, worth trusting only when the balancer set it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The client connects and TLS is terminated at the listener, so rules can read the plain request.",
      },
      {
        step: 2,
        description:
          "Rules are checked in priority order, and the first match picks the target group.",
      },
      {
        step: 3,
        description:
          "A healthy target is chosen — round robin or least outstanding requests — and X-Forwarded-* headers are added.",
      },
      {
        step: 4,
        description:
          "The response returns the same way. A protocol it cannot parse gives rules nothing to match, and parsing adds latency.",
      },
    ],
  },
  {
    id: "aws-nlb",
    cardNumber: "#028",
    type: "NETWORK",
    title: "AWS NLB",
    image: {
      src: "/images/aws-nlb-thumbnail.webp",
      alt: "Isometric scene of three flows running straight down through a load balancer without stopping, each keeping its own colour from the sealed client above to the sealed target below, pinned by a node where it crosses, with one fixed address plate standing at each end of the balancer",
      sketch: {
        src: "/images/aws-nlb-sketch.svg",
        alt: "Line drawing of two arrows passing unbroken through a load balancer from a client to a target, each pinned by a small square where it crosses, with a fixed address block at either end of the balancer",
      },
    },
    definition:
      "A Network Load Balancer works at layer 4: it forwards TCP and UDP flows without reading them, choosing a target from addresses and ports alone, at very low latency.",
    keywords: [
      "layer 4",
      "flow hash",
      "static IP",
      "source IP preservation",
      "TCP/UDP",
    ],
    components: [
      {
        name: "A listener is a port",
        description:
          "A protocol and port with no rules: everything goes to one target group, so any content routing happens elsewhere.",
      },
      {
        name: "The flow hash",
        description:
          "Picks a target by hashing the flow’s five-tuple, so stickiness is to a flow, not to a client.",
      },
      {
        name: "Fixed addresses, real client addresses",
        description:
          "One static address per zone, optionally an Elastic IP, and targets see the client’s real source address.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A client connects to a zonal address. Nothing is terminated, so there is no handshake at the balancer.",
      },
      {
        step: 2,
        description:
          "The five-tuple is hashed once to choose a healthy target, and every later packet of the flow follows it.",
      },
      {
        step: 3,
        description:
          "Packets arrive with the client’s address intact. A failing target gets no new flows, and existing ones are drained.",
      },
      {
        step: 4,
        description:
          "No content routing, redirects, or headers — client details reach the app only through the proxy protocol.",
      },
    ],
  },
  {
    id: "aws-vpc",
    cardNumber: "#029",
    type: "NETWORK",
    title: "AWS VPC",
    image: {
      src: "/images/aws-vpc-thumbnail.webp",
      alt: "Isometric scene of one boundary holding two identical subnets that reach each other directly, each standing over its own route table, the two tables alike in every row but one \u2014 the table carrying that second row sends its traffic out through a gateway on the boundary, and the packet from the table without it is crossed out where the row would have been",
      sketch: {
        src: "/images/aws-vpc-sketch.svg",
        alt: "Line drawing of two matching subnets inside one boundary, each over a route table, one table\u2019s second row filled and leading out through a gateway on the boundary while the other\u2019s is an empty dashed slot whose path ends in a cross",
      },
    },
    definition:
      "A VPC is a private IP range in one region, cut into subnets, one per Availability Zone. Nothing about a subnet makes it public or private — its route table does.",
    keywords: [
      "CIDR block",
      "subnet",
      "route table",
      "internet gateway",
      "security group",
    ],
    components: [
      {
        name: "CIDR block and its subnets",
        description:
          "The range is fixed at creation. Each subnet is a slice of it in one zone, minus five addresses AWS reserves.",
      },
      {
        name: "Route table and what it points at",
        description:
          "The local route cannot be removed, so subnets reach each other. A 0.0.0.0/0 row to an internet gateway makes a subnet public.",
      },
      {
        name: "Security group and network ACL",
        description:
          "A security group is stateful and sits on the interface; a network ACL is stateless, sits on the subnet, and needs return rules.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Choose the CIDR, cut subnets, and launch resources; each gets an interface in one subnet.",
      },
      {
        step: 2,
        description:
          "Packets match the subnet’s route table. The local route links every subnet, so private never meant isolated.",
      },
      {
        step: 3,
        description:
          "Outside traffic needs a matching row; without one the packet is dropped for lack of a route and shows up as a timeout.",
      },
      {
        step: 4,
        description:
          "Then the filters apply: the stateful group lets replies back, the ACL needs rules for them. Other VPCs need peering.",
      },
    ],
  },
  {
    id: "aws-subnet",
    cardNumber: "#030",
    type: "NETWORK",
    title: "AWS Subnet",
    image: {
      src: "/images/aws-subnet-thumbnail.webp",
      alt: "Isometric scene of three interfaces inside one boundary, each standing over an address slot of its own \u2014 the machine in the private subnet routing across into a NAT gateway that stands inside the public subnet, whose slot is lit and whose path runs on down through the internet gateway on the boundary and out, while a second machine in that same public subnet has an empty dashed slot and its path is crossed out before it reaches the gateway",
      sketch: {
        src: "/images/aws-subnet-sketch.svg",
        alt: "Line drawing of the egress chain \u2014 a private subnet routing to a NAT gateway that stands within the public subnet and carries an address plate onward through a gateway on the boundary, beside a machine with the same route but an empty address slot whose path ends in a cross",
      },
    },
    definition:
      "A subnet has no public or private setting. “Public” means a route to an internet gateway plus public addresses on its interfaces — neither one works alone.",
    keywords: [
      "public subnet",
      "private subnet",
      "main route table",
      "NAT gateway",
      "auto-assign public IPv4",
    ],
    components: [
      {
        name: "The association you may never have made",
        description:
          "A subnet never explicitly associated uses the VPC’s main route table, so one row there can make many subnets public.",
      },
      {
        name: "Auto-assign public IPv4",
        description:
          "Grants an address, not reach: the gateway’s one-to-one NAT needs a route too, and an address alone is equally unreachable.",
      },
      {
        name: "Three ways out of a private subnet",
        description:
          "A NAT gateway (which stands in a public subnet), an egress-only gateway for IPv6, or a VPC endpoint.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A new subnet is just an address range in one zone, using its own route table or the main one.",
      },
      {
        step: 2,
        description:
          "Public needs a 0.0.0.0/0 row to an internet gateway plus a public address, which the instance’s config never mentions.",
      },
      {
        step: 3,
        description:
          "Private with egress routes to a NAT gateway; one per zone avoids cross-zone charges and zonal outages.",
      },
      {
        step: 4,
        description:
          "An interface endpoint works with no route at all. IPv6 addresses are always routable, so an egress-only gateway holds them in.",
      },
    ],
  },
  {
    id: "aws-cidr",
    cardNumber: "#031",
    type: "NETWORK",
    title: "AWS CIDR",
    image: {
      src: "/images/aws-cidr-thumbnail.webp",
      alt: "Isometric scene of one address range held inside a single heavy boundary, cut into two subnets whose rows of address slots each have five already taken and only three left lit, a smaller range standing apart to the side with a gap marked between them rather than joined on, and below both of them two ranges carrying the very same slots with the path between them crossed out",
      sketch: {
        src: "/images/aws-cidr-sketch.svg",
        alt: "Line drawing of a fixed range cut into subnets with five slots struck out of each, a separate block set beside it rather than extending its edge, and a facing range of the same numbers whose connecting path ends in a cross",
      },
    },
    definition:
      "A VPC’s CIDR block is chosen once and cannot be taken back — and AWS reserves five addresses in every subnet, so you get fewer than the prefix suggests.",
    keywords: [
      "prefix length",
      "reserved addresses",
      "secondary CIDR block",
      "overlapping ranges",
      "RFC 1918",
    ],
    components: [
      {
        name: "What the slash actually fixes",
        description:
          "The prefix counts network bits: a /24 leaves 256 addresses. With five reserved, a /28 holds eleven usable, not sixteen.",
      },
      {
        name: "Nothing here is an edit",
        description:
          "A subnet cannot be resized. Secondary CIDR blocks add room beside the first range, never instead of it.",
      },
      {
        name: "What overlap costs, and when",
        description:
          "VPCs whose ranges overlap cannot peer or share a Transit Gateway route table. Avoid 10.0.0.0/16 — everyone uses it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Pick a range from /16 to /28. AWS reserves five addresses in every subnet.",
      },
      {
        step: 2,
        description:
          "The primary block is immutable; changing it means building a replacement and migrating to it.",
      },
      {
        step: 3,
        description:
          "The cost arrives later: a refused peering, an unroutable attachment, or an on-premises network on the same range.",
      },
      {
        step: 4,
        description:
          "IPv6 avoids it: AWS assigns a /56 and every subnet is a /64 — a range that was never yours to pick.",
      },
    ],
  },
  {
    id: "aws-route-table",
    cardNumber: "#032",
    type: "NETWORK",
    title: "AWS Route Table",
    image: {
      src: "/images/aws-route-table-thumbnail.webp",
      alt: "Isometric scene of one packet meeting a table where three rows match it at once \u2014 the narrowest row lit and carrying the packet away, the catch-all row beneath it left dark although it matches too, a third row marked as having arrived from elsewhere, and a fourth greyed out with its target gone \u2014 while off to the side a further table hangs from the gateway on the boundary rather than from any subnet",
      sketch: {
        src: "/images/aws-route-table-sketch.svg",
        alt: "Line drawing of a packet over a stack of rows of decreasing width, the narrowest one taking the arrow while the widest is passed over, one row carrying an inbound mark it was not given by hand and one struck through, with a separate small table hung from a boundary gateway alongside",
      },
    },
    definition:
      "A route table is not a list read from the top down. It is a lookup where the most specific matching row wins — and some rows you never wrote.",
    keywords: [
      "longest prefix match",
      "route priority",
      "route propagation",
      "blackhole route",
      "gateway route table",
    ],
    components: [
      {
        name: "Longest prefix wins, with two exceptions",
        description:
          "The local route wins even when a propagated route is more specific, and on a tie a static route beats a propagated one.",
      },
      {
        name: "The rows you never wrote",
        description:
          "Propagated rows follow somebody else’s BGP. Delete a target and its row turns blackhole, still matching and dropping.",
      },
      {
        name: "Tables that hang off no subnet at all",
        description:
          "A gateway route table sends ingress through inspection first. The local route is undeletable, but a narrower row beats it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Every row is compared at once and the longest matching prefix wins; console order means nothing.",
      },
      {
        step: 2,
        description:
          "On equal prefixes static beats propagated; among propagated rows, Direct Connect beats VPN, then BGP.",
      },
      {
        step: 3,
        description:
          "A blackhole row drops traffic. It looks like a firewall but is not, so a security group audit will not find it.",
      },
      {
        step: 4,
        description:
          "A Transit Gateway has route tables of its own; a VPC row does not change them, and traffic must satisfy both.",
      },
    ],
  },
  {
    id: "aws-nat-gateway",
    cardNumber: "#033",
    type: "NETWORK",
    title: "AWS NAT Gateway",
    image: {
      src: "/images/aws-nat-gateway-thumbnail.webp",
      alt: "Isometric scene of several connections leaving through one gateway that stamps each with its own address and a port taken from a finite strip beneath it \u2014 the strip aimed at a single destination almost entirely used up while the strips beside it stand nearly empty \u2014 with a meter running on the gateway itself, and off to the side a second gateway of the same shape carrying no public address and turned inward rather than out",
      sketch: {
        src: "/images/aws-nat-gateway-sketch.svg",
        alt: "Line drawing of three machines whose connections converge on one gateway, a row of port slots under it nearly filled where they all reach for the same destination and barely touched where they do not, a counter ticking on the gateway body, and a second gateway alongside with an empty address plate whose arrow points back inwards",
      },
    },
    definition:
      "A NAT gateway is a resource billed by the hour and per gigabyte, and what limits it is not bandwidth but connections to any one destination.",
    keywords: [
      "data processing charge",
      "port allocation",
      "idle timeout",
      "private NAT gateway",
      "gateway endpoint",
    ],
    components: [
      {
        name: "Charged twice",
        description:
          "Hourly plus per gigabyte, even for S3 and DynamoDB traffic — which a free gateway endpoint takes off it entirely.",
      },
      {
        name: "It runs out of ports, not of bandwidth",
        description:
          "About 55,000 connections per unique destination. Exhaustion shows as ErrorPortAllocation; secondary IPs add more.",
      },
      {
        name: "Not a filter, not always public",
        description:
          "You cannot attach a security group — only the subnet’s network ACL. A private NAT gateway joins overlapping networks.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Routed traffic arrives, and each connection’s source is rewritten to the gateway’s address and a port.",
      },
      {
        step: 2,
        description:
          "Replies match the stored pairing and are rewritten back. Nothing inbound can start a connection.",
      },
      {
        step: 3,
        description:
          "Each pairing uses one of 55,000 ports per destination; an idle one expires after 350 seconds and gets an RST.",
      },
      {
        step: 4,
        description:
          "IPv6 uses an egress-only gateway instead. A NAT gateway is never a destination for inbound traffic.",
      },
    ],
  },
  {
    id: "aws-internet-gateway",
    cardNumber: "#034",
    type: "NETWORK",
    title: "AWS Internet Gateway",
    image: {
      src: "/images/aws-internet-gateway-thumbnail.webp",
      alt: "Isometric scene of one machine inside a boundary standing over an address plate that carries only its private address, its connection running out through a gateway attached to the boundary \u2014 the gateway holding that machine\u2019s public plate outside, lit and carrying a charge mark of its own \u2014 while a second machine in the same boundary reaches for the public address instead and has its direct path crossed out, its traffic drawn leaving the boundary and returning through the very same gateway, and a third machine\u2019s packet crossing that gateway unchanged, with no plate on either side of it",
      sketch: {
        src: "/images/aws-internet-gateway-sketch.svg",
        alt: "Line drawing of a machine whose own plate shows a private address only, its line running out through a gateway on the boundary that holds the matching public plate beyond it, a second machine whose straight path to that machine is crossed out and whose traffic loops outside the boundary and back into the same gateway instead, and a third machine whose line crosses that gateway with no plate on either side of it",
      },
    },
    definition:
      "An internet gateway filters nothing. It is a VPC attachment doing static one-to-one translation for IPv4, so an instance never sees its own public address.",
    keywords: [
      "one-to-one NAT",
      "public IPv4 charge",
      "egress-only gateway",
      "public DNS hostname",
      "VPC attachment",
    ],
    components: [
      {
        name: "The public address isn’t on the instance",
        description:
          "The OS sees only its private address; the public one is in instance metadata. Group references break over public IPs.",
      },
      {
        name: "Nothing to size or filter",
        description:
          "It takes no security group and scales itself, but public IPv4 is billed by the hour and one flow tops out near 5 Gbps.",
      },
      {
        name: "IPv6 crosses it untouched",
        description:
          "IPv6 is not translated, and an egress-only gateway blocks inbound. Rows left after a detach become blackhole routes.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Attach it to the VPC; nothing changes until a route table points at it.",
      },
      {
        step: 2,
        description:
          "The private source is rewritten to the mapped public address. The mapping is static and symmetric, so outsiders can connect in.",
      },
      {
        step: 3,
        description:
          "The public address is auto-assigned, changing on stop, or an Elastic IP you keep; both are billed hourly.",
      },
      {
        step: 4,
        description:
          "It holds no policy and makes nothing public alone. A private subnet reaches out through a NAT gateway that uses it.",
      },
    ],
  },
  {
    id: "aws-transit-gateway",
    cardNumber: "#035",
    type: "NETWORK",
    title: "AWS Transit Gateway",
    image: {
      src: "/images/aws-transit-gateway-thumbnail.webp",
      alt: "Isometric scene of one gateway standing over two route tables of its own, four attachments arriving at it \u2014 two boundaries landing in the first table, and a third boundary together with a fourth attachment that is no boundary at all landing in the second, so each pair reaches only the other half of its own pair \u2014 one packet drawn twice on its way in, once outside the gateway and again inside it, and a direct wire between two of the boundaries that bypasses the gateway altogether crossed out",
      sketch: {
        src: "/images/aws-transit-gateway-sketch.svg",
        alt: "Line drawing of three boundaries attached to one gateway that carries its own stack of route tables, two attachment lines landing in one table and the third landing in a table of its own, with a direct line drawn between two of the boundaries crossed out",
      },
    },
    definition:
      "A transit gateway is a regional router that VPCs, VPNs, and Direct Connect attach to. It has its own route tables, so a packet crossing it is matched twice.",
    keywords: [
      "attachment",
      "association and propagation",
      "transit gateway route table",
      "appliance mode",
      "non-transitive peering",
    ],
    components: [
      {
        name: "The gateway’s own route tables",
        description:
          "Each attachment is associated with one gateway table, and propagation copies its ranges into others. Both directions need rows.",
      },
      {
        name: "Segmentation by route tables",
        description:
          "It takes no security group; isolation is separate tables. Two VPCs with the same CIDR cannot both be routed across it.",
      },
      {
        name: "One interface per zone, metered",
        description:
          "Name a subnet per Availability Zone or that zone is dropped. Billed hourly and per GB; appliance mode keeps flows symmetric.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Create it and attach VPCs. New attachments land in the default route table, so a simple setup just works.",
      },
      {
        step: 2,
        description:
          "The subnet’s row sends traffic to the attachment, and at the gateway it is matched again against the associated table.",
      },
      {
        step: 3,
        description:
          "The return path is a separate decision needing its own rows in both places; a route to nothing is a blackhole.",
      },
      {
        step: 4,
        description:
          "It does no translation and holds no policy, and peering between gateways is non-transitive.",
      },
    ],
  },
  {
    id: "aws-security-group",
    cardNumber: "#036",
    type: "SECURITY",
    title: "AWS Security Group",
    image: {
      src: "/images/aws-security-group-thumbnail.webp",
      alt: "Isometric scene of two allow-lists standing side by side over one interface, the first row of each lit because both of them matched and every other row an allow as well, the slot where a deny row would sit drawn empty, dashed and crossed out — while the answer leaves the interface on a dashed path that climbs back to the arriving packet with no row of its own, carrying a single mark where the flow is remembered, and off to the side one list naming another list resolves until an address arrives in its place and the link between them is crossed out",
      sketch: {
        src: "/images/aws-security-group-sketch.svg",
        alt: "Line drawing of two rule lists standing over a single interface, the top row of each filled in and the lowest slot of the second dashed and struck through, a dotted return path looping from the interface back to the packet above through one small filled circle, and beside them a pair of linked plates whose link is crossed out where the lower plate carries an address instead",
      },
    },
    definition:
      "A security group is an allow-only, stateful filter on a network interface. Groups on one interface are unioned, so a rule only widens access.",
    keywords: [
      "stateful filter",
      "allow-only rules",
      "elastic network interface",
      "security group reference",
      "connection tracking",
    ],
    components: [
      {
        name: "Unioned on the interface",
        description:
          "Every rule in every attached group forms one union with no order, so narrowing access is always a deletion.",
      },
      {
        name: "Stateful, and what tracking is",
        description:
          "Replies to an allowed flow return automatically. A new group allows all outbound traffic and no inbound.",
      },
      {
        name: "A rule that names a group, not a range",
        description:
          "A source can be a range, a prefix list, or another group. Group references do not resolve across a Transit Gateway.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A new group has no inbound rule and allows all outbound, so nothing unsolicited arrives.",
      },
      {
        step: 2,
        description:
          "Every rule is checked together, with no first match. With no allow the packet is dropped silently: a timeout.",
      },
      {
        step: 3,
        description:
          "Replies return on the group’s memory of the flow. It judges a flow; the subnet’s ACL judges packets.",
      },
      {
        step: 4,
        description:
          "It cannot deny, so blocking one address inside an allowed range belongs on the network ACL — the next card.",
      },
    ],
  },
  {
    id: "aws-network-acl",
    cardNumber: "#037",
    type: "SECURITY",
    title: "AWS Network ACL",
    image: {
      src: "/images/aws-network-acl-thumbnail.webp",
      alt: "Isometric scene of two numbered lists standing side by side, one for each direction — a packet arriving at the first and walking down its rows until the second one lights and takes it, the rows underneath drawn faint because nothing ever reads them — while the answer leaves on a dashed path that loops around and is delivered to the top of the second list, where it is walked all the way down to the unnumbered last row, which carries a mark of its own and is crossed out",
      sketch: {
        src: "/images/aws-network-acl-sketch.svg",
        alt: "Line drawing of two stacks of numbered rows, an arrow stepping down the first stack to the row it matches and the rows below it drawn in a lighter line, and a dotted path running from the foot of that stack around to the head of the second, where a second arrow runs the whole way down to a struck-through final row",
      },
    },
    definition:
      "A network ACL is a stateless filter on the subnet: numbered allow and deny rules, judged in each direction separately — so replies need rules of their own.",
    keywords: [
      "stateless filter",
      "rule number order",
      "ephemeral port range",
      "implicit deny",
      "subnet association",
    ],
    components: [
      {
        name: "Numbered and first-match",
        description:
          "Rules 1 to 32766 run in ascending order and the first match wins. A final asterisk rule denies everything else.",
      },
      {
        name: "Stateless, and the rule on the way back",
        description:
          "Replies go to ephemeral ports, so outbound must allow 1024 to 65535 — or the connection times out.",
      },
      {
        name: "The only place a deny can be written",
        description:
          "Security groups have no deny, so blocking a single address happens here, for the whole subnet at once.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A custom ACL denies everything until rules are added; the default ACL allows all.",
      },
      {
        step: 2,
        description:
          "Each packet is checked in rule-number order, and the first match decides.",
      },
      {
        step: 3,
        description:
          "The reply is judged again by the other direction’s rules, with no memory of the request.",
      },
      {
        step: 4,
        description:
          "Traffic within the same subnet never crosses it, and DNS, DHCP, and instance metadata are exempt.",
      },
    ],
  },
  {
    id: "aws-vpc-endpoint",
    cardNumber: "#038",
    type: "NETWORK",
    title: "AWS VPC Endpoint",
    image: {
      src: "/images/aws-vpc-endpoint-thumbnail.webp",
      alt: "Isometric scene of a subnet whose table carries a local row, one lit row naming a prefix list, and an empty dashed row crossed out where the way to the internet would be — and yet two paths reach the service standing outside it, one leaving from the lit row and the other from an interface inside the subnet that no row in the table mentions at all, while the gateway that would have carried both is crossed out on its plate beside them",
      sketch: {
        src: "/images/aws-vpc-endpoint-sketch.svg",
        alt: "Line drawing of a boundary holding a machine, a table of three rows whose last is an empty dashed slot struck through, and a plate below the table carrying a single dot, with one line leaving the filled row and another leaving the dotted plate to arrive separately at a box outside the boundary, and a struck-through gateway mark standing apart from both",
      },
    },
    definition:
      "A VPC endpoint lets a private subnet with no way out reach a service. A gateway endpoint is a row in a route table; an interface endpoint is an address found by name.",
    keywords: [
      "gateway endpoint",
      "interface endpoint",
      "prefix list",
      "private DNS",
      "endpoint policy",
    ],
    components: [
      {
        name: "Gateway endpoint: a free row",
        description:
          "For S3 and DynamoDB only: a route to a prefix list, no hourly charge. Unreachable from a VPN, a peer, or a Transit Gateway.",
      },
      {
        name: "Interface endpoint: a metered address",
        description:
          "An elastic network interface in your subnets, filtered by a security group and billed hourly and per gigabyte.",
      },
      {
        name: "Private DNS is what makes it invisible",
        description:
          "Private DNS points the service’s usual name at the endpoint, so clients need no change. An endpoint policy narrows access.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The service decides the type: S3 and DynamoDB allow either, and everything else needs an interface endpoint.",
      },
      {
        step: 2,
        description:
          "A gateway endpoint adds a row naming the service’s prefix list to each chosen route table.",
      },
      {
        step: 3,
        description:
          "An interface endpoint is reached because a name resolved to it — no route was involved.",
      },
      {
        step: 4,
        description:
          "It reaches a service, not a network. Until the old route or DNS name stops being used, the NAT gateway is still metering.",
      },
    ],
  },
  {
    id: "tcp",
    cardNumber: "#039",
    type: "NETWORK",
    title: "TCP",
    image: {
      src: "/images/tcp-thumbnail.webp",
      alt: "Isometric scene of two upright plates facing each other, each holding a small tablet with a number on it, joined above by three lanes of which the first carries a number of its own — and between them, standing in open space with no machine of any kind to hold it, a row of numbered tiles: a run already lit and delivered, then one slot left dashed and empty where a number went missing, and behind that slot every later tile stacked and waiting although each has already arrived, with a bracket beneath them marking how far ahead of the answers the sender may be and a single arrow returning underneath carrying one number back",
      sketch: {
        src: "/images/tcp-sketch.svg",
        alt: "Line drawing of two upright plates facing each other, each with a small numbered tablet, joined above by three lanes of which the first is labelled with a number, a row of numbered boxes between them with one box left empty and dashed and the boxes after it stacked in a queue, a bracket beneath those boxes, and an arrow returning below carrying a single number back to the sender",
      },
    },
    definition:
      "A TCP connection is not a pipe the network holds open — it is an agreement between two ends about how to number bytes, acknowledge them, and resend what goes missing.",
    keywords: [
      "three-way handshake",
      "sequence number",
      "acknowledgement",
      "sliding window",
      "congestion control",
    ],
    components: [
      {
        name: "The handshake agrees the first number",
        description:
          "SYN, SYN-ACK, ACK trade each side’s initial sequence number. The four-tuple names the connection; TIME_WAIT guards reuse.",
      },
      {
        name: "Acknowledgements",
        description:
          "An ACK names the next byte it expects. What arrives is a byte stream: message boundaries are not kept.",
      },
      {
        name: "The window is permission to be ahead",
        description:
          "The sender may run ahead by the smaller of the receive window and its own congestion window.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "After the handshake both ends share starting numbers and a window; the routers know nothing of it.",
      },
      {
        step: 2,
        description:
          "Bytes go out numbered; the sender keeps copies until they are acknowledged, and the receiver restores order.",
      },
      {
        step: 3,
        description:
          "Three duplicate ACKs trigger fast retransmit; otherwise a timer fires. Either way the congestion window shrinks.",
      },
      {
        step: 4,
        description:
          "One lost segment stalls everything behind it (head-of-line blocking), and an idle flow needs a keepalive to survive NAT.",
      },
    ],
  },
  {
    id: "udp",
    cardNumber: "#040",
    type: "NETWORK",
    title: "UDP",
    image: {
      src: "/images/udp-thumbnail.webp",
      alt: "Isometric scene of two plates facing each other, each holding an empty dashed slot where a remembered number would sit, and between them four datagrams travelling entirely on their own with no line joining any one of them to the next — each a box carrying four small header cells and nothing else, one struck through where it was dropped, another standing in front of a second copy of itself, and the rest arriving at whatever height they arrive at; while above them, where a handshake would have been agreed, and below them, where an answer would have returned, there is nothing in either place but an empty dashed lane crossed out",
      sketch: {
        src: "/images/udp-sketch.svg",
        alt: "Line drawing of two upright plates, each with an empty dashed slot near its top, and four separate boxes between them, none joined to another, each carrying a row of four small header cells, one box crossed out and one drawn twice with its copy behind it, and above and below the row an empty dashed lane struck through where a handshake and a reply would have been",
      },
    },
    definition:
      "UDP is what is left of a transport when you remove the agreement: no connection, and nothing is remembered between datagrams. Reliability is the application’s job.",
    keywords: ["datagram", "connectionless", "port", "checksum", "QUIC"],
    components: [
      {
        name: "The header is the whole promise",
        description:
          "Eight bytes: ports, length, checksum. One send is one receive, so message boundaries survive.",
      },
      {
        name: "Nothing is remembered",
        description:
          "No ordering, no retries, no congestion control; connect() establishes nothing, and losing one fragment loses the datagram.",
      },
      {
        name: "What the absence buys, and who spends it",
        description:
          "No handshake delay, no head-of-line blocking, and multicast. DNS, voice, and QUIC are built on exactly that.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Bind a port, name a destination, and send — the first packet already carries data.",
      },
      {
        step: 2,
        description:
          "The datagram may be lost, duplicated, or reordered, and nothing reports which.",
      },
      {
        step: 3,
        description:
          "Matching replies, retry timers, and pacing are the application’s job; what it does not supply, it lacks.",
      },
      {
        step: 4,
        description:
          "QUIC is ordered and reliable on top of UDP, so the choice against #039 is where the agreement lives, not speed.",
      },
    ],
  },
  {
    id: "kubernetes-node",
    cardNumber: "#041",
    type: "K8S",
    title: "Kubernetes Node",
    image: {
      src: "/images/kubernetes-node-thumbnail.webp",
      alt: "Isometric scene of one machine plate carrying the figure it publishes about itself \u2014 a capacity bar whose far end is cut away dark and reserved, so only the lit remainder is filled by the claimed blocks stacked into it, while the needle measuring what is actually running sits low and unread beside them \u2014 a mark on the plate turning away an arriving unit that carries no matching token while one that does passes it, and off to the side a second plate whose lease card has gone dark, its units still standing upright and lit yet crossed out, with a fresh one appearing on a third plate instead",
      sketch: {
        src: "/images/kubernetes-node-sketch.svg",
        alt: "Line drawing of a machine plate with a bar whose end section is hatched off, claimed blocks filling only the open part and a low needle beside it, a struck mark on the plate rejecting one arriving unit while another carrying a token passes, and a second plate with a dashed lease card whose upright units are crossed out beside a new unit on a third plate",
      },
    },
    definition:
      "A node is a machine the cluster observes rather than owns: the kubelet reports its capacity and renews a lease. When the lease stops, nothing is repaired — its pods are recreated elsewhere.",
    keywords: ["allocatable", "kubelet", "lease", "taint", "eviction"],
    components: [
      {
        name: "Allocatable",
        description:
          "Capacity minus kube-reserved, system-reserved, and eviction headroom. Requests are a claim, not a measurement, against it.",
      },
      {
        name: "Conditions and the lease",
        description:
          "The kubelet renews a Lease. If it stops, the node goes NotReady and its pods are deleted after 300 seconds.",
      },
      {
        name: "Taints and tolerations",
        description:
          "A taint repels pods without a toleration; NoExecute also evicts running ones. A drain is a cordon plus evictions.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The kubelet registers the Node object with its capacity, addresses, and labels.",
      },
      {
        step: 2,
        description:
          "The scheduler filters nodes on allocatable, taints, and affinity, then binds the pod once.",
      },
      {
        step: 3,
        description:
          "Short on resources, the kubelet evicts BestEffort pods first — unlike #022’s cgroup kill of one container.",
      },
      {
        step: 4,
        description:
          "A departing node’s pods are recreated elsewhere. A node is a unit of failure, not a unit of identity (#024).",
      },
    ],
  },
  {
    id: "kubernetes-cluster",
    cardNumber: "#042",
    type: "K8S",
    title: "Kubernetes Cluster",
    image: {
      src: "/images/kubernetes-cluster-thumbnail.webp",
      alt: "Isometric scene of one door standing in the middle of the control plane with the store behind it reached by a single line and by nothing else — an intent arriving from outside on one arrow into that same door, and two deciding parts beside it joined to it alone, their own direct paths to the store and to each other drawn dashed and struck through — while below, three machine plates each send one line up to that door and none sideways to a neighbour, the links between them crossed out, and off to the side the same door stands dark with its machines still lit and running beneath it and the new unit arriving at it crossed out",
      sketch: {
        src: "/images/kubernetes-cluster-sketch.svg",
        alt: "Line drawing of a single door with a store behind it on one line, two parts beside the door joined only to it with their shortcut to the store and their link to each other struck through, and three machine plates below, each joined upward to that same door and each crossed out where a line to its neighbour would have been",
      },
    },
    definition:
      "A cluster is two planes and one door: the control plane decides, the nodes run, and everything talks only to the API server — a star, not a mesh.",
    keywords: ["control plane", "api server", "etcd", "scheduler", "kubelet"],
    components: [
      {
        name: "The control plane",
        description:
          "etcd holds all state and the API server is the only process that touches it; losing etcd quorum freezes the cluster.",
      },
      {
        name: "The node side",
        description:
          "The kubelet, with a CRI runtime, watches for pods carrying its nodeName and pulls the work, so it has no listening port for it.",
      },
      {
        name: "The wiring",
        description:
          "Every loop is level-triggered, rereading state rather than trusting messages, and the API server is the chokepoint.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A request passes authentication, RBAC, and admission, then lands in etcd — a record of intent, with nothing running yet.",
      },
      {
        step: 2,
        description:
          "The scheduler sees an unbound pod, scores nodes (#041), and writes the binding. It never contacts the node.",
      },
      {
        step: 3,
        description:
          "The kubelet sees its name, starts the containers in a sandbox (#024), and reports status back.",
      },
      {
        step: 4,
        description:
          "The design fails static: without the control plane, pods keep running, but nothing new is scheduled.",
      },
    ],
  },
  {
    id: "kubernetes-deployment",
    cardNumber: "#043",
    type: "K8S",
    title: "Kubernetes Deployment",
    image: {
      src: "/images/kubernetes-deployment-thumbnail.webp",
      alt: "Isometric scene of one plate above two others side by side, the left of the pair emptying as its row of units thins and the right filling as its row grows, every unit carrying the same template mark as the plate it hangs from, while the direct line from the top plate down to the units is drawn dashed and struck through \u2014 an intent arriving from outside on one arrow into that top plate, and off to the side a retired plate standing dark, its old template returning not as a reversal but as a fresh, higher-numbered plate at the front of the row",
      sketch: {
        src: "/images/kubernetes-deployment-sketch.svg",
        alt: "Line drawing of a Deployment box above two ReplicaSet boxes, the left one shrinking and the right one growing, each unit beneath them labelled with its own template hash, the Deployment\u2019s direct line to the units struck through, and an old revision returning as a new numbered one",
      },
    },
    definition:
      "A Deployment never touches a pod. It owns one ReplicaSet per template version, and a rolling update scales the new one up and the old one down.",
    keywords: [
      "replicaset",
      "rollout",
      "rolling update",
      "revision",
      "rollback",
    ],
    components: [
      {
        name: "The two objects below it",
        description:
          "A pod-template-hash label keeps each revision’s pods apart, which is why the Deployment’s selector cannot change.",
      },
      {
        name: "The rollout",
        description:
          "maxSurge and maxUnavailable bound the drift from desired replicas, and readiness (#024) paces each step.",
      },
      {
        name: "Revisions",
        description:
          "Old ReplicaSets at zero replicas are the history, and revisionHistoryLimit sets how far back an undo can go.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A new template creates a new ReplicaSet at zero replicas; nothing running is touched.",
      },
      {
        step: 2,
        description:
          "The controller scales the new set up and the old one down as the new pods become ready.",
      },
      {
        step: 3,
        description:
          "A pod that never becomes ready stalls the rollout; progressDeadlineSeconds marks it Failed but rolls nothing back.",
      },
      {
        step: 4,
        description:
          "Undo goes forwards, re-applying an old template as a new revision. Stable identity needs a StatefulSet; scaling arrives via #042.",
      },
    ],
  },
  {
    id: "aws-stateless-services",
    cardNumber: "#044",
    type: "PLATFORM",
    title: "AWS Stateless Services",
    image: {
      src: "/images/aws-stateless-services-thumbnail.webp",
      alt: "One request arriving on a single arrow into a balancing plate, which fans out to four instances marked identically to one another and holding nothing but an empty dashed shelf — three of them lit, each sending its own arrow down into one wide store below, and the fourth dark and struck through with its feed from the balancer drawn dashed, the row serving on without it — while off to the side one instance stands with a small store lodged inside it, that store struck through, a single caller tied to that one instance by a dashed cord",
      sketch: {
        src: "/images/aws-stateless-services-sketch.svg",
        alt: "Line drawing of a balancer fanning out to four identical instances standing over one wide store, each instance holding the same empty dashed shelf, one of the four drawn dashed as a place that may hold an instance or not, another with a filled store inside it struck through, and an arrow from every live instance down into the store",
      },
    },
    definition:
      "A stateless service keeps nothing between requests, so any instance can serve any caller and every instance is disposable. The state moved — into the request, or a store (#045).",
    keywords: [
      "disposable",
      "horizontal scaling",
      "session state",
      "warm start",
      "idempotency",
    ],
    components: [
      {
        name: "Where the state went",
        description:
          "Identity travels in a token (#013), and data lives in DynamoDB or S3. The service is stateless; the system is not.",
      },
      {
        name: "The disposable instance",
        description:
          "Capacity is a count, not a name. Any instance can be stopped, and the deregistration delay protects in-flight requests.",
      },
      {
        name: "The leak",
        description:
          "Nothing enforces it: Lambda sandboxes are reused, so globals and /tmp persist, and ALB stickiness pins callers.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The load balancer (#027) picks any healthy target; none is special.",
      },
      {
        step: 2,
        description:
          "The target uses the request plus fetched data, verifying tokens rather than looking up sessions (#013).",
      },
      {
        step: 3,
        description:
          "With no data on it, an instance can be removed at any time: deregister, finish in-flight requests, terminate.",
      },
      {
        step: 4,
        description:
          "Retries are safe only if the operation is idempotent, and the hard part has moved to the stateful tier (#045).",
      },
    ],
  },
  {
    id: "aws-stateful-services",
    cardNumber: "#045",
    type: "PLATFORM",
    title: "AWS Stateful Services",
    image: {
      src: "/images/aws-stateful-services-thumbnail.webp",
      alt: "Two interchangeable callers above one endpoint plate, the link from the second of them crossed out, and below it two dashed zones side by side — the left holding a store struck through, its badge travelling over the top on a dashed arrow to the lit store in the right zone, which now wears it — while the endpoint’s live arrow goes to that right store and the path it took a minute ago, to the left one, is dashed and struck out, the two stores joined by a doubled line, a stack of dated copies standing off to one side and a third store to the other behind a one-way dashed arrow marked with a clock",
      sketch: {
        src: "/images/aws-stateful-services-sketch.svg",
        alt: "Line drawing of one endpoint above two dashed zones, a solid arrow from it into the store on the right and a crossed-out one to the store on the left where it pointed before, the left store struck through and left holding an empty dashed badge slot while the right store wears the filled badge that has just travelled across to it, the two joined by a doubled line, and one dot marking the left zone against two marking the right",
      },
    },
    definition:
      "A stateful service holds data that outlives any process, so a new instance is empty. Failure is a promotion, not a replacement — the counterpart of #044.",
    keywords: [
      "durability",
      "failover",
      "replication lag",
      "partition key",
      "availability zone",
    ],
    components: [
      {
        name: "Identity that outlives the process",
        description:
          "You address a name, not a count — an RDS endpoint, a volume, a slot range (#021) — so recovery is restore or promote.",
      },
      {
        name: "Scaling that isn’t a slider",
        description:
          "A bigger primary needs a restart, read replicas add reads with lag, and only sharding adds write capacity.",
      },
      {
        name: "The blast radius",
        description:
          "An EBS volume lives in one Availability Zone. Backups bound your losses; deletion protection guards what #023 cannot rebuild.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A write must be durable before it is acknowledged, and that wait is most of the latency.",
      },
      {
        step: 2,
        description:
          "The data has a fixed location, so the floating tier above it (#044) is placed around it.",
      },
      {
        step: 3,
        description:
          "Failover promotes a standby and repoints DNS; open connections drop, so apps must reconnect and retry.",
      },
      {
        step: 4,
        description:
          "Writes scale by partition key, chosen early. A bad key makes a hot partition, and more of #044 cannot fix it.",
      },
    ],
  },
  {
    id: "kubernetes-replicaset",
    cardNumber: "#046",
    type: "K8S",
    title: "Kubernetes ReplicaSet",
    image: {
      src: "/images/kubernetes-replicaset-thumbnail.webp",
      alt: "One selector plate above a row of pods that each wear the very mark the plate wears, every one of them tied up to it by its own line \u2014 one more pod arriving from the left on a dashed arrow wearing the mark but tied to nothing yet, one leaving to the right with its mark struck out and its line to the plate dashed and crossed through, and an empty dashed slot standing open in the row where it used to be \u2014 while off to one side a template block\u2019s arrow up to the running pods is dashed and struck through, and to the other a pod already crossed out stands beside the lit one that has taken its place, both of them there at once",
      sketch: {
        src: "/images/kubernetes-replicaset-sketch.svg",
        alt: "Line drawing of a selector box above a row of pods each carrying the same mark and joined to it by a line, one pod arriving on a dashed arrow with no line of its own, one leaving with its mark struck out and its line dashed and crossed, a dashed empty slot standing in the row, a template whose arrow up to the running pods is struck through, and a crossed-out pod beside the one that replaced it",
      },
    },
    definition:
      "A ReplicaSet keeps no list of its pods: each pass it counts whatever matches its selector and fixes the difference. Deletes cascade through an ownerReference on each pod.",
    keywords: [
      "selector",
      "reconcile",
      "adoption",
      "owner reference",
      "orphan",
    ],
    components: [
      {
        name: "A selector, not a list",
        description:
          "Matching pods with no controller are adopted. The selector is immutable, as a Deployment’s is (#043).",
      },
      {
        name: "ownerReferences",
        description:
          "The garbage collector deletes pods whose owner is gone; --cascade=orphan leaves them. Avoid overlapping selectors.",
      },
      {
        name: "Which pod goes",
        description:
          "Scale-down removes the cheapest pods first — unscheduled, not ready, youngest — and pod-deletion-cost lets apps vote.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A replica count arrives through the API server (#042) and the controller lists matching pods; nothing is carried over.",
      },
      {
        step: 2,
        description:
          "It creates or deletes the difference, and at zero it idles, like a Deployment’s old revisions (#043).",
      },
      {
        step: 3,
        description:
          "A pod relabelled off the selector is released and replaced, so it stays running for debugging.",
      },
      {
        step: 4,
        description:
          "Template edits touch no running pod — there is no rollout. Pods with a deletionTimestamp stop counting (#024).",
      },
    ],
  },
  {
    id: "saml",
    cardNumber: "#047",
    type: "SECURITY",
    title: "SAML",
    image: {
      src: "/images/saml-thumbnail.webp",
      alt: "An identity provider on the left and an application on the right, joined over the top by a dashed line through the one certificate they swapped before anyone logged in, with the user’s browser standing between them carrying a sealed XML assertion across on two solid arrows — while off to one side a clock marks the minutes the assertion is good for, and to the other a forged assertion lies struck through with the genuine seal pulled out beside it",
      sketch: {
        src: "/images/saml-sketch.svg",
        alt: "Line drawing of a provider box and an application box joined by a dashed line through a certificate, a browser window between them holding a document marked with angle brackets and a seal, arrows running from the provider through the browser to the application, a small clock, and a crossed-out document with its seal lying apart",
      },
    },
    definition:
      "SAML is browser single sign-on built from signed XML: the identity provider’s assertion reaches the app through the user’s browser, trusted via a certificate imported beforehand.",
    keywords: [
      "assertion",
      "identity provider",
      "service provider",
      "metadata",
      "single sign-on",
      "XML signature",
    ],
    components: [
      {
        name: "Metadata",
        description:
          "Each side imports the other’s entityID, endpoints, and certificate. When a provider rotates its key, logins break — unlike #017.",
      },
      {
        name: "Assertion",
        description:
          "Signed XML naming the user, bounded by NotOnOrAfter and an AudienceRestriction; unlike a JWT (#013), it crosses the browser.",
      },
      {
        name: "Bindings",
        description:
          "HTTP-Redirect carries the request and HTTP-POST the response; Artifact uses a back channel. RelayState returns the user.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The app redirects the browser to the provider with an AuthnRequest and remembers its ID.",
      },
      {
        step: 2,
        description:
          "The provider authenticates the user, and the credentials never reach the app (as with #017).",
      },
      {
        step: 3,
        description:
          "The browser posts the signed response to the app. It is the only courier, so trust rests on the signature.",
      },
      {
        step: 4,
        description:
          "The app checks the signature on the element it reads (signature wrapping), then the audience, time, and InResponseTo.",
      },
    ],
  },
  {
    id: "grpc",
    cardNumber: "#048",
    type: "NETWORK",
    title: "gRPC",
    image: {
      src: "/images/grpc-thumbnail.webp",
      alt: "A client holding a generated function stub on the left and a server on the right, joined over the top by a dashed line through the one .proto contract both were generated from, with a single glowing connection between them carrying three streams of binary frames at once — one call and its reply, a run of replies streaming back, and frames flowing both ways — and a status check hanging below it, while off to one side a clock marks the deadline the client set, and to the other a browser window lies struck through",
      sketch: {
        src: "/images/grpc-sketch.svg",
        alt: "Line drawing of a client box marked f() and a server box joined by a dashed line through a document marked with angle brackets, a single highlighted pipe between them holding three rows of small frames with arrows in both directions, a ticked box hanging below the pipe, a small clock, and a crossed-out browser window",
      },
    },
    definition:
      "gRPC makes a remote call look local: both ends are generated from one .proto contract and multiplexed over HTTP/2.",
    keywords: [
      "remote procedure call",
      "protobuf",
      "protocol buffers",
      "HTTP/2",
      "streaming",
      "deadline",
    ],
    components: [
      {
        name: "Proto contract",
        description:
          "A .proto file declares services, methods, and messages. Field numbers, not names, go on the wire, so never reuse one.",
      },
      {
        name: "HTTP/2 channel",
        description:
          "One long-lived connection carries every call as its own stream, so an L4 balancer (#028) pins all of them to one backend.",
      },
      {
        name: "Four call shapes",
        description:
          "Unary, server streaming, client streaming, and bidirectional: each is one stream of length-prefixed messages.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The client calls a method on its generated stub, as if it were local.",
      },
      {
        step: 2,
        description:
          "The stub opens a stream on the shared connection, usually over TLS (#008), sending the method path and a grpc-timeout header.",
      },
      {
        step: 3,
        description:
          "The server runs the handler it implemented and streams replies back.",
      },
      {
        step: 4,
        description:
          "Trailers end the call with grpc-status, so HTTP 200 can still be a failure. Browsers cannot read trailers, hence gRPC-Web.",
      },
    ],
  },
  {
    id: "sso",
    cardNumber: "#049",
    type: "SECURITY",
    title: "SSO",
    image: {
      src: "/images/sso-thumbnail.webp",
      alt: "An identity provider at the top holding the one session cookie it set, with three application windows in a row beneath it, each joined to it by a line ending in a tick — the first marked with the single password prompt the user answered, the other two let straight in — while off to one side the user holds one key, and to the other a stack of separate passwords lies struck through",
      sketch: {
        src: "/images/sso-sketch.svg",
        alt: "Line drawing of a provider box holding a key and a cookie, three small application windows beneath it joined to it by lines, the first with a password field and the other two with ticks, a person with one key, and a crossed-out stack of password cards",
      },
    },
    definition:
      "Single sign-on lets one login open many apps: each app sends the user to one identity provider, which finds its own session and vouches for them without asking again.",
    keywords: [
      "single sign-on",
      "identity provider",
      "session",
      "federation",
      "single logout",
      "MFA",
    ],
    components: [
      {
        name: "Provider session",
        description:
          "A cookie on the provider’s own domain, not the app’s. It is what the second app finds, so the password is asked once.",
      },
      {
        name: "Federation protocol",
        description:
          "SAML (#047) or OIDC (#017) carries the signed proof to each app. SSO is the pattern; they are the wire format.",
      },
      {
        name: "App sessions",
        description:
          "Each app sets its own cookie once the proof checks out, so logging out of one app leaves the rest signed in.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The user opens app A, which has no session, so it redirects the browser to the identity provider.",
      },
      {
        step: 2,
        description:
          "The provider asks for the password and MFA once, sets its own session, and sends A a signed assertion.",
      },
      {
        step: 3,
        description:
          "The user opens app B. It redirects too, but the provider finds its session and answers at once, with no prompt.",
      },
      {
        step: 4,
        description:
          "Disabling the account at the provider stops new logins everywhere, but each app session lives until it expires.",
      },
    ],
  },
] as const satisfies readonly ConceptCardData[];
