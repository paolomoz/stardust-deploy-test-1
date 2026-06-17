/**
 * featured-beer — eyebrow + section heading + a 3-up product card grid + a
 * trailing "see the lineup" text link.
 *
 * Authoring (canonical: one ROW per card; head rows before the first card,
 * foot link row after the last):
 *   head:  <p>eyebrow</p>           (link-free, no heading)
 *          <h2>section title</h2>
 *   card:  badge | <h3>name</h3> | <picture> | style | <a>read more</a>
 *          (cells classified by content, not position — badge & style are the
 *           two plain-text cells, in order)
 *   foot:  <a>see the lineup →</a>  (plain link, not a button)
 *
 * Falls back to segmenting on <h3> boundaries if the rows arrive flattened (#52).
 */
function cardFromCells(cells) {
  const article = document.createElement('article');
  article.className = 'card';

  const nameCell = cells.find((c) => c.querySelector('h3') || c.matches('h3'));
  const mediaCell = cells.find((c) => c.querySelector('picture, img') || c.matches('picture, img'));
  const linkCell = cells.find((c) => c.querySelector('a') || c.matches('a'));
  const textCells = cells.filter((c) => c !== nameCell && c !== mediaCell && c !== linkCell
    && c.textContent.trim());
  const [badge, style] = textCells;

  if (badge) {
    const b = document.createElement('span');
    b.className = 'card-badge';
    b.textContent = badge.textContent.trim();
    article.append(b);
  }
  if (nameCell) {
    const h3 = nameCell.matches('h3') ? nameCell : nameCell.querySelector('h3');
    h3.classList.add('card-name');
    article.append(h3);
  }
  if (mediaCell) {
    const media = mediaCell.matches('picture, img') ? mediaCell : mediaCell.querySelector('picture, img');
    const wrap = document.createElement('div');
    wrap.className = 'card-photo-wrap';
    media.classList.add('card-photo');
    wrap.append(media);
    article.append(wrap);
  }
  if (style) {
    const p = document.createElement('p');
    p.className = 'card-style';
    p.textContent = style.textContent.trim();
    article.append(p);
  }
  if (linkCell) {
    const a = linkCell.matches('a') ? linkCell : linkCell.querySelector('a');
    a.classList.add('card-readmore');
    article.append(a);
  }
  return article;
}

export default function decorate(block) {
  const rows = [...block.children];
  const isCardRow = (r) => r.querySelector('h3');
  let cardRows = rows.filter(isCardRow);

  // Flattened fallback: one row, many h3s -> segment cells on h3 boundaries.
  if (!cardRows.length) {
    const cell = block.querySelector(':scope > div > div') || block;
    const groups = [];
    let current = null;
    [...cell.children].forEach((el) => {
      if (el.matches('h3') || el.querySelector?.('h3')) { current = []; groups.push(current); }
      if (current) current.push(el);
    });
    cardRows = groups.map((g) => ({ children: g, _synthetic: true }));
  }

  const firstCard = rows.indexOf(cardRows[0]);
  const lastCard = rows.indexOf(cardRows[cardRows.length - 1]);
  const headRows = firstCard > 0 ? rows.slice(0, firstCard) : [];
  const footRows = lastCard >= 0 && lastCard < rows.length - 1 ? rows.slice(lastCard + 1) : [];

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  headRows.forEach((r) => {
    const h2 = r.querySelector('h2');
    if (h2) {
      h2.classList.add('featured-h2');
      wrap.append(h2);
      return;
    }
    const txt = r.textContent.trim();
    if (txt) {
      const p = document.createElement('p');
      p.className = 'featured-eyebrow';
      p.textContent = txt;
      wrap.insertBefore(p, wrap.firstChild);
    }
  });

  const grid = document.createElement('div');
  grid.className = 'card-grid';
  cardRows.forEach((r) => {
    const cells = r._synthetic ? r.children : [...r.children];
    grid.append(cardFromCells(cells));
  });
  wrap.append(grid);

  footRows.forEach((r) => {
    const a = r.querySelector('a');
    if (!a) return;
    a.classList.add('strip-foot-link');
    const foot = document.createElement('div');
    foot.className = 'strip-foot';
    foot.append(a);
    wrap.append(foot);
  });

  block.replaceChildren(wrap);
}
