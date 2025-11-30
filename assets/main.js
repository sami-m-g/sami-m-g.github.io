'use strict';

(() => {
  const initResponsiveMapZoom = () => {
    const map = document.querySelector('.map-frame[data-base-src]');
    if (!map) return;

    const base = map.dataset.baseSrc || '';
    if (!base) return;

    const desktopZoom = Number.parseInt(map.dataset.zoomDesktop || '3', 10);
    const mobileZoom = Number.parseInt(map.dataset.zoomMobile || String(desktopZoom), 10);
    const media = window.matchMedia('(max-width: 640px)');

    const applyZoom = () => {
      const zoom = media.matches ? mobileZoom : desktopZoom;
      const connector = base.includes('?') ? '&' : '?';
      const targetSrc = `${base}${connector}z=${zoom}`;

      if (map.src !== targetSrc) {
        map.src = targetSrc;
      }
    };

    applyZoom();
    media.addEventListener('change', applyZoom);
  };

  const initTypewriter = () => {
    const rotator = document.getElementById('role-rotator');
    const cursor = document.querySelector('.typewriter__cursor');

    if (!rotator || !cursor) return;

    let phrases;

    try {
      phrases = JSON.parse(rotator.dataset.phrases || '[]');
    } catch (error) {
      phrases = [];
    }

    if (!Array.isArray(phrases) || !phrases.length) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let currentSpan = null;
    let textNode = null;

    const typeDelay = 90;
    const holdDelay = 900;
    const resetFade = 550;
    const fullCyclePause = 5000;

    const typeNextChar = (current, isBuilder) => {
      if (textNode) {
        textNode.nodeValue = current.slice(0, charIndex);
      }

      if (charIndex < current.length) {
        charIndex += 1;
        setTimeout(() => typeNextChar(current, isBuilder), typeDelay);
        return;
      }

      setTimeout(() => {
        if (!isBuilder && currentSpan) {
          currentSpan.classList.add('typewriter__segment--faded');
        }
        advancePhrase();
      }, holdDelay);
    };

    const resetCycle = () => {
      rotator.classList.add('typewriter__text--fade');

      setTimeout(() => {
        rotator.textContent = '';
        rotator.classList.remove('typewriter__text--fade');
        phraseIndex = 0;
        charIndex = 0;
        startPhrase();
      }, resetFade);
    };

    const advancePhrase = () => {
      phraseIndex += 1;
      charIndex = 0;

      if (phraseIndex < phrases.length) {
        startPhrase();
        return;
      }

      setTimeout(resetCycle, fullCyclePause);
    };

    const startPhrase = () => {
      const current = phrases[phraseIndex];
      const isBuilder = phraseIndex === phrases.length - 1;

      currentSpan = document.createElement('span');
      currentSpan.className = 'typewriter__segment';
      textNode = document.createTextNode('');

      if (isBuilder) {
        currentSpan.classList.add('typewriter__text--builder', 'typewriter__segment--glow');
      }

      rotator.appendChild(currentSpan);
      currentSpan.appendChild(textNode);
      currentSpan.appendChild(cursor);
      typeNextChar(current, isBuilder);
    };

    startPhrase();
  };

  const initKpiCounters = () => {
    const counters = document.querySelectorAll('.kpi-value__number');

    counters.forEach((el) => {
      const text = (el.textContent || '').trim();
      const match = text.match(/^([^0-9+-]*)([+-]?)(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return;

      const [, prefix, sign, numberPart, suffix] = match;
      const target = Number.parseFloat(numberPart);
      if (Number.isNaN(target)) return;

      const decimals = (numberPart.split('.')[1] || '').length;
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = target * progress;
        const formatted = value.toFixed(decimals);

        el.textContent = `${prefix}${sign}${formatted}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      el.textContent = `${prefix}${sign}0${suffix}`;
      requestAnimationFrame(step);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initKpiCounters();
    initResponsiveMapZoom();
  });
})();
