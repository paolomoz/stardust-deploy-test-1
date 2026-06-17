/**
 * hero — full-bleed photo brand statement with a bottom-left overlay.
 * This is the LCP block and owns the page's single <h1>.
 *
 * Authoring (one cell each, in order): photo | eyebrow | <h1> | subhead | CTA.
 * Read by CELL, not by <p>: the delivery pipeline strips the <p> wrapper from
 * single-text cells, leaving bare text in the cell <div> (#50/#62).
 */
function cellText(cell) {
  return cell.textContent.trim();
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  let media;
  let heading;
  let ctaAnchor;
  const texts = [];

  cells.forEach((cell) => {
    const pic = cell.querySelector('picture, img');
    const h = cell.querySelector('h1, h2');
    const a = cell.querySelector('a');
    if (pic) media = pic;
    else if (h) heading = h;
    else if (a) ctaAnchor = a;
    else if (cellText(cell)) texts.push(cellText(cell));
  });
  const [eyebrow, subhead] = texts;

  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';

  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'hero-eyebrow';
    p.textContent = eyebrow;
    overlay.append(p);
  }
  if (heading) {
    heading.classList.add('hero-h1');
    overlay.append(heading);
  }
  if (subhead) {
    const p = document.createElement('p');
    p.className = 'hero-subhead';
    p.textContent = subhead;
    overlay.append(p);
  }
  if (ctaAnchor) {
    const ctaRow = document.createElement('p');
    ctaRow.className = 'hero-cta-row';
    ctaRow.append(ctaAnchor.closest('strong, em, del') || ctaAnchor);
    overlay.append(ctaRow);
  }

  const frag = document.createDocumentFragment();
  if (media) {
    const photoWrap = document.createElement('div');
    photoWrap.className = 'hero-photo-wrap';
    media.classList.add('hero-photo');
    photoWrap.append(media);
    frag.append(photoWrap);

    const scrim = document.createElement('div');
    scrim.className = 'hero-scrim';
    scrim.setAttribute('aria-hidden', 'true');
    frag.append(scrim);
  }
  frag.append(overlay);

  block.replaceChildren(frag);
}
