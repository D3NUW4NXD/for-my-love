const loader = document.getElementById('loader');
const floaters = document.getElementById('floaters');
const envelopeWrap = document.getElementById('envelopeWrap');
const letterModal = document.getElementById('letterModal');
const closeBtn = document.getElementById('closeBtn');
const openHint = document.getElementById('openHint');
const phoneOpenBtn = document.getElementById('phoneOpenBtn');
const heartRow = document.getElementById('heartRow');
const reactionLine = document.getElementById('reactionLine');
const promiseBtn = document.getElementById('promiseBtn');
const promiseText = document.getElementById('promiseText');
const typeLine = document.getElementById('typeLine');
const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');

const cuteEmojis = ['💗', '💖', '🌸', '✨', '🩷', '💕', '🥺', '💫'];
const reactionMessages = {
  '❤️': 'Malshi gets one big heart ❤️',
  '💖': 'extra cute love unlocked 💖',
  '🥰': 'she is smiling now, probably 🥰',
  '💋': 'one tiny kiss sent to Malshi 💋',
  '✨': 'magic sparkle mode on ✨'
};
const promises = [
  'I promise to keep loving you in my own silly, real, loyal way.',
  'I promise to choose you even on ordinary days.',
  'I promise to make you smile whenever I can.',
  'I promise you are never just random to me. You are my special one.',
  'I promise my heart knows your name first, Malshi.'
];

let sparkleParticles = [];
let promiseIndex = 0;

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hide'), 650);
  startTypewriter();
  createFloaters();
  resizeCanvas();
  animateSparkles();
});

window.addEventListener('resize', resizeCanvas);

function startTypewriter(){
  const text = typeLine.dataset.text || '';
  let index = 0;
  typeLine.textContent = '';

  const timer = setInterval(() => {
    typeLine.textContent += text.charAt(index);
    index += 1;

    if(index >= text.length){
      clearInterval(timer);
    }
  }, 46);
}

function createFloaters(){
  for(let i = 0; i < 30; i += 1){
    const floater = document.createElement('span');
    floater.textContent = cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];
    floater.style.left = `${Math.random() * 100}%`;
    floater.style.fontSize = `${14 + Math.random() * 24}px`;
    floater.style.animationDuration = `${9 + Math.random() * 14}s`;
    floater.style.animationDelay = `${Math.random() * 11}s`;
    floaters.appendChild(floater);
  }
}

function openLetter(){
  if(envelopeWrap.classList.contains('opened')) return;

  envelopeWrap.classList.add('opened');
  openHint.classList.add('hide');
  createHeartRain(36);

  setTimeout(() => {
    letterModal.classList.add('show');
    letterModal.setAttribute('aria-hidden', 'false');
  }, 780);
}

function closeLetter(){
  letterModal.classList.remove('show');
  letterModal.setAttribute('aria-hidden', 'true');
}

envelopeWrap.addEventListener('click', openLetter);
openHint.addEventListener('click', openLetter);
if(phoneOpenBtn){
  phoneOpenBtn.addEventListener('click', openLetter);
}

envelopeWrap.addEventListener('keydown', (event) => {
  if(event.key === 'Enter' || event.key === ' '){
    event.preventDefault();
    openLetter();
  }
});

closeBtn.addEventListener('click', closeLetter);
letterModal.addEventListener('click', (event) => {
  if(event.target === letterModal){
    closeLetter();
  }
});

document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape'){
    closeLetter();
  }
});

heartRow.addEventListener('click', (event) => {
  const button = event.target.closest('.heart-btn');
  if(!button) return;

  const emoji = button.dataset.emoji;
  reactionLine.textContent = reactionMessages[emoji] || 'so cute';
  createButtonBurst(button, emoji, 8);
});

promiseBtn.addEventListener('click', () => {
  promiseIndex = (promiseIndex + 1) % promises.length;
  promiseText.textContent = promises[promiseIndex];
  createButtonBurst(promiseBtn, '💞', 12);
});

function createButtonBurst(element, emoji, amount){
  const rect = element.getBoundingClientRect();

  for(let i = 0; i < amount; i += 1){
    const burst = document.createElement('span');
    burst.className = 'burst';
    burst.textContent = emoji;
    burst.style.left = `${rect.left + rect.width / 2 + (Math.random() * 34 - 17)}px`;
    burst.style.top = `${rect.top + rect.height / 2 + (Math.random() * 18 - 9)}px`;
    burst.style.fontSize = `${18 + Math.random() * 12}px`;
    burst.style.animationDelay = `${Math.random() * 0.16}s`;
    document.body.appendChild(burst);

    setTimeout(() => burst.remove(), 1050);
  }
}

function createHeartRain(amount){
  for(let i = 0; i < amount; i += 1){
    sparkleParticles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.25,
      size: 12 + Math.random() * 18,
      speed: 1.4 + Math.random() * 2.5,
      drift: -0.8 + Math.random() * 1.6,
      rotate: Math.random() * Math.PI,
      alpha: 0.85,
      type: cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)]
    });
  }
}

function resizeCanvas(){
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function animateSparkles(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sparkleParticles = sparkleParticles.filter((particle) => {
    particle.y += particle.speed;
    particle.x += particle.drift;
    particle.rotate += 0.02;
    particle.alpha -= 0.004;

    ctx.save();
    ctx.globalAlpha = Math.max(particle.alpha, 0);
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotate);
    ctx.font = `${particle.size}px serif`;
    ctx.fillText(particle.type, 0, 0);
    ctx.restore();

    return particle.y < window.innerHeight + 40 && particle.alpha > 0;
  });

  requestAnimationFrame(animateSparkles);
}

document.addEventListener('pointermove', (event) => {
  if(Math.random() > 0.5) return;

  sparkleParticles.push({
    x: event.clientX + (Math.random() * 18 - 9),
    y: event.clientY + (Math.random() * 18 - 9),
    size: 10 + Math.random() * 10,
    speed: -0.2 - Math.random() * 0.7,
    drift: -0.5 + Math.random(),
    rotate: Math.random() * Math.PI,
    alpha: 0.8,
    type: Math.random() > 0.55 ? '✨' : '💗'
  });
});
