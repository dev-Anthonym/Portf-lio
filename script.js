// =========================================================
// ESTADO
// =========================================================
const body = document.body;
let currentTheme = 'dark';

// =========================================================
// 1) ALTERNAR MODO CLARO / ESCURO
// =========================================================
const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  currentTheme = theme;
  body.setAttribute('data-theme', theme);
}

themeToggle.addEventListener('click', () => {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// =========================================================
// 2) MENU RESPONSIVO
// =========================================================
const menuToggle = document.getElementById('menuToggle');
const tabNav = document.getElementById('tabNav');

menuToggle.addEventListener('click', () => {
  const isOpen = tabNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// fecha o menu ao clicar em um link (útil no celular)
tabNav.querySelectorAll('.tab-link').forEach((link) => {
  link.addEventListener('click', () => {
    tabNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');

    tabNav.querySelectorAll('.tab-link').forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// destaca o link ativo conforme a rolagem da página
const sections = document.querySelectorAll('main .section[id]');
const navLinks = document.querySelectorAll('.tab-link');

function highlightActiveSection() {
  let currentId = sections[0]?.id;
  const scrollPos = window.scrollY + 120;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

window.addEventListener('scroll', highlightActiveSection);

// =========================================================
// 3) TEXTO DIGITADO (EFEITO TERMINAL)
// =========================================================
const typedTextEl = document.getElementById('typedText');
const phrases = [
  '> desenvolvedor(a) front-end em formação',
  '> apaixonado(a) por interfaces bem construídas',
  '> sempre aprendendo algo novo',
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typedTextEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedTextEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeLoop, deleting ? 35 : 55);
}

if (typedTextEl) typeLoop();

// =========================================================
// 4) SCROLL REVEAL (IntersectionObserver)
// =========================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => revealObserver.observe(el));

// =========================================================
// 5) BOTÃO VOLTAR AO TOPO
// =========================================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 480);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =========================================================
// 6) MODAL "SAIBA MAIS" DOS PROJETOS
// =========================================================
const modal = document.getElementById('projectModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

function openModal(title, desc) {
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.project-more').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(btn.dataset.title, btn.dataset.desc);
  });
});

modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// =========================================================
// 7) VALIDAÇÃO DO FORMULÁRIO DE CONTATO
// =========================================================
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

function showError(fieldName, message) {
  const row = contactForm.querySelector(`#${fieldName}`).closest('.form-row');
  const errorEl = contactForm.querySelector(`.form-error[data-for="${fieldName}"]`);
  row.classList.toggle('has-error', Boolean(message));
  errorEl.textContent = message || '';
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  let isValid = true;

  if (name.length < 2) {
    showError('name', 'Digite seu nome completo.');
    isValid = false;
  } else {
    showError('name', '');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('email', 'Digite um e-mail válido.');
    isValid = false;
  } else {
    showError('email', '');
  }

  if (message.length < 10) {
    showError('message', 'Escreva uma mensagem com pelo menos 10 caracteres.');
    isValid = false;
  } else {
    showError('message', '');
  }

  if (!isValid) {
    formFeedback.textContent = '';
    return;
  }

  // Este é um formulário de demonstração (sem back-end).
  // Para receber mensagens de verdade, integre um serviço como Formspree ou EmailJS.
  formFeedback.textContent = `Obrigado, ${name}! Sua mensagem foi registrada (formulário de demonstração).`;
  contactForm.reset();
});

// =========================================================
// 8) ANO ATUAL NO RODAPÉ
// =========================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
