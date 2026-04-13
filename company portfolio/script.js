/* ================================================
   MIRA FUTURE TECH PRIVATE LIMITED — PORTFOLIO JAVASCRIPT
   ================================================ */

'use strict';

// ===== UTILITY =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticleCanvas();
  initRevealAnimations();
  initCounters();
  initContactForm();
  initBackToTop();
  initSmoothNav();
  initMobileMenu();
  initWebsiteFilter();
  initTestimonialsCarousel();
  initScrollProgress();
});

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #1E90FF, #00D4FF);
    z-index: 9999;
    transition: width 0.1s ease;
    box-shadow: 0 0 10px rgba(30,144,255,0.6);
    width: 0%;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const btn = $('#hamburger');
  const links = $('#navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

// ===== SMOOTH NAVIGATION =====
function initSmoothNav() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ===== PARTICLE CANVAS =====
function initParticleCanvas() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 90;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.radius = Math.random() * 2 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.08;
      this.color = Math.random() > 0.5 ? '30,144,255' : '0,212,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  const CONNECT_DIST = 120;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(30,144,255,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  };
  animate();
}

// ===== REVEAL ON SCROLL =====
function initRevealAnimations() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = $$('.reveal', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 100, 500);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
  const selectors = '.stat-number[data-target], .impact-number[data-target]';
  const allCounters = $$(selectors);

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  allCounters.forEach(el => observer.observe(el));
}

// ===== WEBSITE FILTER =====
function initWebsiteFilter() {
  const filterBtns = $$('.filter-btn');
  const cards = $$('.website-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===== TESTIMONIALS CAROUSEL =====
function initTestimonialsCarousel() {
  const track = $('#testimonialsTrack');
  if (!track) return;

  const cards = $$('.testimonial-card', track);
  const dotsContainer = $('#testimonialsDots');
  const prevBtn = $('#testPrev');
  const nextBtn = $('#testNext');

  let current = 0;
  let autoplayTimer = null;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = $$('.testimonial-dot');

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 5500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  // Touch support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      startAutoplay();
    }
  });

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('#submitBtn');
    const success = $('#formSuccess');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      success.classList.add('show');
      form.reset();

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
        btn.style.background = '';
        success.classList.remove('show');
      }, 4500);
    }, 1800);
  });

  // Input focus scale
  const inputs = $$('input, select, textarea', form);
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.01)';
      input.parentElement.style.transition = 'transform 0.2s ease';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = '';
    });
  });
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== TILT EFFECTS & HOVER FX =====
window.addEventListener('load', () => {

  // Project mockup 3D tilt
  $$('.project-mockup-frame').forEach(frame => {
    frame.addEventListener('mousemove', e => {
      const rect = frame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      frame.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.02)`;
      frame.style.transition = 'transform 0.1s ease';
    });
    frame.addEventListener('mouseleave', () => {
      frame.style.transform = '';
      frame.style.transition = 'transform 0.5s ease';
    });
  });

  // Service card spotlight glow
  $$('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(30,144,255,0.1) 0%, rgba(30,144,255,0.03) 50%, transparent 75%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // Team card 3D tilt
  $$('.team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });

  // Website card hover
  $$('.website-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-8px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });

  // Process step hover
  $$('.process-step').forEach(step => {
    step.addEventListener('mouseenter', () => {
      step.querySelector('.process-step-icon').style.transform = 'scale(1.1) rotate(5deg)';
    });
    step.addEventListener('mouseleave', () => {
      step.querySelector('.process-step-icon').style.transform = '';
    });
  });

  // Strength cards staggered animation
  const strengthCards = $$('.strength-card');
  const strengthObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      strengthCards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 120);
      });
      strengthObserver.disconnect();
    }
  }, { threshold: 0.2 });

  strengthCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  if (strengthCards.length) strengthObserver.observe(strengthCards[0].parentElement);

  // Tech items ripple
  $$('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 100%; height: 100%;
        border-radius: 8px;
        background: radial-gradient(circle, rgba(30,144,255,0.25) 0%, transparent 70%);
        animation: rippleFade 0.5s ease forwards;
        pointer-events: none;
        top: 0; left: 0;
      `;
      item.style.position = 'relative';
      item.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple animation keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleFade {
      0% { opacity: 1; transform: scale(0.8); }
      100% { opacity: 0; transform: scale(1.3); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
});

// ===== FLOATING CARDS PARALLAX =====
window.addEventListener('mousemove', e => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 2;
  const my = (e.clientY / window.innerHeight - 0.5) * 2;

  $$('.project-floating-card').forEach((card, i) => {
    const depth = i % 2 === 0 ? 10 : -10;
    card.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
  });
});

// ===== MARQUEE PAUSE ON HOVER =====
const marqueeTrack = $('.marquee-track');
if (marqueeTrack) {
  const strip = $('.marquee-strip');
  strip.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  strip.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ===== IMPACT CARD ANIMATION DELAY =====
$$('.impact-card').forEach((card, i) => {
  card.style.animationDelay = `${i * 0.15}s`;
});

// ===== WEBSITE PREVIEW SCREENSHOT PARALLAX =====
$$('.website-screenshot').forEach(screen => {
  const img = screen.querySelector('img');
  if (!img) return;

  screen.addEventListener('mousemove', e => {
    const rect = screen.getBoundingClientRect();
    const y = (e.clientY - rect.top) / rect.height;
    const scrollAmount = (img.naturalHeight / img.clientHeight - 1) * y * 30;
    img.style.objectPosition = `center ${scrollAmount}px`;
  });

  screen.addEventListener('mouseleave', () => {
    img.style.objectPosition = 'center top';
  });
});

// ===== ACTIVE SECTION HIGHLIGHT (ENHANCED) =====
const sectionHighlights = {
  home: '#1E90FF',
  about: '#00D4FF',
  services: '#7C3AED',
  websites: '#1E90FF',
  projects: '#10B981',
  process: '#F59E0B',
  team: '#EC4899',
  technologies: '#1E90FF',
  contact: '#00D4FF'
};

// Keyboard navigation for testimonials
document.addEventListener('keydown', e => {
  const track = $('#testimonialsTrack');
  if (!track) return;
  // Find current index from transform
  const transform = track.style.transform;
  const match = transform.match(/-(\d+)%/);
  if (!match) return;
  const current = parseInt(match[1]) / 100;
  const total = $$('.testimonial-card').length;

  if (e.key === 'ArrowLeft') {
    const newIdx = (current - 1 + total) % total;
    track.style.transform = `translateX(-${newIdx * 100}%)`;
    $$('.testimonial-dot').forEach((d, i) => d.classList.toggle('active', i === newIdx));
  } else if (e.key === 'ArrowRight') {
    const newIdx = (current + 1) % total;
    track.style.transform = `translateX(-${newIdx * 100}%)`;
    $$('.testimonial-dot').forEach((d, i) => d.classList.toggle('active', i === newIdx));
  }
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiSequence = [];
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

document.addEventListener('keydown', e => {
  konamiSequence.push(e.key);
  if (konamiSequence.length > KONAMI.length) konamiSequence.shift();
  if (JSON.stringify(konamiSequence) === JSON.stringify(KONAMI)) {
    document.body.style.animation = 'rainbowBg 3s linear';
    const msg = document.createElement('div');
    msg.textContent = '🚀 Mira Future Tech — Changing the World!';
    msg.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #1E90FF, #7C3AED);
      color: #fff; padding: 24px 48px; border-radius: 20px;
      font-size: 1.4rem; font-weight: 700; z-index: 99999;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      animation: fadeInUp 0.4s ease both;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
    konamiSequence = [];
  }
});
