/**
 * the-people — two full-bleed photo halves, each an entire clickable tile that
 * links to a taproom. Each half: background photo + eyebrow + heading + teaser
 * + CTA label (the whole half is the link, so the CTA is a <span>, not an <a>).
 *
 * Authoring (one ROW per half; cells in order — eyebrow precedes the heading):
 *   <picture> | eyebrow | <h2>heading</h2> | teaser | <a href>CTA label</a>
 *
 * The half's href is taken from the CTA link. Falls back to segmenting a single
 * flattened cell on heading boundaries, buffering the pre-heading eyebrow (#76).
 */
function buildHalf(cells) {
  const media = cells.find((c) => c.matches?.('picture, img') || c.querySelector?.('picture, img'));
  const headingCell = cells.find((c) => c.matches?.('h2, h3') || c.querySelector?.('h2, h3'));
  const linkCell = cells.find((c) => c.matches?.('a') || c.querySelector?.('a'));
  const textCells = cells.filter((c) => c !== media && c !== headingCell && c !== linkCell
    && c.textContent.trim());
  const [eyebrow, teaser] = textCells;

  const link = linkCell && (linkCell.matches?.('a') ? linkCell : linkCell.querySelector('a'));

  const half = document.createElement('a');
  half.className = 'people-half';
  if (link) half.href = link.getAttribute('href');

  if (media) {
    const img = media.matches?.('picture, img') ? media : media.querySelector('picture, img');
    img.classList.add('people-half-bg');
    half.append(img);
    const scrim = document.createElement('div');
    scrim.className = 'people-half-scrim';
    scrim.setAttribute('aria-hidden', 'true');
    half.append(scrim);
  }

  const overlay = document.createElement('div');
  overlay.className = 'people-overlay';
  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'people-eyebrow';
    p.textContent = eyebrow.textContent.trim();
    overlay.append(p);
  }
  if (headingCell) {
    const h = headingCell.matches?.('h2, h3') ? headingCell : headingCell.querySelector('h2, h3');
    h.classList.add('people-h3');
    overlay.append(h);
  }
  if (teaser) {
    const p = document.createElement('p');
    p.className = 'people-teaser';
    p.textContent = teaser.textContent.trim();
    overlay.append(p);
  }
  if (link) {
    const cta = document.createElement('span');
    cta.className = 'people-cta';
    cta.textContent = link.textContent.trim();
    overlay.append(cta);
  }
  half.append(overlay);
  return half;
}

function segmentFlattened(cell) {
  const groups = [];
  let current = null;
  let pendingEyebrow = null;
  [...cell.children].forEach((el) => {
    const isHeading = el.matches('h2, h3') || el.querySelector?.('h2, h3');
    if (isHeading) {
      current = [];
      if (pendingEyebrow) { current.push(pendingEyebrow); pendingEyebrow = null; }
      current.push(el);
      groups.push(current);
      return;
    }
    if (!current) {
      // pre-heading content: media starts the group eagerly, text buffers as eyebrow
      if (el.matches('picture, img') || el.querySelector?.('picture, img')) {
        current = [el];
        groups.push(current);
      } else {
        pendingEyebrow = el;
      }
      return;
    }
    current.push(el);
  });
  return groups;
}

export default function decorate(block) {
  const rows = [...block.children];
  let halfGroups = rows.filter((r) => r.querySelector('h2, h3')).map((r) => [...r.children]);

  if (halfGroups.length < 2) {
    const cell = block.querySelector(':scope > div > div') || block;
    halfGroups = segmentFlattened(cell);
  }

  block.replaceChildren(...halfGroups.map(buildHalf));
}
