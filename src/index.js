let endAudio, errorAudio, correctAudio;
loadAudios();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let firstRun = true;
const canvasCache = document.createElement("canvas").getContext("2d");
let answer = "Tegaki ABC";
let correctCount = 0;
let catCounter = 0;
let englishVoices = [];
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  promises = [
    loadAudio("mp3/end.mp3"),
    loadAudio("mp3/cat.mp3"),
    loadAudio("mp3/incorrect1.mp3"),
    loadAudio("mp3/correct3.mp3"),
  ];
  Promise.all(promises).then((audioBuffers) => {
    endAudio = audioBuffers[0];
    errorAudio = audioBuffers[1];
    incorrectAudio = audioBuffers[2];
    correctAudio = audioBuffers[3];
  });
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise(function (resolve) {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", function () {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 1000);
    }
  });
  allVoicesObtained.then((voices) => {
    englishVoices = voices.filter((voice) => voice.lang == "en-US");
  });
}
loadVoices();

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
  msg.lang = "en-US";
  speechSynthesis.speak(msg);
  return msg;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function hideAnswer() {
  document.getElementById("reply").textContent = "";
}

function showAnswer() {
  speak(answer.toLowerCase());
  if (!firstRun) {
    const canvas = document.getElementById("tehon");
    const ctx = canvas.getContext("2d");
    ctx.font = "bold 280px serif";
    ctx.fillStyle = "lightgray";
    const m = ctx.measureText(answer);
    const x = (canvas.width - m.width) / 2;
    const fy = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    const y = canvas.height - (canvas.height - fy) / 2;
    ctx.fillText(answer, x, y);
  }
}

function respeak() {
  speak(answer.toLowerCase());
}

function nextProblem() {
  hideAnswer();
  answer = alphabet[getRandomInt(0, alphabet.length)];
  if (document.getElementById("grade").selectedIndex == 1) {
    answer = answer.toLowerCase();
  }
  // document.getElementById('answer').textContent = answer;
  pad.clear();
  const tehon = document.getElementById("tehon");
  tehon.getContext("2d").clearRect(0, 0, tehon.width, tehon.height);
  speak(answer.toLowerCase());
}

function initSignaturePad(canvas) {
  const pad = new SignaturePad(canvas, {
    minWidth: 8,
    maxWidth: 8,
    penColor: "black",
    backgroundColor: "rgba(255, 255, 255, 0)",
    throttle: 0,
    minDistance: 0,
  });
  pad.addEventListener("endStroke", () => {
    predict(pad.canvas);
  });
  return pad;
}

function getImageData(drawElement) {
  const inputWidth = inputHeight = 28;
  // transparent to white
  canvasCache.fillStyle = "white";
  canvasCache.fillRect(0, 0, inputWidth, inputHeight);
  // resize
  canvasCache.drawImage(drawElement, 0, 0, inputWidth, inputHeight);
  // invert color
  const imageData = canvasCache.getImageData(0, 0, inputWidth, inputHeight);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return imageData;
}

function predict(canvas) {
  const imageData = getImageData(canvas);
  worker.postMessage({ imageData: imageData });
}

function catNyan() {
  playAudio(errorAudio);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function loadCatImage(url) {
  const imgSize = 128;
  return new Promise((resolve) => {
    loadImage(url).then((originalImg) => {
      const canvas = document.createElement("canvas");
      canvas.width = imgSize;
      canvas.height = imgSize;
      canvas.style.position = "absolute";
      // drawImage() faster than putImageData()
      canvas.getContext("2d").drawImage(originalImg, 0, 0);
      resolve(canvas);
    }).catch((e) => {
      console.log(e);
    });
  });
}
loadCatImage("kohacu.webp").then((catCanvas) => {
  catsWalk(catCanvas);
});

function catWalk(freq, catCanvas) {
  const area = document.getElementById("catsWalk");
  const width = area.offsetWidth;
  const height = area.offsetHeight;
  const canvas = catCanvas.cloneNode(true);
  canvas.getContext("2d").drawImage(catCanvas, 0, 0);
  const size = 128;
  canvas.style.top = getRandomInt(0, height - size) + "px";
  canvas.style.left = width - size + "px";
  canvas.addEventListener("click", function () {
    speak(alphabet[catCounter].toLowerCase());
    if (catCounter >= alphabet.length - 1) {
      catCounter = 0;
    } else {
      catCounter += 1;
    }
    this.remove();
  }, { once: true });
  area.appendChild(canvas);
  const timer = setInterval(function () {
    const x = parseInt(canvas.style.left) - 1;
    if (x > -size) {
      canvas.style.left = x + "px";
    } else {
      clearInterval(timer);
      canvas.remove();
    }
  }, freq);
}

function catsWalk(catCanvas) {
  setInterval(function () {
    if (Math.random() > 0.995) {
      catWalk(getRandomInt(5, 20), catCanvas);
    }
  }, 10);
}

let gameTimer;
function startGameTimer() {
  clearInterval(gameTimer);
  const timeNode = document.getElementById("time");
  timeNode.textContent = "120秒 / 120秒";
  gameTimer = setInterval(function () {
    const arr = timeNode.textContent.split("秒 /");
    const t = parseInt(arr[0]);
    if (t > 0) {
      timeNode.textContent = (t - 1) + "秒 /" + arr[1];
    } else {
      clearInterval(gameTimer);
      playAudio(endAudio);
      scoring();
    }
  }, 1000);
}

let countdownTimer;
function countdown() {
  firstRun = false;
  clearTimeout(countdownTimer);
  gameStart.classList.remove("d-none");
  playPanel.classList.add("d-none");
  scorePanel.classList.add("d-none");
  const counter = document.getElementById("counter");
  counter.textContent = 3;
  countdownTimer = setInterval(function () {
    const colors = ["skyblue", "greenyellow", "violet", "tomato"];
    if (parseInt(counter.textContent) > 1) {
      const t = parseInt(counter.textContent) - 1;
      counter.style.backgroundColor = colors[t];
      counter.textContent = t;
    } else {
      firstRun = false;
      clearTimeout(countdownTimer);
      gameStart.classList.add("d-none");
      playPanel.classList.remove("d-none");
      document.getElementById("score").textContent = 0;
      correctCount = 0;
      nextProblem();
      startGameTimer();
    }
  }, 1000);
}

function scoring() {
  playPanel.classList.add("d-none");
  scorePanel.classList.remove("d-none");
  document.getElementById("score").textContent = correctCount;
}

const pad = initSignaturePad(document.getElementById("tegaki"));
document.getElementById("eraser").onclick = () => {
  pad.clear();
};

const worker = new Worker("worker.js");
worker.addEventListener("message", function (e) {
  const reply = e.data.result[0];
  document.getElementById("reply").textContent = reply;
  if (reply == answer) {
    correctCount += 1;
    playAudio(correctAudio);
    nextProblem();
  }
});

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("restartButton").onclick = countdown;
document.getElementById("startButton").onclick = countdown;
document.getElementById("showAnswer").onclick = showAnswer;
document.getElementById("respeak").onclick = respeak;
document.getElementById("kohacu").onclick = catNyan;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
// prevent troublesome iOS features
document.ondblclick = (e) => {
  e.preventDefault();
};
document.body.style.webkitUserSelect = "none";
