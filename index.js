// Scroll reveal using Intersection Observer
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // only animate once
    }
  });
}, {
  threshold: 0.15 // triggers when 15% of the section is visible
});

revealElements.forEach(el => revealObserver.observe(el));

// ---- Starfield with shooting stars ----
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Regular twinkling stars
const stars = [];
const STAR_COUNT = 120;

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.3 + 0.3,
    opacity: Math.random(),
    twinkleSpeed: Math.random() * 0.015 + 0.005,
  });
}

// Shooting stars
const shootingStars = [];

function spawnShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.4,
    length: Math.random() * 80 + 60,
    speed: Math.random() * 8 + 6,
    angle: Math.PI / 4, // 45 degrees
    opacity: 1,
  });
}

// Spawn a shooting star every 3-6 seconds
function scheduleShootingStar() {
  const delay = Math.random() * 3000 + 3000;
  setTimeout(() => {
    spawnShootingStar();
    scheduleShootingStar();
  }, delay);
}
scheduleShootingStar();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw twinkling stars
  stars.forEach(star => {
    star.opacity += star.twinkleSpeed;
    if (star.opacity > 1 || star.opacity < 0.2) star.twinkleSpeed *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 236, 243, ${star.opacity})`;
    ctx.fill();
  });

  // Draw shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    const dx = Math.cos(s.angle) * s.length;
    const dy = Math.sin(s.angle) * s.length;

    const gradient = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
    gradient.addColorStop(0, `rgba(45, 212, 191, ${s.opacity})`);
    gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - dx, s.y - dy);
    ctx.stroke();

    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.opacity -= 0.015;

    if (s.opacity <= 0) shootingStars.splice(i, 1);
  }

  requestAnimationFrame(animate);
}

animate();