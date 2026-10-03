(() => {
  const bridge = window.__DUALINK_DESKTOP__;
  if (!bridge) return;

  let currentDevice = null;
  let targets = [];
  let selectedSourcePath = null;
  const api = (url, options = {}) => fetch(url, { credentials: 'same-origin', ...options });
  const selectedDestination = () => document.querySelector('.destination.selected')?.dataset.dest || '';
  const selectedTarget = () => targets[0];

  function setSendEnabled() {
    const ready = Boolean(selectedSourcePath && selectedTarget() && selectedDestination());
    document.querySelectorAll('#send-button,.modal-send').forEach(button => { button.disabled = !ready; });
  }

  function setDeviceCopy() {
    const device = selectedTarget();
    if (!device) return;
    document.querySelectorAll('.destination-head b').forEach(node => { node.textContent = device.name; });
    document.querySelectorAll('.destination-head small').forEach(node => { node.textContent = `${device.platform} device · receives when it opens`; });
  }

  async function loadDevices() {
    const response = await api('api/devices.php');
    if (!response.ok) throw new Error('Sign in with Google to connect this device.');
    const data = await response.json();
    targets = (data.devices || []).filter(device => device.id !== currentDevice?.id);
    setDeviceCopy(); setSendEnabled();
  }

  async function connectDesktop() {
    const info = await bridge.deviceInfo();
    const label = info.platform === 'win32' ? 'Windows device' : 'Linux device';
    currentDevice = await bridge.registerDevice(label);
    await loadDevices();
    document.documentElement.dataset.dualinkDesktop = 'connected';
  }

  async function chooseNativeFile() {
    const filePath = await bridge.pickFile();
    if (!filePath) return;
    selectedSourcePath = filePath;
    const name = filePath.split(/[\\/]/).pop();
    window.showDualinkToast?.('File ready to send', `${name} will be queued for the selected device.`);
    setSendEnabled();
  }

  async function sendAcross(event) {
    event.preventDefault(); event.stopImmediatePropagation();
    if (!selectedSourcePath) { await chooseNativeFile(); return; }
    const target = selectedTarget(); const targetPath = selectedDestination();
    if (!target || !targetPath) { window.showDualinkToast?.('Connect the other device first', 'Open DUALINK on the other system and sign in with the same Google account.'); return; }
    try {
      await bridge.sendAcross({ sourcePath: selectedSourcePath, targetDeviceId: target.id, targetPath });
      const fileName = selectedSourcePath.split(/[\\/]/).pop();
      window.showDualinkToast?.('Queued for delivery', `${fileName} will arrive in ${targetPath} when ${target.name} opens.`);
      selectedSourcePath = null; setSendEnabled();
      document.querySelector('#send-modal[open]')?.close();
      document.querySelector('#modal-backdrop')?.classList.remove('open');
    } catch (error) { window.showDualinkToast?.('Could not queue this file', error.message || 'Check that the destination device is connected.'); }
  }

  document.querySelectorAll('#send-button,.modal-send').forEach(button => button.addEventListener('click', sendAcross, true));
  document.querySelectorAll('#send-drop,#drop-zone').forEach(zone => zone.addEventListener('click', event => { event.preventDefault(); chooseNativeFile().catch(() => {}); }));
  document.addEventListener('change', event => { if (event.target.matches('#send-file,#file-input,#modal-file')) { window.showDualinkToast?.('Use the desktop picker', 'Choose the file through DUALINK so its folder permission is explicit.'); } });
  document.addEventListener('click', event => { if (event.target.closest('.destination')) setSendEnabled(); });

  setTimeout(() => connectDesktop().catch(() => {}), 800);
})();
