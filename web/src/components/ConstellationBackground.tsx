"use client";

// Bağlı noktalar ağı: "cihazların arasında eşitleme, arada sunucu yok". ThreeUI Community'deki Constellation Field'ın
// (MIT, Design+Code, github.com/MengTo/threeui) çizim algoritması; dış betik ve görsel yok, renkler sitenin paleti.
// Ekran dışındayken ve sekme gizliyken durur; "hareketi azalt" açıksa tek kare çizer, oynatmaz.
import { useEffect, useRef } from "react";

// Renkler CSS belirteclerinden okunur (--node-a = primary.light, --node-b = primary); varsayilan degerler eskisiyle ayni.
function readNodeColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    node: cs.getPropertyValue("--node-a").trim() || "138, 180, 255",
    link: cs.getPropertyValue("--node-b").trim() || "76, 141, 255",
  };
}

type Node = { x: number; y: number; vx: number; vy: number; r: number; phase: number };

export default function ConstellationBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let link = 150;
    let frame = 0;
    let visible = true;
    const pointer = { x: -1000, y: -1000 };

    function seed() {
      const narrow = width < 768;
      link = narrow ? 120 : 150;
      const count = Math.round(Math.min(narrow ? 34 : 70, (width * height) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 1.2,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.floor(width * dpr));
      canvas!.height = Math.max(1, Math.floor(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw(t: number, move: boolean) {
      ctx!.clearRect(0, 0, width, height);
      const { node: NODE, link: LINK_RGB } = readNodeColors();
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < link) {
            ctx!.strokeStyle = `rgba(${LINK_RGB}, ${0.06 + (1 - d / link) * 0.22})`;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
      }
      for (const n of nodes) {
        if (move) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
          const pd = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (pd < 200) {
            n.x -= (n.x - pointer.x) * 0.004;
            n.y -= (n.y - pointer.y) * 0.004;
          }
        }
        const pulse = 0.7 + Math.sin(t * 0.001 + n.phase) * 0.3;
        ctx!.fillStyle = `rgba(${NODE}, ${pulse * 0.18})`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * 2.4, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = `rgba(${NODE}, ${pulse * 0.75})`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop(t: number) {
      draw(t, true);
      frame = requestAnimationFrame(loop);
    }
    function start() {
      if (reduced || frame || !visible || document.hidden) return;
      frame = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    resize();
    draw(0, false);
    start();

    const onResize = () => { resize(); draw(performance.now(), false); };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => { pointer.x = -1000; pointer.y = -1000; };
    const onVisibility = () => (document.hidden ? stop() : start());
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
