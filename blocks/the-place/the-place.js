/**
 * the-place — full-bleed photo with a bottom overlay and a corner tag.
 *
 * Authoring (one cell each, in order): photo | tag | <h2> | body | text link.
 * Read by CELL, not by <p> (the pipeline strips <p> from single-text cells, #50/#62).
 * The text link is a plain <a> (not a button) — left plain, styled per-block.
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  let media;
  let heading;
  let link;
  const texts = [];

  cells.forEach((cell) => {
    const pic = cell.querySelector('picture, img');
    const h = cell.querySelector('h2, h3');
    const a = cell.querySelector('a');
    if (pic) media = pic;
    else if (h) heading = h;
    else if (a) link = a;
    else if (cell.textContent.trim()) texts.push(cell.textContent.trim());
  });
  const [tag, body] = texts;

  const frag = document.createDocumentFragment();

  if (media) {
    media.classList.add('the-place-bg');
    frag.append(media);
    const scrim = document.createElement('div');
    scrim.className = 'the-place-scrim';
    scrim.setAttribute('aria-hidden', 'true');
    frag.append(scrim);
  }

  if (tag) {
    const tagEl = document.createElement('span');
    tagEl.className = 'the-place-tag';
    tagEl.textContent = tag;
    frag.append(tagEl);
  }

  const overlay = document.createElement('div');
  overlay.className = 'the-place-overlay';
  if (heading) {
    heading.classList.add('the-place-h2');
    overlay.append(heading);
  }
  if (body) {
    const p = document.createElement('p');
    p.className = 'the-place-body';
    p.textContent = body;
    overlay.append(p);
  }
  if (link) {
    link.classList.add('the-place-link');
    overlay.append(link);
  }
  frag.append(overlay);

  block.replaceChildren(frag);
}
