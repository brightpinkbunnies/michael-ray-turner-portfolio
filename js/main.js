document.addEventListener('DOMContentLoaded', () => {
  loadContent();
  initNav();
});

async function loadContent() {
  try {
    const res = await fetch('content.json?v=' + Date.now());
    const data = await res.json();
    renderPage(data);
  } catch (e) {
    console.log('content.json not found or invalid, using inline defaults');
  }
}

function renderPage(data) {
  const page = document.body.dataset.page;

  if (page === 'home') renderHome(data);
  if (page === 'portfolio') renderPortfolio(data);
  if (page === 'about') renderAbout(data);
  if (page === 'contact') renderContact(data);

  document.querySelectorAll('[data-site-name]').forEach(el => {
    el.textContent = data.site.name;
  });
}

function renderHome(data) {
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) tagline.textContent = data.hero.tagline;
}

function renderPortfolio(data) {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  grid.innerHTML = '';
  data.portfolio.images.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.dataset.category = img.category;
    item.innerHTML = `
      <img src="${img.src}" alt="Photograph by Michael Ray Turner" loading="lazy">
    `;
    item.addEventListener('click', () => openLightbox(i, data.portfolio.images));
    grid.appendChild(item);
  });
}

function renderAbout(data) {
  const bioContainer = document.querySelector('.about-text');
  if (!bioContainer) return;

  const h2 = bioContainer.querySelector('h2');
  const existing = bioContainer.querySelectorAll('p');
  existing.forEach(p => p.remove());

  data.about.bio.forEach(para => {
    const p = document.createElement('p');
    p.textContent = para;
    bioContainer.appendChild(p);
  });
}

function renderContact(data) {
  const email = document.querySelector('.contact-email');
  if (email) {
    email.textContent = data.contact.email;
    email.href = `mailto:${data.contact.email}`;
  }

  const msg = document.querySelector('.contact-message');
  if (msg) msg.textContent = data.contact.message;
}

// Navigation
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }
}

// Lightbox
let currentLightboxIndex = 0;
let lightboxImages = [];

function openLightbox(index, images) {
  currentLightboxIndex = index;
  lightboxImages = images;

  const lightbox = document.querySelector('.lightbox');
  const caption = lightbox.querySelector('.lightbox-caption');
  let lbImg = lightbox.querySelector('.lightbox-img');
  if (!lbImg) {
    lbImg = document.createElement('img');
    lbImg.className = 'lightbox-img';
    lightbox.insertBefore(lbImg, caption);
  }

  lbImg.src = images[index].src;
  lbImg.alt = 'Photograph by Michael Ray Turner';
  caption.textContent = '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.querySelector('.lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  const lightbox = document.querySelector('.lightbox');
  const caption = lightbox.querySelector('.lightbox-caption');
  const lbImg = lightbox.querySelector('.lightbox-img');
  lbImg.src = lightboxImages[currentLightboxIndex].src;
  lbImg.alt = 'Photograph by Michael Ray Turner';
  caption.textContent = '';
}

document.addEventListener('keydown', (e) => {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox || !lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});
