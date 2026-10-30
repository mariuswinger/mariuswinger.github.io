import type { Link, PhrasingContent, Root } from 'mdast';
import { defineMdastPlugin, type MdastPluginEntry } from 'satteri';

/**
 * Turns APA-style inline citations such as `(Naur, 1985)` or
 * `(Faros AI, 2025; METR, 2025)` into `<a class="cite" href="#references">`
 * links so they stand out from the surrounding prose. Text after the
 * "References" heading is left untouched so the bibliography is not rewritten.
 */

const REFERENCES_HEADING = 'references';
const YEAR = String.raw`(?:19|20)\d{2}[a-z]?`;
const SINGLE = String.raw`[A-Z][^();]*?,\s${YEAR}`;
const CITATION = new RegExp(String.raw`\((${SINGLE}(?:;\s${SINGLE})*)\)`, 'g');

function citeLink(value: string): Link {
  return {
    type: 'link',
    url: `#${REFERENCES_HEADING}`,
    data: { hProperties: { className: ['cite'] } },
    children: [{ type: 'text', value }],
  };
}

function splitCitations(text: string): PhrasingContent[] | null {
  const nodes: PhrasingContent[] = [];
  let last = 0;

  for (const match of text.matchAll(CITATION)) {
    const index = match.index ?? 0;
    if (index > last) {
      nodes.push({ type: 'text', value: text.slice(last, index) });
    }
    match[1].split(/;\s*/).forEach((part, i) => {
      if (i > 0) nodes.push({ type: 'text', value: ' ' });
      nodes.push(citeLink(part));
    });
    last = index + match[0].length;
  }

  if (nodes.length === 0) return null;
  if (last < text.length) {
    nodes.push({ type: 'text', value: text.slice(last) });
  }
  return nodes;
}

function referencesOffset(
  root: Readonly<Root>,
  textContent: (node: Root['children'][number]) => string,
): number {
  for (const child of root.children) {
    if (child.type !== 'heading') continue;
    if (textContent(child).trim().toLowerCase() !== REFERENCES_HEADING) continue;
    return child.position?.start.offset ?? Number.POSITIVE_INFINITY;
  }
  return Number.POSITIVE_INFINITY;
}

// Factory form: Sätteri calls it once per document, so the state is per compile.
export const citations: MdastPluginEntry = () => {
  let stopAt = Number.POSITIVE_INFINITY;

  return defineMdastPlugin({
    name: 'citations',
    before(root, ctx) {
      stopAt = referencesOffset(root, (node) => ctx.textContent(node));
    },
    text(node, ctx) {
      const offset = node.position?.start.offset ?? 0;
      if (offset >= stopAt) return;
      if (ctx.parent(node)?.type === 'link') return;

      const replacement = splitCitations(node.value);
      if (replacement === null) return;
      ctx.replaceNode(node, replacement);
    },
  });
};
