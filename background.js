document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animationFrameId;
  let particles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(91, 141, 238, 0.3)';
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles = [];
    const particleCount = width < 768 ? 35 : 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  };

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = 1 - distance / 150;
          ctx.strokeStyle = `rgba(91, 141, 238, ${opacity * 0.12})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  };

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    const gradient1 = ctx.createRadialGradient(width * 0.2, height * 0.2, 0, width * 0.2, height * 0.2, width * 0.6);
    gradient1.addColorStop(0, 'rgba(91, 141, 238, 0.04)');
    gradient1.addColorStop(1, 'rgba(15, 17, 23, 0)');

    const gradient2 = ctx.createRadialGradient(width * 0.8, height * 0.8, 0, width * 0.8, height * 0.8, width * 0.6);
    gradient2.addColorStop(0, 'rgba(91, 141, 238, 0.03)');
    gradient2.addColorStop(1, 'rgba(15, 17, 23, 0)');

    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      particles.forEach(p => { p.update(); p.draw(ctx); });
      drawLines();
      animationFrameId = requestAnimationFrame(render);
    } else {
      particles.forEach(p => p.draw(ctx));
      drawLines();
    }
  };

  window.addEventListener('resize', resize);
  resize();
  render();

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
});
