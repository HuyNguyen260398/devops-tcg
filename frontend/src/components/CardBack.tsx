import type { ConceptCardData } from "@/types/concept";

interface CardBackProps {
  readonly card: ConceptCardData;
}

export function CardBack({ card }: CardBackProps) {
  return (
    <article>
      <header>
        <div>
          <p>{card.series}</p>
          <h2>{card.title}</h2>
        </div>
        <p>ANATOMY / FLOW</p>
      </header>

      <section aria-labelledby="components-heading">
        <h2 id="components-heading">Components</h2>
        <dl>
          {card.components.map((item) => (
            <div key={item.name}>
              <dt>{item.name}</dt>
              <dd>{item.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="flow-heading">
        <h2 id="flow-heading">How it works</h2>
        <ol>
          {card.howItWorks.map((item) => (
            <li key={item.step}>
              <span aria-hidden="true">{item.step}</span>
              <span>{item.description}</span>
            </li>
          ))}
        </ol>
      </section>

      <p>Flip to return to the front</p>
    </article>
  );
}
