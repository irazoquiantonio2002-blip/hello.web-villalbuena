const VILLA_WA = "524771211951";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    window.setTimeout(() => loader.classList.add("is-hidden"), 350);
  }
});

const navbar = document.getElementById("navbar");
const onScroll = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 24);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const hamburger = document.getElementById("hamburger");
const mobMenu = document.getElementById("mob-menu");

if (hamburger && mobMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobMenu.classList.toggle("is-open");
    hamburger.classList.toggle("is-active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  mobMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobMenu.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

const marquee = document.getElementById("marquee");
if (marquee) {
  const items = [
    "Preventa residencial",
    "Acceso controlado 24/7",
    "6 modelos de casa",
    "Terrenos de 105 m²",
    "Acabados de lujo",
    "Aparta con $30,000",
    "Entregas desde febrero 2027",
    "Amenidades para tu familia"
  ];
  marquee.innerHTML = [...items, ...items].map((item) => `<span>${item}</span>`).join("");
}

const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealEls.forEach((el) => revealObserver.observe(el));

const stats = document.querySelectorAll(".stat-num");
const countNumber = (el) => {
  const target = Number(el.dataset.count || 0);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value.toLocaleString("es-MX")}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      countNumber(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.45 });

stats.forEach((stat) => statsObserver.observe(stat));

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const form = document.getElementById("wa-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("f-name")?.value.trim();
    const interest = document.getElementById("f-interest")?.value;
    const msg = document.getElementById("f-msg")?.value.trim();

    if (!name || !msg) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola, quiero información sobre Villa Valbuena.",
      `Nombre: ${name}`,
      `Interés: ${interest}`,
      `Mensaje: ${msg}`
    ].join("\n");

    window.open(`https://wa.me/${VILLA_WA}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

const canvas = document.getElementById("hero-canvas");
const ctx = canvas?.getContext("2d");
let particles = [];

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(80, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    length: 22 + Math.random() * 54,
    speed: 0.14 + Math.random() * 0.32,
    opacity: 0.08 + Math.random() * 0.16
  }));
}

function drawCanvas() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(245, 207, 99, ${p.opacity})`;
    ctx.lineWidth = 1;
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.length * 0.22, p.y + p.length);
    ctx.stroke();
    p.y += p.speed;
    if (p.y > window.innerHeight + p.length) {
      p.y = -p.length;
      p.x = Math.random() * window.innerWidth;
    }
  });
  requestAnimationFrame(drawCanvas);
}

if (canvas && ctx) {
  resizeCanvas();
  drawCanvas();
  window.addEventListener("resize", resizeCanvas);
}
