import type { ConceptCardData } from "@/types/concept";

export const conceptCards = [
  {
    id: "proxy",
    cardNumber: "#001",
    series: "NETWORK SERIES",
    type: "NETWORK",
    title: "Proxy",
    descriptor: "INTERMEDIARY",
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
    series: "DELIVERY SERIES",
    type: "NETWORK",
    title: "CDN",
    descriptor: "EDGE DELIVERY",
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
    series: "WEB SERIES",
    type: "PLATFORM",
    title: "NGINX",
    descriptor: "EVENT DRIVEN",
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
    series: "NETWORK SERIES",
    type: "NETWORK",
    title: "Reverse Proxy",
    descriptor: "SERVER SIDE",
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
    series: "FOUNDATIONS SERIES",
    type: "NETWORK",
    title: "OSI Model",
    descriptor: "7 LAYERS",
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
    series: "NAMING SERIES",
    type: "NETWORK",
    title: "DNS",
    descriptor: "RESOLUTION",
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
    series: "SECURITY SERIES",
    type: "SECURITY",
    title: "SSL",
    descriptor: "DEPRECATED",
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
    series: "SECURITY SERIES",
    type: "SECURITY",
    title: "TLS",
    descriptor: "SECURE TRANSPORT",
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
    series: "SECURITY SERIES",
    type: "SECURITY",
    title: "SSH",
    descriptor: "REMOTE ACCESS",
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
    series: "SERVERLESS SERIES",
    type: "COMPUTE",
    title: "Lambda Throttle",
    descriptor: "CONCURRENCY LIMIT",
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
] as const satisfies readonly ConceptCardData[];
