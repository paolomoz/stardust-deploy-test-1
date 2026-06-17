import ENV from './utils/env.js';

async function loadSidekick() {
  const getSk = () => document.querySelector('aem-sidekick');

  const sk = getSk() || await new Promise((resolve) => {
    document.addEventListener('sidekick-ready', () => resolve(getSk()));
  });
  if (sk) import('../tools/sidekick/sidekick.js').then((mod) => mod.default(sk));
}

(function loadLazy() {
  import('./utils/lazyhash.js');
  import('./utils/favicon.js');
  // footer is loaded as a static fragment in postlcp.js (loadStaticFragment),
  // so the utils/footer.js loadBlock(footer) path is intentionally removed —
  // otherwise it renders a visible "Error" box (there is no blocks/footer).

  // Author facing tools
  if (ENV !== 'prod') {
    import('../tools/scheduler/scheduler.js');
    loadSidekick();
  }
}());
