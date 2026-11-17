/**
 * One picture per learning unit, shown at the top of its lesson.
 * Drawn by hand as plain SVG. Colours follow the app theme: currentColor for lines and
 * text, and the --accent variable for highlights, so the pictures work in light and dark mode.
 */
export type Diagram = { caption: string; svg: string };

const JS1_U01: Diagram = {
  caption: "The engine keeps a stack of execution contexts. The newest one sits on top, and it is the only one running.",
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 250" role="img" aria-label="A call stack with three boxes: the global context at the bottom, greet below log, and log on top.">
  <text x="180" y="22" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">The call stack, top to bottom</text>
  <rect x="60" y="180" width="240" height="46" rx="10" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="180" y="208" text-anchor="middle" font-size="13" fill="currentColor">Global context (runs first)</text>
  <rect x="60" y="124" width="240" height="46" rx="10" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="2"/>
  <text x="180" y="152" text-anchor="middle" font-size="13" fill="currentColor">greet() is waiting</text>
  <rect x="60" y="68" width="240" height="46" rx="10" fill="var(--accent)" fill-opacity="0.35" stroke="var(--accent)" stroke-width="2"/>
  <text x="180" y="96" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">log() is running now</text>
  <text x="180" y="240" text-anchor="middle" font-size="12" fill="currentColor">Calls go on the top. Finished calls come off the top.</text>
</svg>`,
};

const JS1_U02: Diagram = {
  caption: "Hoisting: the declaration moves up in the engine's eyes, but the value stays where you wrote it.",
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 250" role="img" aria-label="Left: the code as written. Right: the same code with the var declaration moved to the top, so the log prints undefined.">
  <text x="90" y="24" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">What you write</text>
  <text x="270" y="24" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">What the engine sees</text>
  <rect x="10" y="36" width="160" height="92" rx="10" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="22" y="66" font-size="12" fill="currentColor">console.log(name)</text>
  <text x="22" y="92" font-size="12" fill="currentColor">var name = 'Asha'</text>
  <rect x="190" y="36" width="160" height="92" rx="10" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="2"/>
  <text x="202" y="60" font-size="12" fill="currentColor">var name</text>
  <text x="202" y="82" font-size="12" fill="currentColor">console.log(name) → undefined</text>
  <text x="202" y="104" font-size="12" fill="currentColor">name = 'Asha'</text>
  <line x1="180" y1="82" x2="190" y2="82" stroke="currentColor" stroke-width="2"/>
  <text x="20" y="168" font-size="13" font-weight="600" fill="currentColor">undefined</text>
  <text x="120" y="168" font-size="12" fill="currentColor">declared, but no value yet</text>
  <text x="20" y="196" font-size="13" font-weight="600" fill="currentColor">not defined</text>
  <text x="120" y="196" font-size="12" fill="currentColor">never declared at all</text>
  <text x="20" y="228" font-size="12" fill="currentColor">The first is quiet. The second throws an error.</text>
</svg>`,
};

const AI_U01: Diagram = {
  caption: "AI is the biggest circle. Machine learning sits inside it, deep learning sits inside that, and large language models are built on deep learning.",
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 270" role="img" aria-label="Three nested circles: artificial intelligence contains machine learning, which contains deep learning.">
  <circle cx="180" cy="130" r="118" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="180" y="34" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Artificial intelligence</text>
  <circle cx="180" cy="140" r="82" fill="var(--accent)" fill-opacity="0.12" stroke="currentColor" stroke-width="2"/>
  <text x="180" y="72" text-anchor="middle" font-size="13" font-weight="600" fill="currentColor">Machine learning</text>
  <circle cx="180" cy="150" r="46" fill="var(--accent)" fill-opacity="0.3" stroke="var(--accent)" stroke-width="2"/>
  <text x="180" y="146" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">Deep</text>
  <text x="180" y="162" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">learning</text>
  <text x="180" y="258" text-anchor="middle" font-size="12" fill="currentColor">Each ring is a special case of the ring around it.</text>
</svg>`,
};

const AI_U02: Diagram = {
  caption: "A prompt becomes tokens, the model mixes them with attention, and it predicts one next token at a time inside a limited context window.",
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 250" role="img" aria-label="Four steps in a row: tokens, embeddings, attention, next token. Below, a context window bar showing that older tokens fall out.">
  <rect x="8" y="30" width="76" height="46" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="46" y="58" text-anchor="middle" font-size="12" fill="currentColor">Tokens</text>
  <rect x="94" y="30" width="76" height="46" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="132" y="58" text-anchor="middle" font-size="12" fill="currentColor">Embeddings</text>
  <rect x="180" y="30" width="76" height="46" rx="8" fill="var(--accent)" fill-opacity="0.3" stroke="var(--accent)" stroke-width="2"/>
  <text x="218" y="58" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">Attention</text>
  <rect x="266" y="30" width="86" height="46" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="309" y="58" text-anchor="middle" font-size="12" fill="currentColor">Next token</text>
  <text x="180" y="108" text-anchor="middle" font-size="12" fill="currentColor">Attention lets each token weigh the others by relevance.</text>
  <rect x="20" y="130" width="320" height="26" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="20" y="130" width="220" height="26" rx="6" fill="var(--accent)" fill-opacity="0.3"/>
  <text x="180" y="148" text-anchor="middle" font-size="12" fill="currentColor">Context window: the text the model can see</text>
  <text x="20" y="184" font-size="12" fill="currentColor">Tokens before the left edge are forgotten.</text>
  <text x="20" y="208" font-size="12" fill="currentColor">A token is a word piece, not always a whole word.</text>
  <text x="20" y="232" font-size="12" fill="currentColor">The model guesses one token, adds it, and repeats.</text>
</svg>`,
};

const AWS_U01: Diagram = {
  caption: "A region is a geographic area. Inside it sit availability zones, and each zone holds one or more data centres.",
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 250" role="img" aria-label="A region containing two availability zones, each with data centres. Edge locations sit outside, near users.">
  <rect x="10" y="20" width="340" height="180" rx="14" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="24" y="42" font-size="13" font-weight="600" fill="currentColor">Region</text>
  <rect x="26" y="56" width="150" height="130" rx="10" fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)" stroke-width="2"/>
  <text x="101" y="78" text-anchor="middle" font-size="12" fill="currentColor">Availability zone A</text>
  <rect x="50" y="96" width="34" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="100" y="96" width="34" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="101" y="160" text-anchor="middle" font-size="11" fill="currentColor">data centres</text>
  <rect x="184" y="56" width="150" height="130" rx="10" fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)" stroke-width="2"/>
  <text x="259" y="78" text-anchor="middle" font-size="12" fill="currentColor">Availability zone B</text>
  <rect x="208" y="96" width="34" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="258" y="96" width="34" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="259" y="160" text-anchor="middle" font-size="11" fill="currentColor">data centres</text>
  <text x="180" y="226" text-anchor="middle" font-size="12" fill="currentColor">Edge locations are small sites near users. They cache content closer to them.</text>
</svg>`,
};

export const DIAGRAMS: Record<string, Diagram> = {
  "JS1-U01": JS1_U01,
  "JS1-U02": JS1_U02,
  "AI-U01": AI_U01,
  "AI-U02": AI_U02,
  "AWS-U01": AWS_U01,
};
