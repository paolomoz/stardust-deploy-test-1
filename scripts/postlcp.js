import { getConfig, getMetadata } from './ak.js';

/**
 * Inject a static chrome fragment (header / footer) verbatim.
 * The fragment is plain `<style> + DOM` committed under /fragments and served
 * from the code origin. We set the host element's class BEFORE injecting so the
 * fragment's own root selector (header.header / footer.footer) matches — without
 * this, any styling on the fragment ROOT (background/padding) silently no-ops.
 * @param {Element} el the host <header> or <footer>
 * @param {string} name 'header' | 'footer'
 */
async function loadStaticFragment(el, name) {
  if (!el) return;
  if (getMetadata(name) === 'off') {
    el.remove();
    return;
  }
  const { codeBase } = getConfig();
  try {
    const resp = await fetch(`${codeBase}/fragments/${name}.html`);
    if (!resp.ok) return;
    const html = await resp.text();
    el.className = name;
    el.innerHTML = html;
  } catch (e) {
    // chrome is non-critical; never block the page on it
  }
}

export default async function loadPostLCP() {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  await Promise.all([
    loadStaticFragment(header, 'header'),
    loadStaticFragment(footer, 'footer'),
  ]);
}
