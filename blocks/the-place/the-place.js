/**
 * the-place — full-bleed photo with a bottom overlay and a corner tag.
 *
 * Authoring (query-based; the corner tag is the short link-free <p> before the
 * heading, the body is the link-free <p> after it):
 *   - one cell with a <picture>/<img>  (landscape background)
 *   - tag text   (short link-free <p>, e.g. "Est 1996")
 *   - <h2> headline
 *   - body <p>
 *   - a plain text link <a> (NOT a button — left plain, styled per-block)
 */
export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h2, h3');
  const paras = [...block.querySelectorAll('p')];
  const linkPara = paras.find((p) => p.querySelector('a'));
  const textParas = paras.filter((p) => !p.querySelector('a'));
  const [tag, body] = textParas;

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
    tagEl.textContent = tag.textContent.trim();
    frag.append(tagEl);
  }

  const overlay = document.createElement('div');
  overlay.className = 'the-place-overlay';
  if (heading) {
    heading.classList.add('the-place-h2');
    overlay.append(heading);
  }
  if (body) {
    body.classList.add('the-place-body');
    overlay.append(body);
  }
  if (linkPara) {
    const link = linkPara.querySelector('a');
    link.classList.add('the-place-link');
    overlay.append(link);
  }
  frag.append(overlay);

  block.replaceChildren(frag);
}
