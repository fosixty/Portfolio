// web-page.js — Dev page: terminal typewriter, 3D card tilt, capability bar animation

// Terminal typewriter sequence
const initTerminal = () => {
  const output = document.getElementById('terminal-output');
  const cursor = document.getElementById('term-cursor');
  const hero = document.getElementById('web-hero-title');
  if (!output) return;

  const LINES = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'out',    text: 'audio engineer · front-end developer' },
    { type: 'cmd',    text: 'ls ./skills' },
    { type: 'out',    text: 'HTML · CSS · JavaScript\n · Git · VS Code\n · AI-assisted workflows' },
    { type: 'cmd',    text: 'cat about.txt' },
    { type: 'out',    text: 'Building precise interfaces through implementation, debugging, and iteration.' },
  ];

  const CHAR_DELAY  = 38;  // ms per typed character
  const LINE_PAUSE  = 300; // ms between lines

  // Type one line character by character, return promise
  const typeLine = (el, text) => new Promise(resolve => {
    let i = 0;
    const tick = () => {
      el.textContent += text[i];
      i++;
      if (i < text.length) setTimeout(tick, CHAR_DELAY);
      else resolve();
    };
    tick();
  });

  // Insert cursor before first paint
  output.appendChild(cursor);

  const run = async () => {
    for (const line of LINES) {
      const p = document.createElement('p');
      if (line.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 'term-prompt';
        prompt.textContent = '$ ';
        const cmd = document.createElement('span');
        cmd.className = 'term-command';
        p.appendChild(prompt);
        p.appendChild(cmd);
        output.insertBefore(p, cursor);
        await typeLine(cmd, line.text);
      } else {
        const out = document.createElement('span');
        out.className = 'term-output';
        out.textContent = `  ${line.text}`;
        p.appendChild(out);
        output.insertBefore(p, cursor);
      }
      await new Promise(r => setTimeout(r, LINE_PAUSE));
    }

    // Fade in the page title after sequence completes
    if (hero) hero.classList.add('visible');
  };

  run();
};

// 3D tilt effect on project cards
const initCardTilt = () => {
  const cards = document.querySelectorAll('.dev-card');
  if (!cards.length) return;

  const INTENSITY = 8; // degrees of max tilt

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotY =  x * INTENSITY;
      const rotX = -y * INTENSITY;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
};

// Animate capability progress bars on scroll entry
const initCapBars = () => {
  const fills = document.querySelectorAll('.cap-bar-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
};

document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
  initCardTilt();
  initCapBars();
});
