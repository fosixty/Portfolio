// audio-page.js — Audio page: spectrum animation, project filter

// Generate and animate the frequency spectrum bars
const initSpectrum = () => {
  const container = document.getElementById('spectrum');
  if (!container) return;

  const BAR_COUNT = 48;
  // Heights at varying opacities — simulate a frozen analyzer
  const heights = Array.from({ length: BAR_COUNT }, (_, i) => {
    const center = BAR_COUNT / 2;
    const dist = Math.abs(i - center) / center;
    const base = 1 - dist * 0.6;
    return (base * 0.7 + Math.random() * 0.3) * 100;
  });

  heights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'spectrum-bar';
    // Opacity scales with height
    bar.style.height = `${h}%`;
    bar.style.opacity = `${0.3 + (h / 100) * 0.7}`;
    bar.style.transitionDelay = `${i * 18}ms`;
    container.appendChild(bar);
  });

  // Trigger animation on load via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        container.querySelectorAll('.spectrum-bar').forEach(bar => bar.classList.add('animate'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(container);
};

// Filter projects by category
const initFilter = () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#project-grid .project-card');
  if (!buttons.length || !cards.length) return;

  const setFilter = (filter) => {
    buttons.forEach(btn => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    cards.forEach(card => {
      const category = card.dataset.category;
      const hidden = filter !== 'all' && category !== filter;
      card.setAttribute('data-hidden', String(hidden));
    });
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
};

// Convert project-card data-youtube-url values into click-to-load embeds
const initProjectEmbeds = () => {
  const embeds = document.querySelectorAll('.project-card__embed[data-youtube-url]');
  if (!embeds.length) return;

  const getVideoId = (urlString) => {
    if (!urlString) return '';

    try {
      const url = new URL(urlString.trim());
      const host = url.hostname.replace('www.', '');

      if (host === 'youtu.be') {
        return url.pathname.replace('/', '').trim();
      }

      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
        const watchId = url.searchParams.get('v');
        if (watchId) return watchId.trim();

        if (url.pathname.startsWith('/shorts/')) {
          return url.pathname.split('/')[2]?.trim() || '';
        }

        if (url.pathname.startsWith('/embed/')) {
          return url.pathname.split('/')[2]?.trim() || '';
        }
      }
    } catch {
      return '';
    }

    return '';
  };

  embeds.forEach(embed => {
    const rawUrl = embed.dataset.youtubeUrl || '';
    const videoId = getVideoId(rawUrl);
    if (!videoId) return;

    const frame = embed.querySelector('.project-card__embed-frame');
    if (!frame) return;

    const cardTitle = embed.closest('.project-card')?.querySelector('.project-card__name')?.textContent?.trim() || 'Project video';

    frame.innerHTML = '';
    frame.classList.add('project-card__embed-frame--ready');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'project-card__embed-trigger';
    trigger.setAttribute('aria-label', `Play ${cardTitle} on YouTube`);

    const thumb = document.createElement('img');
    thumb.className = 'project-card__thumb';
    thumb.loading = 'lazy';
    thumb.decoding = 'async';
    thumb.alt = `${cardTitle} video thumbnail`;
    thumb.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    thumb.addEventListener('error', () => {
      thumb.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    }, { once: true });

    const playBadge = document.createElement('span');
    playBadge.className = 'project-card__play-badge';
    playBadge.setAttribute('aria-hidden', 'true');
    playBadge.textContent = '▶ Play';

    trigger.appendChild(thumb);
    trigger.appendChild(playBadge);
    frame.appendChild(trigger);

    const mountIframe = () => {
      frame.innerHTML = '';
      frame.classList.remove('project-card__embed-frame--ready');
      frame.classList.add('project-card__embed-frame--active');

      const iframe = document.createElement('iframe');
      iframe.className = 'project-card__iframe';
      const hasHttpOrigin = /^https?:/.test(window.location.origin || '');
      const originParam = hasHttpOrigin
        ? `&origin=${encodeURIComponent(window.location.origin)}`
        : '';
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${originParam}`;
      iframe.title = `${cardTitle} — YouTube video player`;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      frame.appendChild(iframe);
    };

    trigger.addEventListener('click', mountIframe, { once: true });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initSpectrum();
  initFilter();
  initProjectEmbeds();
});
