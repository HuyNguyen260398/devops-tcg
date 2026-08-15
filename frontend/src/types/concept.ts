export interface ConceptComponentData {
  readonly name: string;
  readonly description: string;
}

export interface HowItWorksStep {
  readonly step: number;
  readonly description: string;
}

export interface ConceptCardData {
  readonly id: string;
  readonly cardNumber: string;
  readonly series: string;
  readonly type: string;
  readonly title: string;
  readonly descriptor: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
  };
  readonly definition: string;
  readonly keywords: readonly string[];
  readonly components: readonly ConceptComponentData[];
  readonly howItWorks: readonly HowItWorksStep[];
}
