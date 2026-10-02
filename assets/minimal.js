(() => {
  const button = document.querySelector('#theme-toggle');
  const preference = localStorage.getItem('dualink-time-mode');
  const shouldBeEvening = preference ? preference === 'evening' : new Date().getHours() >= 18 || new Date().getHours() < 6;
  function setMode(evening) {
    document.body.classList.toggle('evening', evening);
    button.textContent = evening ? '☀' : '☾';
    button.title = evening ? 'Switch to morning' : 'Switch to evening';
    localStorage.setItem('dualink-time-mode', evening ? 'evening' : 'morning');
  }
  setMode(shouldBeEvening);
  button.onclick = () => setMode(!document.body.classList.contains('evening'));
})();
