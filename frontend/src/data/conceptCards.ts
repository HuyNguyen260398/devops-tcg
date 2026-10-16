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
      "A security group is not a firewall on a subnet, and it is not a list of what is forbidden. It is an allow-only list attached to a network interface, stateful, and unioned with every other group on that interface — so a rule can only ever widen what is reachable, and taking one away is the only way to narrow it.",
    keywords: [
      "stateful filter",
      "allow-only rules",
      "elastic network interface",
      "security group reference",
      "connection tracking",
    ],
    components: [
      {
        name: "Attached to an interface, and counted together",
        description:
          "The group is not on the instance, the subnet or the VPC. It is on each elastic network interface, up to five of them by default and sixteen if the quota is raised, and what the interface enforces is the union of every rule in every group attached to it. There is no order and no precedence: no group overrides another, nothing shadows anything, and a packet is allowed the moment any one rule in any one of them allows it. That is why the console shows no deny anywhere and why narrowing reach is always a deletion. It also means a machine with two interfaces carries two different filters, and the group is the wrong place to look for either one — the rules that judge an arriving packet are the ones attached to the interface it arrived at.",
      },
      {
        name: "Stateful, and what tracking is",
        description:
          "The group remembers each flow it let through, so the answer returns with no inbound rule of its own and the ephemeral port nobody can predict never needs a row. A new group starts with no inbound rule at all and one outbound rule permitting everything, which is why a fresh group already blocks unsolicited arrivals before anyone edits it; the VPC's default group is the exception, admitting anything from an interface that also carries it. Tracking has consequences people meet late. A rule permitting all traffic in both directions can leave a flow untracked and judged packet by packet instead, and removing the rule that allowed a flow now tears down the connections it was holding rather than letting them finish — so an edit made to tighten a group at a quiet hour is still an edit that drops sessions.",
      },
      {
        name: "A rule that names a group, not a range",
        description:
          "A source can be a range, a prefix list, or another security group's id — and naming a group means whatever interfaces carry that group, wherever they are and whatever addresses they happen to have. Nothing is copied, so the rule follows a fleet that renumbers itself and needs no maintenance. It is also the rule that stops resolving in two places the deck has already named. Across a peering connection inside one region it works; across a Transit Gateway it does not, because the gateway hands on addresses and nothing else. And a packet that left through an internet gateway and came back arrives carrying a public source, so the group it was sent from is no longer what the far side sees — the reference stops matching, and nothing about either group has changed.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "You create the group and attach it to an interface, and the filter it applies is already complete: no inbound rule, so nothing unsolicited arrives, and one outbound rule, so everything may leave. Nothing about the subnet, the route table or the instance type is consulted, because the group knows none of them. It knows one interface, and it knows the other groups standing beside it on that same interface.",
      },
      {
        step: 2,
        description:
          "A packet arrives and every rule in every attached group is considered at once. There is no first match and no last word — the question is only whether some rule somewhere in that union permits it, and if none does the packet is dropped in silence. The client sees a timeout, which is the same thing it sees when a route never delivered the packet at all and the same thing it sees when a stateless rule dropped the reply, and those three are not distinguishable from the far end.",
      },
      {
        step: 3,
        description:
          "What the group let out it remembers, and the reply comes back on the strength of that memory rather than on a rule. This is the whole of the difference from the filter on the subnet beside it: one of them judges a flow, the other judges a packet. The memory is not free of consequence — a flow permitted broadly enough in both directions may be left untracked and judged afresh each packet, and removing a rule ends the connections that rule was holding open.",
      },
      {
        step: 4,
        description:
          "Where the model stops is that the group has no vocabulary for an exception. It cannot deny, so a single address that must be kept out of a range you have allowed cannot be expressed here at all — that sentence can only be written one layer out, on the subnet, in the numbered and stateless list that is the next card. And it filters at the interface, which is the last place in the path rather than the first: it never sees a packet a route never delivered, so a group is not where an unexplained timeout is usually solved.",
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
      "A network ACL is stateless, and that one word is the whole card. It sits on the subnet rather than on an interface, holds numbered allow and deny rules read in order until one matches, and judges each direction entirely on its own — so the answer to a connection it correctly permitted needs a rule of its own, and without one the connection simply hangs.",
    keywords: [
      "stateless filter",
      "rule number order",
      "ephemeral port range",
      "implicit deny",
      "subnet association",
    ],
    components: [
      {
        name: "Numbered, ordered, and finished at the first match",
        description:
          "Rules are numbered from 1 to 32766 and read in ascending order, and the first one that matches ends the matter — everything below it is never reached, whether it would have allowed or denied. This is the exact inverse of the list on the interface next door, where every rule is unioned and order means nothing, and the two live one hop apart. A number is a position rather than a label, and nothing can be reordered, which is why the convention is to leave gaps of a hundred: inserting a rule between two adjacent numbers means renumbering everything after it. At the foot of both directions sits a row numbered with an asterisk, denying whatever reached it, and that row can be neither edited nor removed.",
      },
      {
        name: "Stateless, and the rule on the way back",
        description:
          "Nothing here remembers anything. The request and its answer are two unrelated events judged by two separate lists, so permitting a connection inbound grants nothing to the reply that leaves. The reply is addressed to whichever ephemeral port the client picked — 1024 to 65535 in practice — and the outbound list has to permit that entire range, because no one can know in advance which port it will be. This is why a subnet whose inbound rules are precisely right still times out, and why the failure looks so much like a routing fault: the request arrived, the service answered, and the answer was dropped on the way out by a list nobody was looking at.",
      },
      {
        name: "The only place a deny can be written",
        description:
          "A security group has no deny at all, so one address that must be kept out of a range you have otherwise allowed can only be expressed here. That is the reason to reach for this layer, and it is a coarse one on purpose. It applies to every interface in the subnet at once rather than to the one that needs it; it knows addresses, protocols and ports and nothing else, so it cannot name a security group the way a group can; and it holds twenty rules per direction by default, forty if the quota is raised. It is the blunt instrument kept one layer out from the precise one, and it is the wrong tool for anything a group can already express.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Every subnet is associated with exactly one network ACL, and associating one is not something most people do: a subnet nobody associated takes the VPC's default, which permits everything in both directions and therefore never visibly acts. A network ACL you create yourself is the opposite — it denies everything until a rule is written — so attaching a fresh one to a working subnet cuts it off completely and immediately, which is the single most common way this layer is first met.",
      },
      {
        step: 2,
        description:
          "A packet crossing the subnet boundary is matched against the list for the direction it is travelling, in ascending rule number, and the first match decides it. There is no most-specific rule and no union: a broad allow numbered 100 settles the question before a precise deny numbered 200 is ever read, which is the reverse of how the route table one layer down behaves and a reliable source of rules that were written but never consulted.",
      },
      {
        step: 3,
        description:
          "The answer comes back and is judged again, by the other list, with no knowledge that the first packet was ever permitted. It arrives on an unpredictable ephemeral port, so what the return direction needs is not a mirror of the inbound rule but a rule covering 1024 to 65535. A filter that judges a flow needs one rule; a filter that judges a packet needs two, and the second one is the one that is missing.",
      },
      {
        step: 4,
        description:
          "Where the model stops is at the subnet's own edge. Two interfaces in the same subnet talk without ever crossing it, so no rule here can hold them apart — that isolation only exists on the interface, in the card before this one. Some traffic is exempt outright, including the VPC DNS resolver at the .2 address, DHCP and the instance metadata service, so a deny-all here does not cut a machine off from the things that make it a machine on this network at all.",
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
      "A VPC endpoint is what lets a private subnet with no way out reach S3 anyway. Two mechanisms share the name and share almost nothing else: one is a row in a route table, costs nothing, and serves two services; the other is an interface standing in your own subnet, found by name rather than by route, which adds no row anywhere and is charged by the hour.",
    keywords: [
      "gateway endpoint",
      "interface endpoint",
      "prefix list",
      "private DNS",
      "endpoint policy",
    ],
    components: [
      {
        name: "The gateway endpoint is a row, and it is free",
        description:
          "It serves S3 and DynamoDB and nothing else. Associating it writes a row into the route tables you choose, and the destination of that row is a managed prefix list rather than a range you type — so the traffic is picked out by the ordinary longest-prefix match and handed to the endpoint instead of to whatever 0.0.0.0/0 was going to carry it. There is no hourly charge and no processing charge, which is precisely the charge a NAT gateway levies on every gigabyte bound for those same two services. What it cannot do is travel: a route table in another network cannot name it, so it is unreachable from on-premises over a VPN or Direct Connect, across a peering connection, or through a Transit Gateway.",
      },
      {
        name: "The interface endpoint is an address, and it is metered",
        description:
          "It is an elastic network interface placed in the subnets you name, holding a private address out of each subnet's own range, and it is how every other service is reached. Nothing routes to it: it is found because a name resolved to its address, which is why it appears in no route table and why looking for one is the usual way of failing to find it. It takes a security group, making it the only one of the two that can be filtered, and it is charged for each interface by the hour and again per gigabyte. Being merely an address in your VPC is also what makes it reachable from everywhere your VPC is — over a VPN, across a peering connection, through a Transit Gateway.",
      },
      {
        name: "Private DNS is what makes it invisible",
        description:
          "The option that matters most is the one that changes nothing in the application: private DNS makes the service's ordinary public hostname resolve, inside the VPC, to the endpoint's private address, so no client is reconfigured and no SDK is told. Switch it off and the same call resolves to the service's public addresses and leaves by whatever route it can find — which is the NAT gateway, at the charge the endpoint was installed to avoid, with nothing broken and nothing to notice. It needs DNS hostnames and DNS support switched on for the VPC. Beside it sits the endpoint policy, a policy on the endpoint itself that narrows what may be reached through it and is judged in addition to IAM rather than instead of it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The service decides the kind. S3 and DynamoDB will take either, and everything else is an interface endpoint — so the choice is rarely a preference. It settles where the thing lives, whether that is a row in a table or an address in a subnet, what it costs, and who outside this VPC can use it.",
      },
      {
        step: 2,
        description:
          "Create a gateway endpoint and associate route tables, and a row appears in each one naming the service's prefix list. Nothing else changes: the traffic still carries the service's public addresses and still resolves the same public name, and all that happened is that one lookup now matches a narrower row. Remove the endpoint and the rows leave with it, which is the one tidy deletion in this part of the deck.",
      },
      {
        step: 3,
        description:
          "Create an interface endpoint and you get an interface, a private address in each subnet you chose, and a set of DNS names. The packet reaches it because a name resolved to an address in the same subnet, so no route was consulted at all — an instance in a subnet whose table holds nothing but the local row still reaches the service, which is the sentence the whole card exists to make true.",
      },
      {
        step: 4,
        description:
          "Where the model stops is that an endpoint reaches a service, not a network. Nothing transits it, it is no kind of way to the internet, and it reaches its service in its own region only. It also removes no charge by existing: until the route that was carrying that traffic is taken away, or private DNS is switched on so the client stops asking for the public name, the NAT gateway is still in the path and still metering — the endpoint is installed, and the bill is unchanged.",
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
      "A TCP connection is not a pipe the network holds open for you — it is an agreement between two ends about how to number bytes. Everything else on this card falls out of that one fact: the handshake exists to agree the first number, an acknowledgement is a statement about numbers received, and a retransmission is what happens when a number goes unmentioned.",
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
          "Each end picks an initial sequence number and tells the other: the SYN carries one, the SYN-ACK carries the second and acknowledges the first, and the ACK completes it. The number is chosen unpredictably rather than started at zero, because anything that can guess it can write into the stream from off the path. What the three segments leave behind is a little state on two hosts and nowhere else — named by the four-tuple of both addresses and both ports, which is why a client exhausts its ephemeral ports per destination rather than absolutely, and why two connections may share a port with no ambiguity at all. Closing is the same agreement run backwards, one FIN in each direction, so a half-closed connection that can still send in one direction is legal and not an error; and the side that closes first keeps the four-tuple reserved in TIME_WAIT afterwards, so that a segment delayed in the network cannot arrive against a new connection wearing the old numbers. That is the whole reason a busy host holds thousands of sockets in a state where nothing is running.",
      },
      {
        name: "An acknowledgement is a statement about numbers",
        description:
          "An ACK names the next byte it expects, so it acknowledges everything before that number and says nothing whatever about what arrived after a gap — which is why a receiver holding the bytes past a hole can only keep repeating the same number, and why selective acknowledgement is an option bolted on to say the rest. Reordering therefore costs nothing: the receiver re-sequences and the sender never learns. Loss costs a round trip at best and a timer at worst. The thing this delivers is a byte stream, not the messages that were written into it: the sender's boundaries are not preserved, two writes may arrive as one read and one write as two, so every protocol above has to carry its own length or its own delimiter. A read returning fewer bytes than were sent is TCP working exactly as specified.",
      },
      {
        name: "The window is permission to be ahead",
        description:
          "A sender may be ahead of the acknowledgements by the smaller of two numbers, and only one of them is ever spoken aloud. The receive window is advertised on every segment and says what the receiver still has room for — dropping to zero when the application stops reading, which stops the sender without losing anything. The congestion window is the sender's own guess about the path, never advertised and never agreed, started small, doubled each round trip through slow start and cut when loss says the guess was wrong. Throughput is bounded by that window divided by the round-trip time, which is why a transfer to a distant region crawls on a link that is not remotely full, and why the window scaling option negotiated in the handshake — the 16-bit field being far too small for a modern path — is the difference between a fast link and a fast transfer.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Three segments pass and both ends now hold the same agreement: a starting number each, a window, and whatever options were negotiated. Nothing in the network was told, because there is nothing in the network to tell — the routers of #005's third layer forward each segment as an unrelated packet and know nothing of the connection carrying them.",
      },
      {
        step: 2,
        description:
          "Bytes go out carrying the numbers the agreement assigns them, and the sender keeps its own copy of everything it has not yet heard acknowledged. The receiver puts arrivals back into order and answers with the next number it is waiting for. Neither end is waiting a round trip per segment: the window is exactly the permission to keep sending into the silence.",
      },
      {
        step: 3,
        description:
          "One segment goes missing and the receiver keeps answering with the same number while it stacks up everything that arrives after it. Three duplicate acknowledgements are read as loss rather than as reordering and the sender resends at once — fast retransmit, without waiting for the timer — while a loss the duplicates never reveal waits for a retransmission timeout that backs off each time. The congestion window is cut in the same breath, so the repair costs throughput as well as time.",
      },
      {
        step: 4,
        description:
          "Where the model stops is that one stream is one order, so a segment lost at the front holds back every byte behind it even though they are already in the receiver's memory — head-of-line blocking, and it stalls everything multiplexed onto that connection together rather than one at a time. And because the agreement is state on two hosts, anything in the path that keeps a table of its own is only guessing: a NAT or a firewall that expires an idle flow drops nothing and tells nobody, leaving both ends believing in a connection that will fail at the next write, which is why a keepalive exists to spend a packet on saying nothing. What TCP cannot do is be absent — that is the next card.",
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
      "UDP is what is left of a transport when you remove the agreement. There is no connection to establish and nothing is remembered between one datagram and the next: a port, a length, a checksum, and your bytes. Everything TCP gave you is still needed — it is now the application's job.",
    keywords: ["datagram", "connectionless", "port", "checksum", "QUIC"],
    components: [
      {
        name: "The header is the whole promise",
        description:
          "Eight bytes, and there is nowhere to put a ninth: a source port, a destination port, a length, and a checksum. No sequence number, no acknowledgement, no flags and no options field — the header has no room for a mechanism, which is exactly why no mechanism was ever added to it. The source port may be left at zero when no reply is expected. The checksum covers the payload together with a pseudo-header taken from the addresses beneath it, and it is optional on IPv4 and mandatory on IPv6, which is a difference people meet the first time a tunnel refuses datagrams one stack was perfectly happy to send. What the header does keep is the boundary: one send is one receive, so a datagram of zero bytes is a real message the reader is handed, and a read offering too small a buffer loses the rest of that datagram rather than continuing it on the next call. It is the exact opposite of the stream on #039, and it is why a protocol here needs no length of its own.",
      },
      {
        name: "Nothing is remembered",
        description:
          "There is no order, no retransmission, no duplicate suppression, no flow control and no congestion control, so the network is free to drop a datagram, to deliver it twice, or to deliver it after the one sent behind it, and neither end is told which happened. Calling connect on a UDP socket sends nothing and establishes nothing: it remembers an address and filters what arrives, so a connection refused here is an ICMP message turning up afterwards rather than a handshake that failed. Having no congestion control means nothing slows the sender but the link itself — a freedom and a hazard in the same sentence, since a busy application here is not politely backing off the way every TCP flow around it is. And because a datagram arrives whole or not at all, one larger than the path will carry is fragmented underneath, where losing any single fragment loses the entire datagram: which is why a sender that cares chooses a size it knows will fit instead of discovering the limit in production.",
      },
      {
        name: "What the absence buys, and who spends it",
        description:
          "The first datagram can carry payload, because no round trip was spent agreeing anything first. A lost one delays nothing else, since nothing else was waiting behind it — there is no head-of-line blocking here, which is not a tuning victory but a consequence of there being no line. And one datagram can be addressed to many receivers at once by broadcast or by multicast, which a connection cannot express at all. DNS spends that on asking and answering in a single datagram each; a voice call spends it preferring a lost syllable to a late one. The most interesting spender rebuilds precisely what the transport left out: QUIC carries sequence numbers, acknowledgement, loss recovery and congestion control of its own, in userspace, on top of UDP — per stream rather than per connection, and so it keeps the one property the layer underneath it was never able to take away.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Bind a port, name a destination, send. There is no handshake to complete and no state to create, so the first packet on the wire is already carrying payload. The socket it left from is attached to nobody, which is why the very next call may send to somewhere else entirely without anything being torn down or set up.",
      },
      {
        step: 2,
        description:
          "The network may lose that datagram, deliver it twice, or deliver it after the one sent behind it, and nothing anywhere reports which of those it did. A send that returned successfully means only that the datagram left this host; it carries no information whatever about arrival, and there is no later message that will supply any.",
      },
      {
        step: 3,
        description:
          "Whatever is needed, the application supplies: its own identifier to match an answer to a question, its own timer to ask a second time, its own judgement about how fast it may send. What it does not supply, it does not have — and the failure that follows tends to get described as an unreliable network rather than as a transport that was chosen for exactly this.",
      },
      {
        step: 4,
        description:
          "Where the model stops is that unreliable describes the transport and not the connection somebody has built across it: a QUIC stream is as ordered and as reliable as anything on #039 and runs entirely here, so the choice was never speed against reliability but where the agreement lives. The absence shows up all over the rest of the deck — #028's load balancer has no connection to terminate and so forwards flows it never reads, #036's stateful filter has no handshake to watch and must infer a flow from a timer alone, and a NAT mapping for one of these holds only for as long as something keeps sending.",
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
      "A node is a machine the cluster observes rather than owns. The kubelet on it registers the object, publishes what the machine has, and renews a lease; the scheduler places work by subtracting requested amounts from that published figure, never by measuring what is in use. When the lease stops arriving nothing is repaired \u2014 the node is marked NotReady and its pods are deleted, to be created again somewhere else.",
    keywords: ["allocatable", "kubelet", "lease", "taint", "eviction"],
    components: [
      {
        name: "Allocatable",
        description:
          "Capacity is what the machine has; allocatable is what survives kube-reserved, system-reserved and the eviction threshold being subtracted from it, and allocatable is the only figure the scheduler ever looks at. It is compared against the sum of the requests already placed here \u2014 a claim, not a measurement \u2014 so a node running at a tenth of its CPU can be entirely full, and a node with room to spare still refuses a pod for want of a free host port, a free address, or a slot under its pod cap.",
      },
      {
        name: "Conditions and the lease",
        description:
          "Ready, and the pressure conditions beside it, are the node\u2019s own account of itself. The kubelet renews a Lease object every few seconds and the node controller watches that rather than the status body, so a silent lease turns Ready to Unknown, which taints the node, which starts the 300 seconds every pod tolerates by default \u2014 and at the end of it the pods are deleted. They are never moved. Until then the API still shows them Running, because it is faithfully reporting the last thing it was told.",
      },
      {
        name: "Taints and tolerations",
        description:
          "The node\u2019s own veto, and the mirror image of a label: a label attracts and the pod chooses it, a taint repels and the node does. NoSchedule turns away what has no matching toleration, NoExecute also removes what is already running. The kubelet taints its own node under memory or disk pressure, and a drain is nothing more than a cordon plus evictions \u2014 which together are where almost every \u201cwhy is nothing scheduling here\u201d ends up.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The machine announces itself. The kubelet starts, authenticates, and creates or updates the Node object with its own capacity, addresses and labels \u2014 there is no inventory held anywhere else, so the cluster learns of a machine only when the machine says so, and deleting the object from the API simply has the kubelet still running there create it again. Which is also the reason a kubelet is confined to its own node\u2019s objects: it is the one client that writes the record it is the subject of.",
      },
      {
        step: 2,
        description:
          "A pod is scheduled against that published figure and nothing else. The nodes are filtered on allocatable minus the requests already placed, on taints the pod does not tolerate, and on whatever its selectors and affinity demand; what survives is scored, and the winner is written into the pod once and never revisited. The scheduler has no idea what any of these machines is actually doing \u2014 #024 is the same instant seen from the pod\u2019s side.",
      },
      {
        step: 3,
        description:
          "The kubelet runs what it was given, renews the lease, and reports. When the machine runs short it also evicts on its own authority, in QoS order \u2014 BestEffort first, then Burstable that is over its request, Guaranteed last \u2014 a decision taken locally that the scheduler never made and cannot see coming, which is why a pod can die on a node that looks healthy from the centre. It is not the same event as a container exceeding its own limit and being killed by the kernel at #022\u2019s cgroup ceiling: that one is about a container, this one is about the machine.",
      },
      {
        step: 4,
        description:
          "A node leaves either deliberately or by falling silent, and the pods go the same way in both cases: deleted here, created elsewhere, with anything held only on this machine\u2019s local disk going with it. Where the model stops is that a node is a unit of failure, not a unit of identity \u2014 nothing above should name one, and a cluster that has come to care which machine a pod landed on has usually rebuilt the pet #024 was trying to be rid of.",
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
      "A cluster is two planes and one door. The control plane decides — an API server standing in front of etcd, with a scheduler and a controller manager that are merely its clients — and the nodes run whatever was decided. Nothing in the architecture addresses anything but the API server: not the scheduler to a kubelet, not one node to another, not any component to etcd. What every whiteboard draws as a mesh is a star, and each spoke is dialled outward from its own end.",
    keywords: ["control plane", "api server", "etcd", "scheduler", "kubelet"],
    components: [
      {
        name: "The control plane",
        description:
          "etcd holds the whole of the cluster’s state, and the API server is the only process permitted to read or write it — so a backup of etcd is a backup of the cluster, and a lost quorum is a cluster that can no longer be changed, since Raft needs a majority and an even number of members buys nothing over the odd one below it. The scheduler and the controller manager keep no state and hold no privileged channel: they watch the API server like any other client and write their decisions back through it, which is why each can be killed and restarted, run three deep behind a leader election, or be swapped for one you wrote yourself.",
      },
      {
        name: "The node side",
        description:
          "A kubelet, a runtime behind the CRI, and kube-proxy programming the machine’s own dataplane for Services. The kubelet is never commanded: it watches the API server for pods whose nodeName is its own and pulls that work down, so the control plane opens no connection to place a pod and a node needs no listening port for one. The exception is worth knowing precisely because it is the exception — logs, exec and port-forward are the API server dialling the kubelet, which is why they fail on their own while everything else about the node is fine.",
      },
      {
        name: "The wiring",
        description:
          "One hub, every spoke outbound, and every loop level-triggered: a component re-reads the state it cares about rather than reacting to a message, so a watch it missed costs nothing and no delivery has to be guaranteed. That buys a system where any part can crash and rejoin without a handshake with any other, and it is paid for twice — the API server is the chokepoint every component in the cluster goes through, and etcd’s quorum, not the number of machines, is the availability figure that actually describes the cluster.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A request arrives at the one door. The API server authenticates it, authorises it against RBAC, runs the mutating and then the validating admission chain, validates the object and writes it to etcd — and only then acknowledges it. What came back is a record of intent: the object exists, and nothing whatsoever is running yet.",
      },
      {
        step: 2,
        description:
          "The scheduler is watching that store rather than waiting to be called. It sees a pod carrying no nodeName, filters and scores the nodes against what each has published about itself (#041), and writes one field — the binding — back through the API server. It never speaks to the machine it picked, and having written that field it is finished with the pod for good.",
      },
      {
        step: 3,
        description:
          "The kubelet on that machine is watching for its own name, and it is the one that acts. It pulls the spec down, has the runtime fetch images and start the containers in the shared sandbox (#024), and reports status back up through the same door; kube-proxy and the endpoint controllers are watching the same store and are meanwhile updating routing rules for it. Every one of them learned what to do by reading, and none of them was told.",
      },
      {
        step: 4,
        description:
          "Steady state is those loops running, which is also where the shape of the diagram pays off: the architecture fails static. Take the entire control plane away and running pods keep running, kube-proxy keeps routing on the rules it already has, and a crashed container is still restarted by the kubelet that owns it — what stops is deciding. Nothing new is scheduled, nothing is rescheduled off a node that has died, nothing scales. Where the model stops is the gap between a cluster that is down and a cluster that has merely stopped changing its mind, and that gap is the whole reason this is drawn as a star.",
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
      "A Deployment never touches a pod. It owns ReplicaSets \u2014 one for each version of the pod template \u2014 and the ReplicaSets own the pods, so a rolling update edits nothing that is running: it is two ReplicaSets being resized against each other, the new one up and the old one down, until the old one holds nothing. A rollback reverses none of that. It re-applies an old revision\u2019s template as a new revision, and what comes back are new pods.",
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
          "A Deployment creates no pods of its own. It hashes the pod template into a pod-template-hash label, stamps that label into a ReplicaSet\u2019s selector and onto every pod that ReplicaSet makes, and from then on one revision\u2019s pods are invisible to every other \u2014 that single label is the whole reason two overlapping revisions never adopt each other\u2019s work. It is also why a Deployment\u2019s own selector cannot be changed once set: it is already baked into ReplicaSets that exist, so altering it is a delete and a re-create rather than an update.",
      },
      {
        name: "The rollout",
        description:
          "maxSurge and maxUnavailable bound how far the two counts may drift from the desired replicas while they move \u2014 at ten replicas and the 25% default on each, between eight and thirteen pods exist at every moment of the update. What advances it is not a clock but readiness: the old ReplicaSet is scaled down only once the new pods report Ready, so the readiness probe (#024) is the thing actually pacing the rollout. Setting maxUnavailable to zero buys guaranteed capacity at the price of needing somewhere to put the surge.",
      },
      {
        name: "Revisions",
        description:
          "There is no history object. The revisions are the old ReplicaSets themselves, kept alive at zero replicas, and revisionHistoryLimit is how many of them survive \u2014 so an undo reaches exactly as far back as those ReplicaSets do and not one step further. An unchanged template records nothing at all: editing the replica count, or re-applying the same manifest, moves no revision, which is why the history is a list of template changes rather than a list of times somebody ran apply.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "You change the pod template and the object is admitted through the one door (#042). The controller hashes the new template, finds no ReplicaSet carrying that hash, and creates one \u2014 at zero replicas. Nothing has been updated and no running pod has been touched. What exists now is a second ReplicaSet beside the first, and the whole rollout from here is those two being given different numbers.",
      },
      {
        step: 2,
        description:
          "The controller walks the counts. It scales the new ReplicaSet up as far as maxSurge allows, waits for those pods to report Ready, scales the old one down as far as maxUnavailable allows, and repeats until the old one is empty. Each ReplicaSet does its own half alone \u2014 it creates or deletes pods to match its number and knows nothing of the other \u2014 so the Deployment is not conducting a migration, it is writing two numbers over and over.",
      },
      {
        step: 3,
        description:
          "A pod that never goes Ready stops the walk where it stands. The old ReplicaSet keeps serving, the new one sits holding its failing pods, and the rollout is not finished \u2014 nor failed, because nothing in the loop has any notion of giving up. progressDeadlineSeconds supplies one: after that long without progress the Deployment is marked Failed. Know what that buys, though. It sets a condition and nothing more; kubectl rollout status turns it into an exit code, and no rollback happens on its own.",
      },
      {
        step: 4,
        description:
          "The undo goes forwards. It takes an old ReplicaSet\u2019s template, makes it the newest revision, and runs the same walk again \u2014 so the version you returned to arrives on new pods with new names and new addresses (#024), and the revision numbers only ever climb. Where the model stops is what a Deployment declines to offer: its pods are interchangeable, so there is no stable name, no ordering and no storage that follows one \u2014 that is a StatefulSet. Nor does it watch load. An autoscaler that does writes the replica count in through the same door as everything else (#042), and the Deployment only ever sees the number change.",
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
      "A stateless service keeps nothing between requests that a later request will need, so any instance can serve any caller and every instance is disposable. The state did not disappear: it arrived with the request, or it sits in a service whose whole job is holding it (#045). Statelessness is a contract the code keeps rather than a property the platform enforces \u2014 AWS reuses a warm Lambda sandbox, so a global written by one invocation is still there for the next.",
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
          "Every fact a request needs has to arrive with it or be fetched: the caller\u2019s identity travels in a token the service verifies by itself rather than looks up (#013), the session row comes from DynamoDB or ElastiCache, the upload goes to S3. The service is stateless; the system is not. What you bought is not less state but state in one place, and every other claim on this card is really a claim about having moved it there.",
      },
      {
        name: "The disposable instance",
        description:
          "An instance\u2019s identity is a count, not a name \u2014 an Auto Scaling group\u2019s desired capacity, a Lambda\u2019s concurrency, an ECS task count. Because no instance is distinguishable from another, scale-in, a failed ALB health check, a rolling deploy and a two-minute spot interruption notice are one event with four causes, and the response to all four is identical: stop sending it traffic and stop it. The only thing at risk is the request already in flight, which is what the target group\u2019s deregistration delay is for.",
      },
      {
        name: "The leak",
        description:
          "Nothing enforces the contract, so it leaks quietly. A Lambda execution environment is reused between invocations, so a module-level global or a file written to /tmp survives into the next invocation on that sandbox and is invisible to every other \u2014 fine for a cached database client, a bug for a counter. ALB target-group stickiness pins a caller to one target with a cookie and re-creates by hand exactly what the tier was built to avoid. An in-process cache does the same without announcing it. Each works perfectly until the next request lands elsewhere, so the failure arrives as a fraction of traffic rather than as an outage.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A request reaches the load balancer (#027), which picks a healthy target by its own algorithm. Nothing in it knows or asks which target served this caller before, and nothing needs to. The choice is free precisely because the answer does not depend on it \u2014 that freedom is the whole return on the tier, and everything below is what it costs.",
      },
      {
        step: 2,
        description:
          "The target answers from what arrived plus what it can fetch. The token is verified with a public key instead of being looked up in a session table (#013); the row is read from DynamoDB; the object is read from S3. Local disk carries the deployment artifact and the logs on their way out, and is never the only copy of anything.",
      },
      {
        step: 3,
        description:
          "Because nothing is on it, the instance can be taken away mid-afternoon without ceremony. Deregister it, wait out the in-flight requests, terminate. There is no drain because there is no data \u2014 and that is also the honest test of whether a service is stateless: not whether it was designed to be, but whether killing one instance at random during business hours is uninteresting.",
      },
      {
        step: 4,
        description:
          "What that buys is that capacity becomes a number and a retry becomes safe: a second attempt is indistinguishable from the first, so a timeout can simply be tried again \u2014 provided the work itself is idempotent, which is a property of the operation and not of the tier, and is the part a stateless design does not give you for free. The difficulty did not vanish either. It was handed, whole, to the service that took the state (#045).",
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
      "A stateful service holds data whose identity outlives any process, so it cannot be replaced by creating another one \u2014 a new instance is a new empty thing. Failure is therefore a promotion, not a replacement: a standby is made primary and the endpoint re-pointed, and every open connection breaks. Scaling is not a number either. Read replicas buy reads and inherit lag; writes scale only by a bigger primary or by a key that splits them. This is where everything #044 handed away went.",
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
          "What you address is a name, not a count \u2014 an RDS endpoint, an EBS volume id, a slot range on a Redis node (#021), a DynamoDB partition. That is the whole difference, and every operational fact on this card follows from it: because the name is what holds the data, standing up another instance recovers nothing, and recovery can only be restore-or-promote \u2014 point a surviving copy at the name the callers already use.",
      },
      {
        name: "Scaling that isn\u2019t a slider",
        description:
          "There are three moves and they are not interchangeable. Vertical: a bigger primary, paid for with a restart. Read replicas: more read capacity, applied asynchronously, so a read issued straight after a write can return the old value \u2014 replication lag is a correctness question wearing a performance question\u2019s clothes. Sharding: the only one of the three that adds write capacity, and it is a data-model decision \u2014 a DynamoDB partition key, a Redis slot range \u2014 taken long before the load that needs it arrives.",
      },
      {
        name: "The blast radius",
        description:
          "An EBS volume lives in one Availability Zone and cannot be attached across one, and that single constraint is what decides where the tier above it may run. Multi-AZ RDS buys a synchronous standby you are not allowed to read from; DynamoDB and S3 write to three zones and never show you the choice. Underneath all of it are the backups: automated snapshots and point-in-time recovery are what bound how much you can lose, and deletion protection exists because this is the one piece of the estate a destroy cannot re-create (#023).",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A write arrives and has to be durable before it is acknowledged. Multi-AZ RDS commits it to a synchronous standby in a second Availability Zone; DynamoDB replicates it to three; EBS lands it on a volume replicated within its own zone. The latency you notice on a stateful write is mostly this \u2014 not the work, but the wait to be able to promise the work survives.",
      },
      {
        step: 2,
        description:
          "The data now has an address. The volume is in one zone, the primary is one instance, the row belongs to one partition. The tier above may float freely (#044), but it has to reach this \u2014 which is why its subnets, its security groups (#036) and how it spreads across zones are all, underneath, decisions about where the state already sits.",
      },
      {
        step: 3,
        description:
          "Failure is a promotion. The standby is made primary and the endpoint\u2019s DNS record re-pointed \u2014 tens of seconds in which writes fail and every open connection is dropped. None of that is transparent: the application must reconnect and retry, and a transaction in flight is gone. This is the bill the tier above pays for having nothing to lose, and it is due at the worst possible moment.",
      },
      {
        step: 4,
        description:
          "Growth is a schema decision, not a slider. Read replicas add reads and lag; only a bigger primary or a partition key that splits the traffic adds writes \u2014 and the key is chosen before the data exists. Get it wrong and one hot partition throttles while the table sits far below its provisioned capacity, which is the failure no amount of added instances can fix. Where the model stops is worth saying plainly: none of this is a flaw in AWS\u2019s managed services. It is the part of the problem they took on, and the reason #044 gets to look easy.",
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
      "A ReplicaSet keeps no list of the pods it made. Every pass it counts whatever currently matches its selector, subtracts that from the number it was given, and creates or deletes the difference \u2014 so it adopts a pod it never created, and relabelling one out of the selector is enough to make it build a replacement. What makes a delete cascade is not memory of having made anything. It is an ownerReference stamped on the pod itself.",
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
          "matchLabels is the whole of what the controller means by mine. It lists pods by that selector, in its own namespace, every sync, from nothing \u2014 so a pod with matching labels and no controller of its own is adopted and counted as though the ReplicaSet had made it, and a pod whose labels are edited off the selector stops existing as far as the count is concerned. The selector is immutable once set, for the same reason a Deployment\u2019s is (#043): it is already written into pods that exist, so changing it would be a delete and a re-create wearing the word update.",
      },
      {
        name: "ownerReferences",
        description:
          "The cascade lives on the pod, not in the controller. Every pod the ReplicaSet owns carries an ownerReference back to it marked controller: true, and it is the garbage collector \u2014 a separate thing entirely \u2014 that reads those references and removes the dependents once the owner goes. Delete with --cascade=orphan and the references are stripped instead: the pods keep running, owned by nothing, and the next ReplicaSet whose selector matches will adopt the lot. Two ReplicaSets with overlapping selectors are that same accident standing still, each counting the other\u2019s pods toward its own number.",
      },
      {
        name: "Which pod goes",
        description:
          "Scaling down is not arbitrary. The controller sorts the candidates and takes from the front: pods not yet assigned to a node before scheduled ones, Pending before Running, not-Ready before Ready, those Ready for the shortest time before the long-settled, more container restarts before fewer, youngest before oldest. Almost all of that is the controller trying to spend the cheapest pod it can find. pod-deletion-cost is the one place the application gets a vote \u2014 an annotation it raises on the pod holding work it would rather not lose.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A number arrives through the one door (#042) \u2014 written by a Deployment creating this ReplicaSet for a new template (#043), by a scale command, or by an autoscaler. The controller wakes and lists the pods in its namespace matching its selector. That list is the whole of its state. Nothing is carried over from the pass before, which is why running the same reconcile twice does nothing the second time.",
      },
      {
        step: 2,
        description:
          "It subtracts: desired minus matching. Positive, and it creates that many pods from the template \u2014 in a batch that doubles each sync, one then two then four, so a template failing at creation cannot storm the API server. Negative, and it deletes that many, taken in the sorted order. Zero, and it does nothing at all, which is precisely what a Deployment\u2019s old revisions are: ReplicaSets kept alive at zero, costing nothing, waiting to be handed a number again (#043).",
      },
      {
        step: 3,
        description:
          "Adoption and release are that same subtraction seen from the pod\u2019s side. A matching pod with no controller is given an ownerReference and counted from that moment; a pod relabelled off the selector has its reference removed and the count falls by one, so a replacement is created in the same pass. That is the whole trick behind pulling a broken pod out to look at it \u2014 change one label and you keep the evidence, still running, while the service gets its pod back.",
      },
      {
        step: 4,
        description:
          "Where the model stops is why the object above it exists. The template is read only when a pod is created, so editing it on a bare ReplicaSet changes nothing already running: there is no rollout here, and that gap is the entire job of a Deployment (#043). A pod also stops being counted the instant it has a deletionTimestamp rather than when it is finally gone, so the replacement is created while the old one is still draining and the two overlap \u2014 a ReplicaSet promises at least N and never at most N. Beyond that it has no notion of order, of a name that survives, or of storage that follows a pod (#024), and no eye on load at all; the number is always somebody else\u2019s to write.",
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
      "Security Assertion Markup Language is browser single sign-on built from signed XML. The identity provider writes an assertion saying who the user is and hands it to the application through the user’s own browser, and the application believes it only because it imported that provider’s certificate before anyone logged in. In the usual binding nothing travels server to server, so the signature, the audience and the clock window on the assertion are the whole of the protection.",
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
          "Trust is set up ahead of time, by hand. Each side publishes an XML metadata document — its entityID, its endpoints and the X.509 certificate it signs with — and the other side imports it. Many service providers load it once and never fetch it again, unlike the keys an OIDC provider publishes for anyone to read at runtime (#017), so when the identity provider rotates its signing certificate every application still holding the old one stops accepting logins. That is why a provider lists the next certificate beside the current one well before the switch.",
      },
      {
        name: "Assertion",
        description:
          "The claim itself: a Subject carrying the NameID, Conditions bounding when it holds (NotBefore, NotOnOrAfter) and for whom (an AudienceRestriction naming the application’s entityID), an AuthnStatement saying how and when the user signed in, and an AttributeStatement with the email, groups and whatever else was mapped. It is signed with XML Signature by the provider’s private key — over the assertion, the Response wrapping it, or both — and can be encrypted to the application’s certificate, because unlike a JWT fetched from a token endpoint (#013) it passes through the browser, readable by anyone at the keyboard.",
      },
      {
        name: "Bindings",
        description:
          "How a message rides HTTP. HTTP-Redirect deflates the application’s small AuthnRequest into a query string; HTTP-POST puts the provider’s large signed Response into a hidden form the browser submits to the Assertion Consumer Service URL; the Artifact binding sends only a reference and lets the application resolve it server to server, the one variant with a back channel. RelayState rides along untouched, so the user lands back on the page they first asked for.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The user opens the application with no session of its own. The application builds an AuthnRequest with a fresh ID, remembers that ID, and redirects the browser to the provider’s single sign-on URL with the page it was asked for tucked into RelayState.",
      },
      {
        step: 2,
        description:
          "The provider authenticates the user however it requires — password, a second factor, or a session it already holds, which is what makes the second application in a morning a silent login. The credentials never reach the application, the same promise OIDC makes (#017).",
      },
      {
        step: 3,
        description:
          "The provider answers with a page holding the signed Response in a hidden form, and the browser posts it to the Assertion Consumer Service URL. The browser is the only courier, which is why everything the application needs to trust has to sit inside the signature.",
      },
      {
        step: 4,
        description:
          "The application checks before it believes: the signature against the certificate from metadata, and on the very element it goes on to read — signature wrapping hides a forged assertion beside a genuinely signed one, and a parser that verifies one node and reads another accepts it. Then the Issuer, the Audience, the Destination, an InResponseTo matching the request it sent, the time window with a little skew, and an assertion ID it has not seen before. Only then does it mint a session of its own, and from that moment the provider has no say: disabling the user there ends nothing already issued unless Single Logout reaches every application, which it often does not. A provider-initiated login skips step one, so there is no InResponseTo to check, and an unsolicited Response is exactly what a replay looks like.",
      },
    ],
  },
] as const satisfies readonly ConceptCardData[];
