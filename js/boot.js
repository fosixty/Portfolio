// boot.js — Boot sequence intro animation

const BOOT_LINES = [
  '&gt; SYSTEM BOOT...',
  '&gt; LOADING PROFILE: [MITCHELL GENDRON]',
  '&gt; DISCIPLINES: AUDIO ENGINEERING / FRONT-END DEVELOPMENT',
  '&gt; STATUS: ONLINE',
];

const SESSION_KEY = 'boot_played';

// Reveal each boot line with a delay
const playBootSequence = (screen, linesContainer) => {
  let delay = 0;
  BOOT_LINES.forEach((text, i) => {
    const line = document.createElement('p');
    line.className = 'boot-line';
    line.innerHTML = text;
    linesContainer.appendChild(line);

    setTimeout(() => line.classList.add('visible'), delay);
    delay += 380;
  });

  // Fade out and remove after lines are shown
  setTimeout(() => {
    screen.classList.add('fade-out');
    screen.addEventListener('transitionend', () => {
      screen.remove();
      document.body.style.overflow = '';
    }, { once: true });
    sessionStorage.setItem(SESSION_KEY, '1');
  }, delay + 600);
};

// Skip and immediately dismiss the boot screen
const skipBoot = (screen) => {
  screen.remove();
  document.body.style.overflow = '';
  sessionStorage.setItem(SESSION_KEY, '1');
};

document.addEventListener('DOMContentLoaded', () => {
  const screen = document.getElementById('boot-screen');
  const linesContainer = document.getElementById('boot-lines');
  const skipBtn = document.getElementById('boot-skip');

  if (!screen) return;

  // If already played this session, skip immediately
  if (sessionStorage.getItem(SESSION_KEY)) {
    screen.remove();
    return;
  }

  document.body.style.overflow = 'hidden';

  skipBtn.addEventListener('click', () => skipBoot(screen));

  // Allow keyboard skip via Enter/Space on the skip button (handled natively)
  // Also allow Escape to skip
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') skipBoot(screen);
  });

  playBootSequence(screen, linesContainer);
});
