const playPanel=document.getElementById("playPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=120,alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";let firstRun=!0;const canvasCache=document.createElement("canvas").getContext("2d");let answer="Tegaki ABC",correctCount=0,catCounter=0,englishVoices=[],endAudio,errorAudio,correctAudio;loadVoices(),loadAudios();const AudioContext=window.AudioContext||window.webkitAudioContext,audioContext=new AudioContext;loadConfig();function loadConfig(){if(localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark"),localStorage.getItem("furigana")==1){const a=document.getElementById("addFurigana");addFurigana(a),a.setAttribute("data-done",!0)}}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}function addFurigana(){const a=document.getElementById("addFurigana");a.getAttribute("data-done")?(localStorage.setItem("furigana",0),location.reload()):(import("https://marmooo.github.io/yomico/yomico.min.js").then(a=>{a.yomico("index.yomi")}),localStorage.setItem("furigana",1),a.setAttribute("data-done",!0))}function playAudio(c,b){const a=audioContext.createBufferSource();if(a.buffer=c,b){const c=audioContext.createGain();c.gain.value=b,c.connect(audioContext.destination),a.connect(c),a.start()}else a.connect(audioContext.destination),a.start()}function unlockAudio(){audioContext.resume()}function loadAudio(a){return fetch(a).then(a=>a.arrayBuffer()).then(a=>new Promise((b,c)=>{audioContext.decodeAudioData(a,a=>{b(a)},a=>{c(a)})}))}function loadAudios(){promises=[loadAudio("mp3/end.mp3"),loadAudio("mp3/cat.mp3"),loadAudio("mp3/incorrect1.mp3"),loadAudio("mp3/correct3.mp3")],Promise.all(promises).then(a=>{endAudio=a[0],errorAudio=a[1],incorrectAudio=a[2],correctAudio=a[3]})}function loadVoices(){const a=new Promise(b=>{let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",()=>{c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});a.then(a=>{englishVoices=a.filter(a=>a.lang=="en-US")})}function speak(b){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(b);return a.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],a.lang="en-US",speechSynthesis.speak(a),a}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a)+a)}function hideAnswer(){document.getElementById("reply").textContent=""}function showAnswer(){if(speak(answer.toLowerCase()),!firstRun){const b=document.getElementById("tehon"),a=b.getContext("2d");a.font="bold 280px 'Source Code Pro'",a.fillStyle="lightgray";const c=a.measureText(answer),d=(b.width-c.width)/2,e=(b.height+c.actualBoundingBoxAscent)/2;a.fillText(answer,d,e)}}function respeak(){speak(answer.toLowerCase())}function nextProblem(){hideAnswer(),answer=alphabet[getRandomInt(0,alphabet.length)],document.getElementById("grade").selectedIndex==1&&(answer=answer.toLowerCase()),pad.clear();const a=document.getElementById("tehon");a.getContext("2d").clearRect(0,0,a.width,a.height),speak(answer.toLowerCase())}function initSignaturePad(b){const a=new SignaturePad(b,{minWidth:8,maxWidth:8,penColor:"black",backgroundColor:"rgba(255, 255, 255, 0)",throttle:0,minDistance:0});return a.addEventListener("endStroke",()=>{predict(a.canvas)}),a}function getImageData(d){const b=inputHeight=28;canvasCache.fillStyle="white",canvasCache.fillRect(0,0,b,inputHeight),canvasCache.drawImage(d,0,0,b,inputHeight);const c=canvasCache.getImageData(0,0,b,inputHeight),a=c.data;for(let b=0;b<a.length;b+=4)a[b]=255-a[b],a[b+1]=255-a[b+1],a[b+2]=255-a[b+2];return c}function predict(a){const b=getImageData(a);worker.postMessage({imageData:b})}function catNyan(){playAudio(errorAudio)}function loadImage(a){return new Promise((c,d)=>{const b=new Image;b.onload=()=>c(b),b.onerror=a=>d(a),b.src=a})}function loadCatImage(b){const a=128;return new Promise(c=>{loadImage(b).then(d=>{const b=document.createElement("canvas");b.width=a,b.height=a,b.className="cat",b.style.position="absolute",b.getContext("2d").drawImage(d,0,0),c(b)}).catch(a=>{console.log(a)})})}loadCatImage("kohacu.webp").then(a=>{catsWalk(a)});function catWalk(g,d){const c=document.getElementById("catsWalk"),e=c.offsetWidth,f=c.offsetHeight,a=d.cloneNode(!0);a.getContext("2d").drawImage(d,0,0);const b=128;a.style.top=getRandomInt(0,f-b)+"px",a.style.left=e-b+"px",a.addEventListener("click",()=>{speak(alphabet[catCounter].toLowerCase()),catCounter>=alphabet.length-1?catCounter=0:catCounter+=1,a.remove()},{once:!0}),c.appendChild(a);const h=setInterval(()=>{const c=parseInt(a.style.left)-1;c>-b?a.style.left=c+"px":(clearInterval(h),a.remove())},g)}function catsWalk(a){setInterval(()=>{Math.random()>.995&&catWalk(getRandomInt(5,20),a)},10)}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const a=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(gameTimer),playAudio(endAudio),scoring())},1e3)}let countdownTimer;function countdown(){firstRun=!1,clearTimeout(countdownTimer),countPanel.classList.remove("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const a=document.getElementById("counter");a.textContent=3,countdownTimer=setInterval(()=>{const b=["skyblue","greenyellow","violet","tomato"];if(parseInt(a.textContent)>1){const c=parseInt(a.textContent)-1;a.style.backgroundColor=b[c],a.textContent=c}else firstRun=!1,clearTimeout(countdownTimer),countPanel.classList.add("d-none"),playPanel.classList.remove("d-none"),document.getElementById("score").textContent=0,correctCount=0,nextProblem(),startGameTimer()},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=correctCount}const pad=initSignaturePad(document.getElementById("tegaki"));document.getElementById("eraser").onclick=()=>{pad.clear()};const worker=new Worker("worker.js");worker.addEventListener("message",b=>{const a=b.data.result[0];document.getElementById("reply").textContent=a,a==answer&&(correctCount+=1,playAudio(correctAudio),nextProblem())}),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("addFurigana").onclick=addFurigana,document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("respeak").onclick=respeak,document.getElementById("kohacu").onclick=catNyan,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0}),document.ondblclick=a=>{a.preventDefault()},document.body.style.webkitUserSelect="none"