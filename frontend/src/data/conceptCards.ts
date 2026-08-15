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
    },
    definition:
      "A proxy receives a request from one system and forwards it to another on the requester’s behalf.",
    keywords: ["intermediary", "forward proxy", "reverse proxy", "routing", "caching"],
    components: [
      { name: "Client", description: "Originates the request." },
      {
        name: "Proxy",
        description: "Receives traffic and applies routing, security, or caching rules.",
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
        description: "The proxy evaluates the request and applies configured policies.",
      },
      {
        step: 3,
        description: "An allowed request is forwarded to the destination server.",
      },
      { step: 4, description: "The response returns through the proxy to the client." },
    ],
  },
] as const satisfies readonly ConceptCardData[];
