(() => {
  const api = (url, options = {}) => fetch(url, {credentials:'same-origin', headers:{'Content-Type':'application/json', ...(options.headers||{})}, ...options});
  async function loadRealData(){
    try {
      const [mappingResponse, noteResponse, statusResponse, activityResponse] = await Promise.all([api('api/mappings.php'), api('api/notes.php'), api('api/status.php'), api('api/activity.php')]);
      if (!mappingResponse.ok || !noteResponse.ok) return;
      const mappingData = await mappingResponse.json(), noteData = await noteResponse.json();
      maps = (mappingData.mappings || []).map(item => ({name:item.linux_path.split('/').filter(Boolean).pop() || item.windows_path, linux:item.linux_path, windows:item.windows_path, direction:item.direction==='two_way'?'↔':item.direction==='linux_to_windows'?'→':'←', status:'Connected', icon:'▣'}));
      notes = (noteData.notes || []).map(item => ({id:item.id,title:item.title, body:item.body, date:new Date(item.updated_at).toLocaleDateString()}));
      renderMaps(); renderNotes();
      if(statusResponse.ok){const status=await statusResponse.json();const bytes=n=>n>=1073741824?`${(n/1073741824).toFixed(2)} GB`:n>=1048576?`${(n/1048576).toFixed(1)} MB`:n>=1024?`${(n/1024).toFixed(1)} KB`:`${n||0} B`;document.querySelector('#upload-stat').textContent=bytes(+status.status.uploaded_bytes||0);document.querySelector('#download-stat').textContent=bytes(+status.status.downloaded_bytes||0);document.querySelector('#queue-stat').textContent=status.status.queued_files||0;}
      if(activityResponse.ok){const activity=(await activityResponse.json()).activity||[];const recent=document.querySelector('#recent-list'),feed=document.querySelector('#activity-feed');const html=activity.length?activity.map(item=>`<div class="recent-item"><span class="file-glyph">↗</span><div><b>${item.file_name}</b><small>${item.status.replace('_',' ')} · ${item.source_path} → ${item.target_path}</small></div><time>${new Date(item.created_at).toLocaleDateString()}</time></div>`).join(''):'<p class="empty-real-state">No activity yet. Your completed transfers will appear here.</p>';recent.innerHTML=html;feed.innerHTML=activity.length?html.replaceAll('recent-item','activity-entry'):'<p class="empty-real-state">No activity yet. Send Across will add your first transfer here.</p>';}
    } catch { /* The authenticated API is unavailable; do not invent workspace data. */ }
  }
  const mapButton = document.querySelector('#add-map');
  if (mapButton) mapButton.onclick = async () => {
    const linuxPath=document.querySelector('#linux-path').value.trim(), windowsPath=document.querySelector('#windows-path').value.trim();
    if(!linuxPath || !windowsPath) return;
    const choice=document.querySelector('#map-direction').value;
    const direction=choice==='Two-way sync'?'two_way':choice.includes('Linux')?'linux_to_windows':'windows_to_linux';
    const response=await api('api/mappings.php',{method:'POST',body:JSON.stringify({linux_path:linuxPath,windows_path:windowsPath,direction})});
    if(!response.ok){window.showDualinkToast?.('Could not save folder link','Check your connection and sign in again.');return;}
    await loadRealData(); document.querySelector('#map-modal')?.close(); document.querySelector('#modal-backdrop')?.classList.remove('open'); window.showDualinkToast?.('Folder link saved','This link is now stored in your DUALINK account.');
  };
  document.querySelector('#save-note')?.addEventListener('click', async event => {
    event.stopImmediatePropagation();
    const active=document.querySelector('.note-item.active'); const index=active ? Number(active.dataset.note) : -1; const note=notes[index];
    const payload={title:document.querySelector('#note-title').value||'Untitled note',body:document.querySelector('#note-body').value};
    const response=await api('api/notes.php',{method:note?.id?'PUT':'POST',body:JSON.stringify(note?.id?{...payload,id:note.id}:payload)});
    if(!response.ok){window.showDualinkToast?.('Could not save note','Check your connection and sign in again.');return;}
    await loadRealData(); window.showDualinkToast?.('Note saved','It is stored in your DUALINK account.');
  },true);
  document.querySelector('#send-button')?.addEventListener('click', event => { event.stopImmediatePropagation(); window.showDualinkToast?.('Desktop companion required','Send Across becomes available after a connected desktop app is online.'); }, true);
  loadRealData();
})();
