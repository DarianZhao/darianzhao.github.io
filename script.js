'use strict';
(() => {
  const {materials, applications, priorities, videos, email} = window.TRF;
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = values => '<ul>' + values.map(value => '<li>' + esc(value) + '</li>').join('') + '</ul>';
  const detail = $('#detail-dialog');
  let activeBrief = '';
  let selectedContext = '';
  let currentTrigger;
  function openDialog(dialog, trigger) {
    currentTrigger = trigger || document.activeElement;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) {
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close();
    }});
    dialog.addEventListener('close', () => {
      dialog.classList.remove('photo-dialog');
      document.body.style.overflow = '';
      if (dialog.id === 'video-dialog') {
        $('#application-video').pause();
        $('#application-video').removeAttribute('src');
        $('#application-video').load();
      }
      currentTrigger?.focus();
    });
  });
  function getSelection() {
    const key = $('#application-select').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;
    return {key, app:applications[key], priority:priorities[priority]};
  }
  function renderFinder() {
    const {app, priority}=getSelection();
    $('#finder-result').innerHTML='<span class="result-label">YOUR DISCUSSION STARTING POINT</span><h3>'+esc(app.families)+'</h3><p>'+esc(priority.prompt)+'</p>'+list(app.questions);
  }
  $('#application-select').addEventListener('change', renderFinder);
  document.querySelectorAll('input[name="priority"]').forEach(input => input.addEventListener('change',renderFinder));
  renderFinder();
  function addToBrief(label, context) {
    const select=$('#inquiry-application');
    select.value=[...select.options].some(option=>option.value===label)?label:'Material selection / other';
    const field=$('#inquiry-requirements');
    // Preserve buyer-entered requirements when changing selection.
    if(selectedContext && field.value.includes(selectedContext)) field.value=field.value.replace(selectedContext,context);
    else field.value=[field.value.trim(),context].filter(Boolean).join('\n\n');
    selectedContext=context;
    $('#inquiry-status').textContent='Selection added. Complete your contact details and project requirements.';
    $('#inquiry-status').className='fine-print';
    $('#inquiry').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    field.focus({preventScroll:true});
  }
  $('#use-selection').addEventListener('click', () => {
    const {app,priority}=getSelection();
    addToBrief(app.label,'Application: '+app.label+'\nPriority: '+priority.label+'\nTo discuss: '+priority.prompt+'\nPlease review: '+app.questions.join('; ')+'.');
  });
  function showApplication(key,trigger){
    const app=applications[key];
    $('#detail-content').innerHTML='<div class="dialog-body"><p class="eyebrow">APPLICATION / '+esc(app.label)+'</p><h2 id="detail-title">'+esc(app.title)+'</h2><p>'+esc(app.description)+'</p><h3>What to share</h3>'+list(app.questions)+'<p class="detail-note">'+esc(app.note)+'</p><button type="button" class="button primary" id="detail-action">Build a project brief ↗</button></div>';
    $('#detail-action').addEventListener('click',()=>{
      detail.close();
      $('#application-select').value=key;renderFinder();
      addToBrief(app.label,'Application: '+app.label+'\nPlease review: '+app.questions.join('; ')+'.');
    });
    openDialog(detail,trigger);
  }
  document.querySelectorAll('[data-application]').forEach(button=>button.addEventListener('click',()=>showApplication(button.dataset.application,button)));
  const factoryPhotos = {
    campus:{src:'./assets/factory-campus-v3.webp',title:'The TERRIFIC campus',alt:'Aerial view of the TERRIFIC factory campus in Shandong'},
    workspace:{src:'./assets/research-workspace.webp',title:'Inside our development workspace',alt:'TERRIFIC research and development workspace'},
    team:{src:'./assets/research-team.webp',title:'The people behind the material',alt:'The TERRIFIC team at the research and development center'},
    office:{src:'./assets/factory-office-v3.webp',title:'A closer look at TERRIFIC',alt:'The TERRIFIC office building and company signage'}
  };
  document.querySelectorAll('[data-factory]').forEach(button=>button.addEventListener('click',()=>{
    const photo=factoryPhotos[button.dataset.factory];
    detail.classList.add('photo-dialog');
    $('#detail-content').innerHTML='<div class="photo-detail"><h2 id="detail-title">'+esc(photo.title)+'</h2><img src="'+photo.src+'" alt="'+esc(photo.alt)+'"><p>Shandong Terrific New Materials Co., Ltd. · Shandong, China</p></div>';
    openDialog(detail,button);
  }));
  $('#material-rows').innerHTML=materials.map(material=>'<div class="material-row" role="row"><div class="material-name" role="cell"><strong>'+esc(material.id)+'</strong><small>'+esc(material.name)+'</small></div><div class="material-summary" role="cell">'+esc(material.summary)+'</div><div class="material-traits" role="cell">'+esc(material.traits)+'</div><div role="cell"><button type="button" data-material="'+esc(material.id)+'" aria-label="Explore '+esc(material.id)+'">↗</button></div></div>').join('');
  document.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>{
    const material=materials.find(item=>item.id===button.dataset.material);
    $('#detail-content').innerHTML='<div class="dialog-body"><p class="eyebrow">MATERIAL FAMILY / '+esc(material.id)+'</p><h2 id="detail-title">'+esc(material.name)+'</h2><p>'+esc(material.description)+'</p><h3>Build your grade-selection brief</h3>'+list(material.questions)+'<p class="detail-note">Request a grade-specific TDS, sample availability and relevant test documentation. Performance and suitability must be confirmed in your application.</p><button type="button" id="detail-action" class="button primary">Inquire about '+esc(material.id)+' ↗</button></div>';
    $('#detail-action').addEventListener('click',()=>{detail.close();addToBrief('Material selection / other','Material of interest: '+material.id+'\nPlease help select a candidate grade and share available TDS and sample details.');});
    openDialog(detail,button);
  }));
  document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
    const video=videos[button.dataset.video];
    $('#video-title').textContent=video.title;
    const player=$('#application-video');player.src=video.src;player.poster=video.poster;
    $('#video-transcript').textContent=video.transcript;
    openDialog($('#video-dialog'),button);
    player.play().catch(()=>{ /* Native controls remain available if autoplay is denied. */ });
  }));
  $('#inquiry-form').addEventListener('submit', event=>{
    event.preventDefault();
    const form=event.currentTarget;
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const requirements=String(data.get('requirements')).trim();
    if(!String(data.get('name')).trim()||!String(data.get('company')).trim()||!requirements){
      $('#inquiry-status').textContent='Please enter your name, company and project requirements.';
      return;
    }
    const subject='Material inquiry | '+data.get('application')+' | '+String(data.get('company')).replace(/[\r\n]/g,' ');
    activeBrief='Hello TERRIFIC,\n\nI would like to discuss a material for our project.\n\nName: '+String(data.get('name')).trim()+'\nCompany: '+String(data.get('company')).trim()+'\nEmail: '+data.get('email')+'\nCountry / market: '+(data.get('country')||'To be confirmed')+'\nApplication: '+data.get('application')+'\n\nPROJECT REQUIREMENTS\n'+requirements+(data.has('documents')?'\n\nPlease share the candidate grade TDS, sample availability and applicable compliance documentation.':'')+'\n\nPlease confirm the next steps for a technical review and material trial.\n\nBest regards,\n'+String(data.get('name')).trim();
    $('#email-preview').value=activeBrief;
    $('#open-email').href='mailto:'+email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(activeBrief);
    $('#copy-status').textContent='Your inquiry has not been sent. Open your email app, attach drawings if needed, then send. You can also copy the brief into webmail.';
    openDialog($('#email-dialog'));
  });
  $('#copy-inquiry').addEventListener('click',async()=>{
    try { await navigator.clipboard.writeText(activeBrief);$('#copy-status').textContent='Brief copied. Paste it into your email to '+email+'.';}
    catch {$('#email-preview').focus();$('#email-preview').select();$('#copy-status').textContent='Select and copy the brief above, or download it as a text file.';}
  });
  $('#download-inquiry').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([activeBrief],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='TERRIFIC-project-inquiry.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('#privacy-button').addEventListener('click', event=>{
    $('#detail-content').innerHTML='<div class="dialog-body"><p class="eyebrow">PRIVACY</p><h2 id="detail-title">Your project stays in your hands.</h2><p>This website does not use advertising trackers or save your project form in browser storage. Form entries remain in this page until you leave or reload it.</p><h3>When you choose to send</h3><p>The email action passes your prepared text to your own email application. It is only sent after you send it there. TERRIFIC receives the details and attachments you choose to email and uses them to respond to your project inquiry.</p><h3>Website delivery</h3><p>The hosting provider may process connection information, including IP addresses, to deliver and protect the website. Product images and videos are served from this site. For questions about an inquiry or your information, contact sd.terrific@gmail.com.</p></div>';
    openDialog(detail,event.currentTarget);
  });
  const menu=$('.menu-toggle'),nav=$('#navigation');
  function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  $('#copyrightYear').textContent=new Date().getFullYear();
  // Social posts may link directly to an application without including personal data.
  const params=new URLSearchParams(location.search);
  const initial=params.get('application');
  if(Object.hasOwn(applications,initial)){ $('#application-select').value=initial;renderFinder();$('#inquiry-application').value=applications[initial].label; }
})();
