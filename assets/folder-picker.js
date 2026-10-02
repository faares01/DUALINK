(() => {
  const mapModal = document.querySelector('#map-modal');
  const addButton = document.querySelector('#add-map');
  if (!mapModal || !addButton) return;
  const launch = document.createElement('button');
  launch.type = 'button'; launch.className = 'picker-launch'; launch.innerHTML = '<span>▣</span> Browse folders instead';
  addButton.before(launch);
  const dialog = document.createElement('dialog');
  dialog.className = 'modal folder-picker'; dialog.id = 'folder-picker-modal';
  dialog.innerHTML = `<button class="close-modal" aria-label="Close folder picker">×</button><div class="picker-top"><p class="eyebrow">FOLDER PICKER</p><h2>Choose a folder</h2><p>Open folders until you reach the exact place you want to link.</p><div class="picker-platforms"><button type="button" data-platform="linux" class="active">⌘ Linux</button><button type="button" data-platform="windows">⊞ Windows</button></div></div><div class="picker-body"><div class="picker-breadcrumb"><button type="button" class="picker-up">↑ Up</button><span id="picker-path"></span></div><div class="picker-list" id="picker-list"></div><div class="picker-footer"><small>DUALINK can only browse folders you approve in the desktop app.</small><button type="button" class="picker-select">Use this folder</button></div></div>`;
  document.body.append(dialog);
  const fallbackTree = {
    linux: {'/home/fares':['Desktop','Downloads','Documents','Pictures','Projects','Music','Videos'], '/home/fares/Desktop':['Work','Archive'], '/home/fares/Downloads':['Installers','DUALINK'], '/home/fares/Pictures':['Screenshots','Wallpapers'], '/home/fares/Projects':['client-site','dualink','experiments']},
    windows: {'C:\\Users\\Fares':['Desktop','Downloads','Documents','Pictures','Music','Videos'], 'C:\\Users\\Fares\\Desktop':['Work','Archive'], 'C:\\Users\\Fares\\Downloads':['Installers','DUALINK'], 'C:\\Users\\Fares\\Pictures':['Screenshots','Wallpapers'], 'D:\\Projects':['client-site','dualink','experiments']}
  };
  let platform = 'linux'; let currentPath = '/home/fares'; let selectingFor = 'linux'; let entries = [];
  const pathEl = dialog.querySelector('#picker-path'); const listEl = dialog.querySelector('#picker-list');
  const rootFor = p => p === 'linux' ? '/home/fares' : 'C:\\Users\\Fares';
  const join = (p,n) => p === '/' ? `/${n}` : `${p}${p.includes('\\') ? '\\' : '/'}${n}`;
  const parent = p => { const separator = p.includes('\\') ? '\\' : '/'; const parts=p.split(separator); return parts.length > (p.includes('\\') ? 2 : 3) ? parts.slice(0,-1).join(separator) : rootFor(platform); };
  async function loadFolders(){
    pathEl.textContent=currentPath; listEl.innerHTML='<div class="picker-empty">Loading folders…</div>';
    try { const bridge=window.__DUALINK_DESKTOP__; if(!bridge?.listFolders) throw new Error('No desktop bridge'); entries=await bridge.listFolders({platform,path:currentPath}); }
    catch { entries=(fallbackTree[platform][currentPath] || []).map(name=>({name,path:join(currentPath,name)})); }
    listEl.innerHTML=entries.length ? entries.map(item=>`<button type="button" class="picker-row" data-path="${item.path}"><span>▣</span>${item.name}<small>Open →</small></button>`).join('') : '<div class="picker-empty">No subfolders here.</div>';
    listEl.querySelectorAll('.picker-row').forEach(row=>row.onclick=()=>{currentPath=row.dataset.path;loadFolders()});
  }
  function openPicker(){selectingFor='linux'; platform='linux'; currentPath=document.querySelector('#linux-path').value || rootFor('linux'); dialog.showModal(); loadFolders()}
  launch.onclick=openPicker; dialog.querySelector('.close-modal').onclick=()=>dialog.close();
  dialog.querySelectorAll('[data-platform]').forEach(button=>button.onclick=()=>{platform=button.dataset.platform; selectingFor=platform; currentPath=document.querySelector(platform==='linux'?'#linux-path':'#windows-path').value || rootFor(platform); dialog.querySelectorAll('[data-platform]').forEach(x=>x.classList.toggle('active',x===button));loadFolders()});
  dialog.querySelector('.picker-up').onclick=()=>{currentPath=parent(currentPath);loadFolders()};
  dialog.querySelector('.picker-select').onclick=()=>{document.querySelector(selectingFor==='linux'?'#linux-path':'#windows-path').value=currentPath; dialog.close(); if(selectingFor==='linux'){platform='windows'; selectingFor='windows';currentPath=document.querySelector('#windows-path').value||rootFor('windows');dialog.showModal();dialog.querySelectorAll('[data-platform]').forEach(x=>x.classList.toggle('active',x.dataset.platform==='windows'));loadFolders()} };
})();
