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
] as const satisfies readonly ConceptCardData[];
