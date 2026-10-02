(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const files = [
    ['folder','Design assets','Folder','Today, 9:42 AM'], ['zip','project.zip','84.2 MB','Today, 9:18 AM'],
    ['doc','plan.docx','1.4 MB','Yesterday'], ['pdf','invoice-sep.pdf','212 KB','Sep 29'],
    ['img','screenshot-24.png','3.8 MB','Sep 28'], ['js','sync-agent.js','9.2 KB','Sep 26']
  ];
  const table=$('#file-table'), search=$('#file-search'), path=$('#path-input'), count=$('#result-count'), empty=$('#no-results');
  function drawFiles(filter='') {
    const visible=files.filter(f=>f[1].toLowerCase().includes(filter.toLowerCase()));
    table.innerHTML=visible.map(f=>`<div class="file-row"><span class="file-glyph">${f[0]}</span><b>${f[1]}</b><small>${f[2]}</small><small>${f[3]}</small><button class="bring" data-file="${f[1]}">Bring to Linux →</button></div>`).join('');
    empty.style.display=visible.length?'none':'block'; count.textContent=`${visible.length} item${visible.length===1?'':'s'}`;
    table.querySelectorAll('.bring').forEach(b=>b.onclick=()=>window.showDualinkToast?.('Transfer started',`${b.dataset.file} is coming to Linux Downloads.`));
  }
  function navigate(){const p=path.value.trim(); if(!p){path.focus();return} $('#folder-title').textContent=p.split('\\').filter(Boolean).pop()||p; drawFiles(); window.showDualinkToast?.('Folder opened',`Browsing ${p}`)}
  search.addEventListener('input',()=>drawFiles(search.value));
  $('#go-path').onclick=navigate; path.addEventListener('keydown',e=>{if(e.key==='Enter')navigate()});
  $('#refresh-files').onclick=()=>{drawFiles(search.value);window.showDualinkToast?.('Folder refreshed','The current Windows folder is up to date.')};
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search.focus()}});
  document.querySelectorAll('.folder-choice').forEach(b=>b.addEventListener('click',()=>{path.value=b.dataset.path||path.value; drawFiles();}));
  window.showDualinkToast=(title, copy)=>{const toast=$('#toast');$('#toast-title').textContent=title;$('#toast-copy').textContent=copy;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3800)};
  async function checkServer(){
    const state=$('#server-state'), detail=$('#server-detail'), latency=$('#server-latency'); const start=performance.now();
    try { const res=await fetch('api/health.php',{cache:'no-store'}); if(!res.ok) throw new Error(); const d=await res.json(); state.textContent='Server online'; detail.textContent=`API responding · ${d.database?'database connected':'database check unavailable'}`; latency.textContent=`${Math.max(1,Math.round(performance.now()-start))} ms`; }
    catch { state.textContent='Demo status'; detail.textContent='Deploy the PHP API to check live server health'; latency.textContent='—'; }
  }
  $('#status-refresh').onclick=checkServer; checkServer(); drawFiles();
})();
