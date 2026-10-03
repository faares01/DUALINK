(() => {
  const gate = document.querySelector('#login-gate');
  const googleButton = gate?.querySelector('.google-button');
  if (googleButton && window.__DUALINK_DESKTOP__?.startLogin) {
    googleButton.addEventListener('click', event => { event.preventDefault(); window.__DUALINK_DESKTOP__.startLogin(); });
  }
  fetch('api/auth/me.php', { credentials: 'same-origin', cache: 'no-store' })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      gate.classList.add('hidden');
      const avatar = document.querySelector('.avatar');
      if (data.user?.display_name) avatar.textContent = data.user.display_name.split(/\s+/).slice(0,2).map(n => n[0]).join('').toUpperCase();
    })
    .catch(() => { /* No valid session: the Google-only gate remains visible. */ });
})();
