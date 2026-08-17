
const fmtCLP = new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0});
const meses = ['mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const etiquetasMes = {mar:'Mar',abr:'Abr',may:'May',jun:'Jun',jul:'Jul',ago:'Ago',sep:'Sep',oct:'Oct',nov:'Nov',dic:'Dic'};
const totalEsperadoPersona = 50000 + meses.length * 5000;

function fechaBonita(s){
  return new Date(s+'T12:00:00').toLocaleDateString('es-CL',{day:'2-digit',month:'short',year:'numeric'}).replace('.','');
}
function estadoTexto(s){return ({completado:'Listo',en_progreso:'En curso',pendiente:'Pendiente'})[s] || s}

async function cargar(){
  const [hitos, noticias, asistentes] = await Promise.all([
    fetch('hitos.json').then(r=>r.json()),
    fetch('noticias.json').then(r=>r.json()),
    fetch('asistentes.json').then(r=>r.json())
  ]);

  renderTimeline(hitos);
  renderPagos(asistentes);
  renderNoticias(noticias);
  const dias = Math.ceil((new Date('2026-12-11T12:00:00') - new Date())/86400000);
  document.querySelector('#countdown').textContent = dias > 0 ? `${dias} días` : '¡Llegó el día!';
}

function renderTimeline(items){
  const box=document.querySelector('#timeline');
  items.sort((a,b)=>new Date(a.fecha)-new Date(b.fecha));
  box.innerHTML=items.map(x=>`
    <article class="timeline-item ${x.estado==='completado'?'completed':x.estado==='en_progreso'?'progress':''}">
      <div class="t-date">${fechaBonita(x.fecha)}</div>
      <div class="t-track"><span class="t-dot"></span></div>
      <div class="t-card glass">
        <div>
          <h3>${x.hito}</h3>
          <p>${x.descripcion}</p>
          <p class="pending">🎯 <strong>Para completar:</strong> ${x.pendiente}</p>
        </div>
        <span class="badge">${estadoTexto(x.estado)}</span>
      </div>
    </article>`).join('');
}

function renderPagos(data){
  let recaudado=0;
  const tbody=document.querySelector('#payments-body');
  tbody.innerHTML=data.map(p=>{
    const total = Number(p['2025']||0)+meses.reduce((a,m)=>a+Number(p[m]||0),0);
    recaudado += total;
    const pct = Math.min(100,Math.round(total/totalEsperadoPersona*100));
    const marks = [`<td><span class="pay ${p['2025']>=50000?'ok':'no'}">${p['2025']>=50000?'✓':'—'}</span></td>`]
      .concat(meses.map(m=>`<td><span class="pay ${p[m]>=5000?'ok':'no'}">${p[m]>=5000?'✓':'—'}</span></td>`)).join('');
    return `<tr><td><strong>${p.nombre}</strong></td>${marks}<td>${fmtCLP.format(total)}</td><td><div class="progressbar"><i style="width:${pct}%"></i></div><small>${pct}%</small></td></tr>`;
  }).join('');
  const esperado=data.length*totalEsperadoPersona;
  document.querySelector('#m-asistentes').textContent=data.length;
  document.querySelector('#m-recaudado').textContent=fmtCLP.format(recaudado);
  document.querySelector('#m-meta').textContent=fmtCLP.format(esperado);
  document.querySelector('#m-avance').textContent=`${Math.round(recaudado/esperado*100)}%`;
}

function renderNoticias(data){
  const box=document.querySelector('#news');
  data.sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
  box.innerHTML=data.map((n,i)=>`
    <article class="news-card glass">
      <div class="news-meta"><span>${n.categoria}</span><time>${fechaBonita(n.fecha)}</time></div>
      <h3>${i===0?'🌞 ':''}${n.titulo}</h3>
      <p>${n.contenido}</p>
    </article>`).join('');
}
cargar().catch(err=>{
  console.error(err);
  document.querySelector('main').insertAdjacentHTML('afterbegin','<div class="glass" style="padding:16px;border-radius:18px;margin-top:20px">⚠️ Para cargar los JSON abre este proyecto mediante un servidor local (por ejemplo VS Code Live Server), no directamente como archivo.</div>');
});
