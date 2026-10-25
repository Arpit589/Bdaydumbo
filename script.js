/*
  BIRTHDAY SURPRISE WEBSITE — JAVASCRIPT
  --------------------------------------
  This file controls navigation, music, the candle, confetti, typing effect and replay.
  Edit the birthday person's name and appreciation messages in index.html, not here.
  Images are in images/ and music is in music/song.mp3.
*/

const slides = {
  intro: "slide-1",
  funny: "slide-funny",
  cake: "slide-cake",
  person: "slide-person",
  gallery: "slide-gallery",
  qualities: "slide-qualities",
  letter: "slide-letter",
  finale: "slide-finale"
};

const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");

let currentSlide = "intro";
let musicOn = false;
let finaleTyped = false;

function showSlide(name) {
  const targetId = slides[name];
  if (!targetId || currentSlide === name) return;

  document.querySelectorAll(".slide").forEach(slide => {
    slide.classList.remove("active");
  });

  const target = document.getElementById(targetId);
  target.classList.add("active");
  currentSlide = name;

  if (name === "finale") {
    typeFinalWish();
    setTimeout(() => launchConfetti(90), 700);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startMusic() {
  music.play().then(() => {
    musicOn = true;
    updateMusicButton();
  }).catch(() => {
    musicOn = false;
    updateMusicButton();
  });
}

function toggleMusic() {
  if (music.paused) {
    startMusic();
  } else {
    music.pause();
    musicOn = false;
    updateMusicButton();
  }
}

function updateMusicButton() {
  musicIcon.textContent = musicOn ? "♫" : "♪";
  musicLabel.textContent = musicOn ? "Music on" : "Music off";
}

musicToggle.addEventListener("click", toggleMusic);

// Browsers commonly block autoplay until the first user interaction.
window.addEventListener("load", () => {
  startMusic();
});
document.addEventListener("pointerdown", () => {
  if (music.paused && !musicOn) startMusic();
}, { once: true });

function blowCandle() {
  const flame = document.getElementById("flame");
  if (flame.classList.contains("out")) return;

  flame.classList.add("out");
  document.getElementById("candleButton").classList.add("blown");
  launchConfetti(75);

  setTimeout(() => {
    document.getElementById("wishModal").classList.add("show");
    document.getElementById("wishModal").setAttribute("aria-hidden", "false");
  }, 500);
}

function closeWishAndContinue() {
  document.getElementById("wishModal").classList.remove("show");
  document.getElementById("wishModal").setAttribute("aria-hidden", "true");
  showSlide("person");
}

function launchConfetti(amount = 60) {
  const layer = document.getElementById("confetti");
  if (!layer) return;

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    const palette = ["#502D55", "#935073", "#F6DBC0", "#F8F4E9"];
    piece.style.background = palette[Math.floor(Math.random() * palette.length)];
    piece.style.left = Math.random() * 100 + "%";
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 260}px`);
    piece.style.animationDelay = `${Math.random() * .65}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    piece.style.width = `${5 + Math.random() * 6}px`;
    piece.style.height = `${8 + Math.random() * 10}px`;

    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
}

function typeFinalWish() {
  if (finaleTyped) return;
  finaleTyped = true;

  const element = document.getElementById("typeMessage");
  const message = "Some people make ordinary moments feel special...";
  let index = 0;

  element.textContent = "";
  const timer = setInterval(() => {
    element.textContent += message[index++];
    if (index >= message.length) clearInterval(timer);
  }, 48);
}

function replayExperience() {
  document.getElementById("wishModal").classList.remove("show");

  const flame = document.getElementById("flame");
  flame.classList.remove("out");
  document.getElementById("candleButton").classList.remove("blown");

  document.getElementById("confetti").innerHTML = "";
  document.getElementById("typeMessage").textContent = "";
  finaleTyped = false;

  showSlide("intro");
  setTimeout(() => startMusic(), 250);
}

// Close popup when clicking its backdrop.
document.getElementById("wishModal").addEventListener("click", event => {
  if (event.target.id === "wishModal") {
    event.currentTarget.classList.remove("show");
  }
});
