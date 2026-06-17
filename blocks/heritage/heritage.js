/**
 * heritage — editorial 2-column spread: archival photo + heritage text
 * (eyebrow, founding year, origin prose, ghost CTA).
 *
 * Authoring (query-based):
 *   - one cell with a <picture>/<img>  (archival photo)
 *   - eyebrow text  (short link-free <p>, before the heading)
 *   - <h2> the founding year (e.g. 1996)
 *   - prose <p>  (link-free, after the heading)
 *   - CTA: <em><a> secondary (decorated to .btn.btn-secondary by ak.js)
 */
export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h2, h3');
  const paras = [...block.querySelectorAll('p')];
  const ctaPara = paras.find((p) => p.querySelector('a'));
  const textParas = paras.filter((p) => !p.querySelector('a'));
  const [eyebrow, prose] = textParas;

  const figure = document.createElement('figure');
  figure.className = 'heritage-photo';
  if (media) figure.append(media);

  const text = document.createElement('div');
  text.className = 'heritage-text';

  if (eyebrow) {
    eyebrow.classList.add('heritage-eyebrow');
    text.append(eyebrow);
  }
  if (heading) {
    heading.classList.add('heritage-year');
    text.append(heading);
  }
  if (prose) {
    const proseWrap = document.createElement('div');
    proseWrap.className = 'heritage-prose';
    text.append(proseWrap);
    proseWrap.append(prose);
  }
  if (ctaPara) text.append(ctaPara);

  block.replaceChildren(figure, text);
}
