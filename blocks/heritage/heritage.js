/**
 * heritage — editorial 2-column spread: archival photo + heritage text
 * (eyebrow, founding year, origin prose, ghost CTA).
 *
 * Authoring (one cell each, in order): photo | eyebrow | <h2>year | prose | CTA.
 * Read by CELL, not by <p> (the pipeline strips <p> from single-text cells, #50/#62).
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  let media;
  let heading;
  let ctaAnchor;
  const texts = [];

  cells.forEach((cell) => {
    const pic = cell.querySelector('picture, img');
    const h = cell.querySelector('h2, h3');
    const a = cell.querySelector('a');
    if (pic) media = pic;
    else if (h) heading = h;
    else if (a) ctaAnchor = a;
    else if (cell.textContent.trim()) texts.push(cell.textContent.trim());
  });
  const [eyebrow, prose] = texts;

  const figure = document.createElement('figure');
  figure.className = 'heritage-photo';
  if (media) figure.append(media);

  const text = document.createElement('div');
  text.className = 'heritage-text';

  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'heritage-eyebrow';
    p.textContent = eyebrow;
    text.append(p);
  }
  if (heading) {
    heading.classList.add('heritage-year');
    text.append(heading);
  }
  if (prose) {
    const proseWrap = document.createElement('div');
    proseWrap.className = 'heritage-prose';
    const p = document.createElement('p');
    p.textContent = prose;
    proseWrap.append(p);
    text.append(proseWrap);
  }
  if (ctaAnchor) {
    const ctaRow = document.createElement('p');
    ctaRow.append(ctaAnchor.closest('strong, em, del') || ctaAnchor);
    text.append(ctaRow);
  }

  block.replaceChildren(figure, text);
}
