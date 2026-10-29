const tracks=[{name:'Night Drive',file:'track-01',art:'cover-small.webp'},{name:'Slow Motion',file:'track-02',art:'track-slow.webp'},{name:'Blue Hour',file:'track-03',art:'track-blue.webp'},{name:'Last Light',file:'track-04',art:'track-last.webp'}];
const audio=document.getElementById('audio-player');
const currentTrack=document.getElementById('current-track');
const playerArt=document.getElementById('player-art');
const toggle=document.getElementById('toggle-play');
const seek=document.getElementById('seek');
const volume=document.getElementById('volume');
const rows=[...document.querySelectorAll('#track-rows tr')];
let activeTrack=0,shuffle=false,repeat=false,favorite=false;
function icon(name){return `<svg><use href="#i-${name}"/></svg>`}
function update(){const playing=!audio.paused;toggle.innerHTML=icon(playing?'pause':'play');toggle.setAttribute('aria-label',playing?'Пауза':'Відтворити');rows.forEach((row,i)=>{row.classList.toggle('playing',i===activeTrack);row.classList.toggle('is-playing',i===activeTrack&&playing);const btn=row.querySelector('.row-play');btn.innerHTML=icon(i===activeTrack&&playing?'pause':'play');btn.setAttribute('aria-label',(i===activeTrack&&playing?'Пауза ':'Відтворити ')+tracks[i].name)})}
function playTrack(index){activeTrack=(index+tracks.length)%tracks.length;const track=tracks[activeTrack];currentTrack.textContent=track.name;playerArt.src='assets/'+track.art;audio.innerHTML=`<source src="assets/${track.file}.mp3" type="audio/mpeg"><source src="assets/${track.file}.wav" type="audio/wav">`;audio.load();audio.play().catch(()=>{});update()}
function togglePlayback(){if(audio.paused)audio.play().catch(()=>{});else audio.pause()}
function nextTrack(){if(shuffle){let n=Math.floor(Math.random()*(tracks.length-1));playTrack(n>=activeTrack?n+1:n)}else playTrack(activeTrack+1)}
document.querySelectorAll('.row-play').forEach(b=>b.addEventListener('click',()=>{const index=Number(b.dataset.track);if(index===activeTrack)togglePlayback();else playTrack(index)}));
document.getElementById('play-album').addEventListener('click',()=>playTrack(0));
document.getElementById('previous').addEventListener('click',()=>{if(audio.currentTime>3)audio.currentTime=0;else playTrack(activeTrack-1)});
document.getElementById('next').addEventListener('click',nextTrack);
toggle.addEventListener('click',togglePlayback);
audio.addEventListener('play',update);audio.addEventListener('pause',update);
audio.addEventListener('ended',()=>{if(repeat)playTrack(activeTrack);else if(activeTrack<tracks.length-1||shuffle)nextTrack();else update()});
function format(t){if(!Number.isFinite(t))return '0:00';return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')}
audio.addEventListener('loadedmetadata',()=>{seek.max=audio.duration||12;document.getElementById('total').textContent=format(audio.duration||12)});
audio.addEventListener('timeupdate',()=>{seek.value=audio.currentTime;document.getElementById('elapsed').textContent=format(audio.currentTime);seek.style.setProperty('--fill',((audio.currentTime/(audio.duration||12))*100)+'%')});
seek.addEventListener('input',()=>{audio.currentTime=Number(seek.value)});
volume.addEventListener('input',()=>{audio.volume=Number(volume.value);audio.muted=false;volume.style.setProperty('--fill',volume.value*100+'%')});
document.getElementById('mute').addEventListener('click',()=>{audio.muted=!audio.muted;document.getElementById('mute').classList.toggle('selected',audio.muted)});
document.getElementById('shuffle').addEventListener('click',e=>{shuffle=!shuffle;e.currentTarget.classList.toggle('selected',shuffle);e.currentTarget.setAttribute('aria-pressed',String(shuffle))});
document.getElementById('repeat').addEventListener('click',e=>{repeat=!repeat;e.currentTarget.classList.toggle('selected',repeat);e.currentTarget.setAttribute('aria-pressed',String(repeat))});
function toggleFavorite(){favorite=!favorite;for(const id of ['favorite-album','player-favorite']){const b=document.getElementById(id);b.classList.toggle('selected',favorite);b.setAttribute('aria-pressed',String(favorite))}}
document.getElementById('favorite-album').addEventListener('click',toggleFavorite);
document.getElementById('player-favorite').addEventListener('click',toggleFavorite);
document.getElementById('queue').addEventListener('click',()=>document.getElementById('tracklist').scrollIntoView({behavior:'smooth'}));
document.getElementById('more-album').addEventListener('click',()=>document.querySelector('.details').scrollIntoView({behavior:'smooth'}));
function filterTracks(){const q=document.getElementById('search').value.toLowerCase().trim();let count=0;rows.forEach(r=>{const show=r.dataset.name.includes(q)||'audio studies'.includes(q);r.hidden=!show;if(show)count++});document.getElementById('no-results').hidden=count!==0}
document.getElementById('search').addEventListener('input',filterTracks);
document.querySelectorAll('.nav-item').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
audio.volume=.7;update();
