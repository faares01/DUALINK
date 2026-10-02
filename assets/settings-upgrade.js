(() => {
  const settings = document.querySelector('#settings');
  const grid = settings?.querySelector('.settings-grid');
  if (!grid) return;
  const existingCredit = grid.querySelector('.about');
  if (existingCredit) {
    existingCredit.className = 'setting-card settings-credit';
    existingCredit.innerHTML = `<div><span class="setting-icon faa-mark">F</span><h3>Made by FAA</h3><p>DUALINK is made with care by <a href="https://faaa.space/?utm_source=chatgpt.com" target="_blank" rel="noreferrer">FAA</a>.<br>Visit <a href="https://faaa.space/?utm_source=chatgpt.com" target="_blank" rel="noreferrer">faaa.space ↗</a></p></div><span class="version">v0.1.0</span>`;
  }
  const intro = settings.querySelector('.page-intro');
  intro.insertAdjacentHTML('afterend', `<section class="settings-summary"><div class="account-overview"><span class="account-avatar">FA</span><div><b>Your DUALINK account</b><small><i></i>Google sign-in · protected session</small></div></div><div><b>2 connected devices</b><small>Linux workstation · Windows laptop</small></div><div><b>3 folder links</b><small>Only selected folders are monitored</small></div></section>`);
  grid.insertAdjacentHTML('beforeend', `<section class="setting-card settings-upgrade-card"><div><span class="setting-icon">⌘</span><h3>Connected devices</h3><p>Review every computer using your account, rename it, or disconnect it remotely.</p></div><div class="setting-footer"><div class="devices"><span class="device-chip">Linux</span><span class="device-chip">Windows</span></div><button class="setting-action" type="button">Manage devices</button></div></section><section class="setting-card settings-upgrade-card"><div><span class="setting-icon">▣</span><h3>Folder permissions</h3><p>DUALINK can only see folders you select. Nothing outside those locations is accessible.</p></div><div class="setting-footer"><span>3 approved folders</span><button class="setting-action" type="button">Review access</button></div></section><section class="setting-card settings-upgrade-card"><div><span class="setting-icon">⌁</span><h3>Transfer storage</h3><p>Queued transfers are encrypted in transit and removed after delivery based on your retention rule.</p></div><div class="setting-footer"><span>30-day safe delete</span><button class="setting-action" type="button">Storage rules</button></div></section>`);
  document.querySelector('.main')?.insertAdjacentHTML('beforeend', `<footer class="dualink-footer"><p>Thank you for visiting and using <strong>DUALINK</strong></p><p>wishing you a wonderfully weird day. Made by <a href="https://faaa.space/?utm_source=chatgpt.com" target="_blank" rel="noreferrer">FAA</a>.</p></footer>`);
  document.querySelectorAll('.setting-action').forEach(button => button.onclick = () => window.showDualinkToast?.('Coming with the desktop app', 'This control will manage permissions through your connected device.'));
})();
