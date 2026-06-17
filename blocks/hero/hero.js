/**
 * hero — full-bleed photo brand statement with a bottom-left overlay.
 * This is the LCP block and owns the page's single <h1>.
 *
 * Authoring (query-based, order within the overlay is eyebrow -> h1 -> subhead):
 *   - one cell with a <picture>/<img>  (background photo)
 *   - eyebrow text  (short, link-free <p>, before the heading)
 *   - <h1> headline
 *   - subhead text  (link-free <p>, after the heading)
 *   - CTA row: <strong><a> primary (decorated to .btn.btn-primary by ak.js)
 */
export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2');
  // The delivery pipeline unwraps the <p> around a button paragraph, so the CTA
  // anchor may NOT live inside a <p> — query it directly rather than via paras.
  const ctaAnchor = block.querySelector('a');
  const textParas = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('a'));
  const [eyebrow, subhead] = textParas;

  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';

  if (eyebrow) {
    eyebrow.classList.add('hero-eyebrow');
    overlay.append(eyebrow);
  }
  if (heading) {
    heading.classList.add('hero-h1');
    overlay.append(heading);
  }
  if (subhead) {
    subhead.classList.add('hero-subhead');
    overlay.append(subhead);
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
