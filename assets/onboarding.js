(() => {
  const request = (url, options={}) => fetch(url,{credentials:'same-origin',headers:{'Content-Type':'application/json'},...options});
  let selected = 'linux';
  function render(step=1){
    const screen=document.createElement('section');screen.className='onboarding';screen.id='onboarding';
    if(step===1)screen.innerHTML=`<div class="onboarding-card"><div class="onboarding-mark">DUALINK</div><div class="welcome-orbit">✦</div><p class="onboarding-kicker">WELCOME TO YOUR OTHER SIDE</p><h2>Good to have<br>you here.</h2><p>We will connect the places you use, without asking DUALINK to see your whole computer.</p><button class="onboarding-action" id="onboarding-next">Let’s begin →</button><div class="onboarding-progress"><i class="active"></i><i></i><i></i></div></div>`;
    else if(step===2)screen.innerHTML=`<div class="onboarding-card"><div class="onboarding-mark">DUALINK</div><p class="onboarding-kicker">YOUR FIRST SIDE</p><h2>Where are you<br>starting today?</h2><p>You can add the other system whenever you are ready.</p><div class="device-choices"><button class="device-choice active" data-device="linux"><span>⌘</span><b>Linux</b><small>This computer runs Linux</small></button><button class="device-choice" data-device="windows"><span>⊞</span><b>Windows</b><small>This computer runs Windows</small></button></div><button class="onboarding-action" id="onboarding-next">Continue →</button><div class="onboarding-progress"><i></i><i class="active"></i><i></i></div></div>`;
    else screen.innerHTML=`<div class="onboarding-card"><div class="onboarding-mark">DUALINK</div><div class="welcome-orbit">✓</div><p class="onboarding-kicker">YOU ARE READY</p><h2>Make your first<br>folder link.</h2><p>Start small—Downloads, Projects, or Screenshots. You always decide what DUALINK can access.</p><button class="onboarding-action" id="onboarding-finish">Open folder links →</button><div class="onboarding-progress"><i></i><i></i><i class="active"></i></div></div>`;
    document.body.append(screen);
    screen.querySelectorAll('.device-choice').forEach(button=>button.onclick=()=>{selected=button.dataset.device;screen.querySelectorAll('.device-choice').forEach(x=>x.classList.toggle('active',x===button))});
    screen.querySelector('#onboarding-next')?.addEventListener('click',()=>{screen.remove();render(step+1)});
    screen.querySelector('#onboarding-finish')?.addEventListener('click',async()=>{await request('api/onboarding.php',{method:'POST',body:JSON.stringify({first_device:selected,sync_intent:'folder_links'})});screen.remove();document.querySelector('[data-open="map-modal"]')?.click()});
  }
  async function start(){try{const response=await request('api/onboarding.php');if(response.ok && !(await response.json()).complete)render()}catch{}}
  setTimeout(start,300);
})();
