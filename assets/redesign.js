(() => {
  document.documentElement.style.scrollBehavior = 'smooth';
  const hero = document.querySelector('.hero');
  if (hero) {
    const stamp = document.createElement('span');
    stamp.className = 'redesign-stamp';
    stamp.textContent = 'DUALINK / FILE ROUTING SYSTEM';
    stamp.style.cssText = 'position:absolute;left:0;bottom:17px;color:#1559e8;font:10px DM Mono;letter-spacing:.1em';
    hero.append(stamp);
  }
})();
