import signaturePad from"https://cdn.jsdelivr.net/npm/signature_pad@5.0.4/+esm";const playPanel=document.getElementById("playPanel"),infoPanel=document.getElementById("infoPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=120,alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";let firstRun=!0;const canvasCache=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});let answer="Tegaki ABC",hinted=!1,correctCount=0,totalCount=0,catCounter=0,englishVoices=[],audioContext;const audioBufferCache={};loadConfig(),loadVoices();function loadConfig(){if(localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark"),localStorage.getItem("furigana")==1){const e=document.getElementById("addFurigana");addFurigana(e),e.setAttribute("data-done",!0)}}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}function addFurigana(){const e=document.getElementById("addFurigana");e.getAttribute("data-done")?(localStorage.setItem("furigana",0),location.reload()):(import("https://marmooo.github.io/yomico/yomico.min.js").then(e=>{e.yomico("index.yomi")}),localStorage.setItem("furigana",1),e.setAttribute("data-done",!0))}function createAudioContext(){return globalThis.AudioContext?new globalThis.AudioContext:(console.error("Web Audio API is not supported in this browser"),null)}function unlockAudio(){audioContext?audioContext.resume():(audioContext=createAudioContext(),loadAudio("end","mp3/end.mp3"),loadAudio("error","mp3/cat.mp3"),loadAudio("correct","mp3/correct3.mp3")),document.removeEventListener("pointerdown",unlockAudio),document.removeEventListener("keydown",unlockAudio)}async function loadAudio(e,t){if(!audioContext)return;if(audioBufferCache[e])return audioBufferCache[e];try{const s=await fetch(t),o=await s.arrayBuffer(),n=await audioContext.decodeAudioData(o);return audioBufferCache[e]=n,n}catch(t){throw console.error(`Loading audio ${e} error:`,t),t}}function playAudio(e,t){if(!audioContext)return;const o=audioBufferCache[e];if(!o){console.error(`Audio ${e} is not found in cache`);return}const n=audioContext.createBufferSource();n.buffer=o;const s=audioContext.createGain();t&&(s.gain.value=t),s.connect(audioContext.destination),n.connect(s),n.start()}function loadVoices(){const e=new Promise(e=>{let t=speechSynthesis.getVoices();if(t.length!==0)e(t);else{let n=!1;speechSynthesis.addEventListener("voiceschanged",()=>{n=!0,t=speechSynthesis.getVoices(),e(t)}),setTimeout(()=>{n||document.getElementById("noTTS").classList.remove("d-none")},1e3)}}),t=["com.apple.speech.synthesis.voice.Bahh","com.apple.speech.synthesis.voice.Albert","com.apple.speech.synthesis.voice.Hysterical","com.apple.speech.synthesis.voice.Organ","com.apple.speech.synthesis.voice.Cellos","com.apple.speech.synthesis.voice.Zarvox","com.apple.speech.synthesis.voice.Bells","com.apple.speech.synthesis.voice.Trinoids","com.apple.speech.synthesis.voice.Boing","com.apple.speech.synthesis.voice.Whisper","com.apple.speech.synthesis.voice.Deranged","com.apple.speech.synthesis.voice.GoodNews","com.apple.speech.synthesis.voice.BadNews","com.apple.speech.synthesis.voice.Bubbles"];e.then(e=>{englishVoices=e.filter(e=>e.lang=="en-US").filter(e=>!t.includes(e.voiceURI))})}function speak(e){speechSynthesis.cancel();const t=new globalThis.SpeechSynthesisUtterance(e);return t.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],t.lang="en-US",speechSynthesis.speak(t),t}function getRandomInt(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}function hideAnswer(){document.getElementById("reply").textContent=""}function showAnswer(){if(hinted=!0,speak(answer.toLowerCase()),!firstRun){const t=document.getElementById("tehon"),e=t.getContext("2d");e.font="bold 280px 'Source Code Pro'",e.fillStyle="lightgray";const n=e.measureText(answer),s=(t.width-n.width)/2,o=(t.height+n.actualBoundingBoxAscent)/2;e.fillText(answer,s,o)}}function respeak(){speak(answer.toLowerCase())}function nextProblem(){hinted=!1,hideAnswer(),answer=alphabet[getRandomInt(0,alphabet.length)],document.getElementById("grade").selectedIndex==1&&(answer=answer.toLowerCase()),pad.clear();const e=document.getElementById("tehon");e.getContext("2d").clearRect(0,0,e.width,e.height),speak(answer.toLowerCase())}function initSignaturePad(e){const t=new signaturePad(e,{minWidth:8,maxWidth:8,penColor:"black",backgroundColor:"rgba(255, 255, 255, 0)",throttle:0,minDistance:0});return t.addEventListener("endStroke",()=>{predict(t.canvas)}),t}function getImageData(e){const n=28,s=28;canvasCache.fillStyle="white",canvasCache.fillRect(0,0,n,s),canvasCache.drawImage(e,0,0,n,s);const o=canvasCache.getImageData(0,0,n,s),t=o.data;for(let e=0;e<t.length;e+=4)t[e]=255-t[e],t[e+1]=255-t[e+1],t[e+2]=255-t[e+2];return o}function predict(e){const t=getImageData(e);worker.postMessage({imageData:t})}function catNyan(){playAudio("error")}function loadImage(e){return new Promise((t,n)=>{const s=new globalThis.Image;s.onload=()=>t(s),s.onerror=e=>n(e),s.src=e})}function loadCatImage(e){const t=128;return new Promise(n=>{loadImage(e).then(e=>{const s=document.createElement("canvas");s.setAttribute("role","button"),s.width=t,s.height=t,s.className="cat",s.style.position="absolute",s.getContext("2d").drawImage(e,0,0),n(s)}).catch(e=>{console.log(e)})})}loadCatImage("kohacu.webp").then(e=>{catsWalk(e)});function catWalk(e,t){const s=document.getElementById("catsWalk"),i=s.offsetWidth,a=s.offsetHeight,n=t.cloneNode(!0);n.getContext("2d").drawImage(t,0,0);const o=128;n.style.top=getRandomInt(0,a-o)+"px",n.style.left=i-o+"px",n.addEventListener("click",()=>{speak(alphabet[catCounter].toLowerCase()),catCounter>=alphabet.length-1?catCounter=0:catCounter+=1,n.remove()},{once:!0}),s.appendChild(n);const r=setInterval(()=>{const e=parseInt(n.style.left)-1;e>-o?n.style.left=e+"px":(clearInterval(r),n.remove())},e)}function catsWalk(e){setInterval(()=>{Math.random()>.995&&catWalk(getRandomInt(5,20),e)},10)}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const e=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const t=parseInt(e.textContent);t>0?e.textContent=t-1:(clearInterval(gameTimer),playAudio("end"),scoring())},1e3)}function countdown(){firstRun=!1,countPanel.classList.remove("d-none"),infoPanel.classList.add("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const e=document.getElementById("counter");e.textContent=3;const t=setInterval(()=>{const n=["skyblue","greenyellow","violet","tomato"];if(parseInt(e.textContent)>1){const t=parseInt(e.textContent)-1;e.style.backgroundColor=n[t],e.textContent=t}else clearInterval(t),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),correctCount=totalCount=0,nextProblem(),startGameTimer()},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=`${correctCount} / ${totalCount}`}const pad=initSignaturePad(document.getElementById("tegaki"));document.getElementById("eraser").onclick=()=>{pad.clear(),document.getElementById("reply").textContent=""};const worker=new Worker("worker.js");worker.addEventListener("message",e=>{const n=e.data;if(pad.toData().length==0)return;const t=n.result[0];document.getElementById("reply").textContent=t,t==answer&&(hinted||(correctCount+=1),totalCount+=1,hinted=!1,playAudio("correct",.3),setTimeout(nextProblem,300))}),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("addFurigana").onclick=addFurigana,document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("respeak").onclick=respeak,document.getElementById("kohacu").onclick=catNyan,document.addEventListener("pointerdown",()=>{predict(pad.canvas)},{once:!0}),document.addEventListener("pointerdown",unlockAudio,{once:!0}),document.addEventListener("keydown",unlockAudio,{once:!0})