import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ────────────────────────────────────────────
    // Depth particles  (simulate z-axis with size/opacity)
    // ────────────────────────────────────────────
    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:          Math.random() * window.innerWidth,
      y:          Math.random() * window.innerHeight,
      z:          Math.random(),                         // 0 = far, 1 = near
      vx:         (Math.random() - 0.5) * 0.25,
      vy:         (Math.random() - 0.5) * 0.25,
      phase:      Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.015 + 0.005,
    }));

    // ────────────────────────────────────────────
    // Floating orbs  (large, blurred, slow)
    // ────────────────────────────────────────────
    const orbs = [
      { x: 0.15, y: 0.20, r: 200, color: "99,102,241",   speed: 0.00008 },
      { x: 0.80, y: 0.55, r: 160, color: "192,132,252",  speed: 0.00010 },
      { x: 0.50, y: 0.85, r: 140, color: "103,232,249",  speed: 0.00007 },
      { x: 0.72, y: 0.10, r: 120, color: "129,140,248",  speed: 0.00012 },
    ].map(o => ({ ...o, phase: Math.random() * Math.PI * 2 }));

    // ────────────────────────────────────────────
    // Connections (lines between close particles)
    // ────────────────────────────────────────────
    const MAX_DIST = 120;

    let animFrame;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // ── Orbs ──
      orbs.forEach(orb => {
        orb.phase += orb.speed * 1000 * 0.016;
        const cx = orb.x * canvas.width  + Math.sin(orb.phase)        * 80;
        const cy = orb.y * canvas.height + Math.cos(orb.phase * 0.77) * 60;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
        grad.addColorStop(0,   `rgba(${orb.color}, 0.10)`);
        grad.addColorStop(0.5, `rgba(${orb.color}, 0.04)`);
        grad.addColorStop(1,   `rgba(${orb.color}, 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // ── Move particles ──
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // ── Draw connections ──
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.12 * ((a.z + b.z) / 2);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ── Draw particles ──
      particles.forEach(p => {
        const pulse  = Math.sin(p.phase) * 0.35 + 0.65;
        const radius = (p.z * 2.5 + 0.5) * pulse;
        const alpha  = p.z * 0.55 * pulse + 0.05;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4);
        grad.addColorStop(0, `rgba(129, 140, 248, ${alpha})`);
        grad.addColorStop(1, "rgba(129, 140, 248, 0)");

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // solid core
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199, 210, 254, ${alpha * 1.5})`;
        ctx.fill();
      });

      // ── Light sweep ──
      const sweepX = canvas.width * (0.5 + Math.sin(time * 0.15) * 0.4);
      const sweep = ctx.createLinearGradient(sweepX - 200, 0, sweepX + 200, canvas.height);
      sweep.addColorStop(0,   "rgba(99,102,241, 0)");
      sweep.addColorStop(0.5, `rgba(99,102,241, ${0.025 + Math.sin(time * 0.3) * 0.01})`);
      sweep.addColorStop(1,   "rgba(99,102,241, 0)");
      ctx.fillStyle = sweep;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}
