import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  r: number;
  g: number;
  b: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "cube" | "spike" | "tall";
  color: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

export type GameState = "idle" | "running" | "over";

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GROUND_OFFSET = 50;
export const ORB_RADIUS = 18;
const BASE_SPEED = 4;
const SPEED_INCREMENT = 0.5;
const SPEED_INTERVAL = 500;
const OBSTACLE_MIN_GAP = 90;
export const NEON_CYAN = "#00f5ff";
export const NEON_MAGENTA = "#ff00aa";
const NEON_COLORS = ["#00f5ff", "#ff00aa", "#a855f7", "#22d3ee", "#f472b6"];

const RGB_CACHE = new Map<string, [number, number, number]>();
function hexToRgb(hex: string): [number, number, number] {
  const cached = RGB_CACHE.get(hex);
  if (cached) return cached;
  const n = parseInt(hex.slice(1), 16);
  const rgb: [number, number, number] = [
    (n >> 16) & 255,
    (n >> 8) & 255,
    n & 255,
  ];
  RGB_CACHE.set(hex, rgb);
  return rgb;
}

let audioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (!audioCtx)
    audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  return audioCtx;
}

function playJumpSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

function playGameOverSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

function playBoostSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {}
}

interface GameInternal {
  state: GameState;
  score: number;
  highScore: number;
  speed: number;
  orbY: number;
  orbVY: number;
  groundY: number;
  obstacles: Obstacle[];
  particles: Particle[];
  stars: Star[];
  frame: number;
  spawnTimer: number;
  nightMode: boolean;
  nightTimer: number;
  pulsePhase: number;
  boosted: boolean;
  boostGlow: number;
  boostMsg: string;
  boostMsgTimer: number;
  canvasW: number;
  canvasH: number;
  flashAlpha: number;
}

export const usePulseRunnerGame = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  boost: boolean,
  disabled: boolean,
) => {
  const gameRef = useRef<GameInternal>({
    state: "idle",
    score: 0,
    highScore: parseInt(localStorage.getItem("pulseRunnerHigh") || "0", 10),
    speed: BASE_SPEED,
    orbY: 0,
    orbVY: 0,
    groundY: 0,
    obstacles: [],
    particles: [],
    stars: [],
    frame: 0,
    spawnTimer: 0,
    nightMode: false,
    nightTimer: 0,
    pulsePhase: 0,
    boosted: false,
    boostGlow: 0,
    boostMsg: "",
    boostMsgTimer: 0,
    canvasW: 0,
    canvasH: 0,
    flashAlpha: 0,
  });
  const rafRef = useRef(0);
  const [displayState, setDisplayState] = useState<GameState>("idle");
  const [displayScore, setDisplayScore] = useState(0);
  const [displayHigh, setDisplayHigh] = useState(gameRef.current.highScore);

  const spawnStars = useCallback((w: number, h: number): Star[] => {
    const arr: Star[] = [];
    for (let i = 0; i < 60; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        brightness: Math.random(),
      });
    }
    return arr;
  }, []);

  const spawnParticles = useCallback(
    (x: number, y: number, count: number, hex: string) => {
      const [r, g, b] = hexToRgb(hex);
      const arr = gameRef.current.particles;
      for (let i = 0; i < count; i++) {
        arr.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1,
          size: Math.random() * 4 + 2,
          r,
          g,
          b,
        });
      }
    },
    [],
  );

  const spawnObstacle = useCallback(() => {
    const gm = gameRef.current;
    const types: Obstacle["type"][] = ["cube", "spike", "tall"];
    const type = types[Math.floor(Math.random() * types.length)];
    const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    let w = 20,
      h = 30;
    if (type === "cube") {
      w = 24;
      h = 24;
    }
    if (type === "spike") {
      w = 18;
      h = 36;
    }
    if (type === "tall") {
      w = 16;
      h = 50;
    }
    gm.obstacles.push({
      x: gm.canvasW + 20,
      y: gm.groundY - h,
      w,
      h,
      type,
      color,
    });
  }, []);

  const resetGame = useCallback(() => {
    const gm = gameRef.current;
    gm.score = 0;
    gm.speed = BASE_SPEED;
    gm.orbY = gm.groundY - ORB_RADIUS;
    gm.orbVY = 0;
    gm.obstacles = [];
    gm.particles = [];
    gm.frame = 0;
    gm.spawnTimer = 0;
    gm.nightMode = false;
    gm.nightTimer = 0;
    gm.boosted = false;
    gm.boostGlow = 0;
    gm.boostMsg = "";
    gm.boostMsgTimer = 0;
    gm.flashAlpha = 0;
  }, []);

  const startGame = useCallback(() => {
    if (disabled) return;
    resetGame();
    gameRef.current.state = "running";
    setDisplayState("running");
    setDisplayScore(0);
  }, [resetGame, disabled]);

  const gameOver = useCallback(() => {
    const gm = gameRef.current;
    gm.state = "over";
    setDisplayState("over");
    playGameOverSound();
    spawnParticles(60, gm.orbY, 20, NEON_MAGENTA);
    if (gm.score > gm.highScore) {
      gm.highScore = gm.score;
      localStorage.setItem("pulseRunnerHigh", String(gm.score));
      setDisplayHigh(gm.score);
    }
  }, [spawnParticles]);

  const jump = useCallback(() => {
    if (disabled) return;
    const gm = gameRef.current;
    if (gm.state === "idle") {
      startGame();
      return;
    }
    if (gm.state === "over") return;
    if (gm.orbY >= gm.groundY - ORB_RADIUS - 2) {
      gm.orbVY = JUMP_FORCE;
      playJumpSound();
      spawnParticles(60, gm.orbY + ORB_RADIUS, 8, NEON_CYAN);
    }
  }, [startGame, spawnParticles, disabled]);

  useEffect(() => {
    if (!boost || gameRef.current.boosted || disabled) return;
    const gm = gameRef.current;
    gm.boosted = true;

    const bonusPoints = 150;

    if (gm.state === "idle" || gm.state === "over") {
      resetGame();
      gm.state = "running";
      setDisplayState("running");
    }

    gm.score += bonusPoints;
    setDisplayScore(gm.score);
    gm.boostGlow = 180;
    gm.flashAlpha = 0.35;
    gm.boostMsg = `Conexão Estabelecida! +${bonusPoints}`;
    gm.boostMsgTimer = 150; // ~2.5s
    spawnParticles(60, gm.orbY, 40, "#ffd700");
    spawnParticles(80, gm.orbY - 10, 20, "#ffaa00");
    playBoostSound();
  }, [boost, spawnParticles, resetGame, disabled]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = 220;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const gm = gameRef.current;
      gm.canvasW = w;
      gm.canvasH = h;
      gm.groundY = h - GROUND_OFFSET;
      if (gm.orbY === 0) gm.orbY = gm.groundY - ORB_RADIUS;
      if (gm.stars.length === 0) gm.stars = spawnStars(w, h);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef, containerRef, spawnStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const gm = gameRef.current;
      const dpr = window.devicePixelRatio || 1;
      const W = gm.canvasW;
      const H = gm.canvasH;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = gm.nightMode ? "#0a0015" : "#0a0a0f";
      ctx.fillRect(0, 0, W, H);

      for (const s of gm.stars) {
        const twinkle =
          0.5 + 0.5 * Math.sin(gm.frame * 0.02 + s.brightness * 10);
        ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.8})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
        if (gm.state === "running") {
          s.x -= s.speed * (gm.speed / BASE_SPEED);
          if (s.x < 0) {
            s.x = W;
            s.y = Math.random() * H;
          }
        }
      }

      const groundGrad = ctx.createLinearGradient(0, gm.groundY, W, gm.groundY);
      groundGrad.addColorStop(0, NEON_CYAN);
      groundGrad.addColorStop(1, NEON_MAGENTA);
      ctx.strokeStyle = groundGrad;
      ctx.lineWidth = 2;
      ctx.shadowColor = NEON_CYAN;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, gm.groundY + ORB_RADIUS);
      ctx.lineTo(W, gm.groundY + ORB_RADIUS);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(0,245,255,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const lineY = gm.groundY + ORB_RADIUS + 8 + i * 10;
        if (lineY < H) {
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(W, lineY);
          ctx.stroke();
        }
      }

      if (gm.state === "running") {
        gm.frame++;
        gm.pulsePhase += 0.08;

        gm.score = Math.max(gm.score, Math.floor(gm.frame / 3));
        if (gm.frame % 9 === 0) setDisplayScore(gm.score);

        gm.speed =
          BASE_SPEED + Math.floor(gm.score / SPEED_INTERVAL) * SPEED_INCREMENT;

        gm.nightTimer++;
        if (gm.nightTimer > 1200 && !gm.nightMode && Math.random() < 0.002) {
          gm.nightMode = true;
          gm.nightTimer = 0;
        }
        if (gm.nightMode && gm.nightTimer > 180) {
          gm.nightMode = false;
          gm.nightTimer = 0;
        }

        gm.orbVY += GRAVITY;
        gm.orbY += gm.orbVY;
        if (gm.orbY >= gm.groundY - ORB_RADIUS) {
          gm.orbY = gm.groundY - ORB_RADIUS;
          gm.orbVY = 0;
        }

        gm.spawnTimer++;
        const minGap = Math.max(40, OBSTACLE_MIN_GAP - gm.speed * 3);
        if (gm.spawnTimer > minGap + Math.random() * 40) {
          spawnObstacle();
          gm.spawnTimer = 0;
        }

        for (const o of gm.obstacles) o.x -= gm.speed;
        gm.obstacles = gm.obstacles.filter((o) => o.x + o.w > -20);

        const orbX = 60;
        const orbTop = gm.orbY - ORB_RADIUS + 4;
        const orbBottom = gm.orbY + ORB_RADIUS - 4;
        const orbLeft = orbX - ORB_RADIUS + 4;
        const orbRight = orbX + ORB_RADIUS - 4;
        for (const o of gm.obstacles) {
          if (
            orbRight > o.x &&
            orbLeft < o.x + o.w &&
            orbBottom > o.y &&
            orbTop < o.y + o.h
          ) {
            gameOver();
            break;
          }
        }
      }

      for (const o of gm.obstacles) {
        ctx.shadowColor = o.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = o.color;
        if (o.type === "cube") {
          ctx.fillRect(o.x, o.y, o.w, o.h);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1;
          ctx.strokeRect(o.x, o.y, o.w, o.h);
        } else if (o.type === "spike") {
          ctx.beginPath();
          ctx.moveTo(o.x + o.w / 2, o.y);
          ctx.lineTo(o.x + o.w, o.y + o.h);
          ctx.lineTo(o.x, o.y + o.h);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(o.x, o.y, o.w, o.h);
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(o.x, o.y);
          ctx.lineTo(o.x + o.w, o.y + o.h);
          ctx.moveTo(o.x + o.w, o.y);
          ctx.lineTo(o.x, o.y + o.h);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      const orbX = 60;
      const pulseScale = 1 + 0.08 * Math.sin(gm.pulsePhase);
      const r = ORB_RADIUS * pulseScale;
      const hasBoostGlow = gm.boostGlow > 0;
      const extraBlur = hasBoostGlow ? 30 : 0;

      const orbGrad = ctx.createRadialGradient(
        orbX,
        gm.orbY,
        0,
        orbX,
        gm.orbY,
        r * 1.5,
      );
      if (hasBoostGlow) {
        orbGrad.addColorStop(0, "rgba(255,215,0,0.95)");
        orbGrad.addColorStop(0.3, "#ffd700");
        orbGrad.addColorStop(0.7, "#ffaa00");
        orbGrad.addColorStop(1, "rgba(255,170,0,0)");
      } else {
        orbGrad.addColorStop(0, "rgba(255,255,255,0.9)");
        orbGrad.addColorStop(0.3, NEON_CYAN);
        orbGrad.addColorStop(0.7, NEON_MAGENTA);
        orbGrad.addColorStop(1, "rgba(255,0,170,0)");
      }

      ctx.shadowColor = hasBoostGlow ? "#ffd700" : NEON_CYAN;
      ctx.shadowBlur = 20 + extraBlur;
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, gm.orbY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.arc(orbX - 4, gm.orbY - 4, r * 0.3, 0, Math.PI * 2);
      ctx.fill();

      if (hasBoostGlow) gm.boostGlow--;

      for (let i = gm.particles.length - 1; i >= 0; i--) {
        const p = gm.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life <= 0) {
          gm.particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
        const sz = p.size * p.life;
        ctx.fillRect(p.x, p.y, sz, sz);
      }
      ctx.globalAlpha = 1;

      if (gm.flashAlpha > 0) {
        ctx.fillStyle = `rgba(255,215,0,${gm.flashAlpha})`;
        ctx.fillRect(0, 0, W, H);
        gm.flashAlpha -= 0.008;
      }

      if (gm.boostMsgTimer > 0) {
        gm.boostMsgTimer--;
        const msgAlpha = Math.min(1, gm.boostMsgTimer / 30);
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(255,215,0,${msgAlpha})`;
        ctx.shadowColor = "#ffd700";
        ctx.shadowBlur = 12;
        ctx.fillText(gm.boostMsg, W / 2, H / 2 - 30);
        ctx.shadowBlur = 0;
      }

      if (gm.state === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, W, H);
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = NEON_CYAN;
        ctx.shadowColor = NEON_CYAN;
        ctx.shadowBlur = 15;
        ctx.fillText("PULSE RUNNER", W / 2, H / 2 - 20);
        ctx.shadowBlur = 0;
        ctx.font = "13px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText("ESPAÇO ou CLIQUE para pular", W / 2, H / 2 + 10);
      }

      if (gm.state === "over") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, W, H);
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = NEON_MAGENTA;
        ctx.shadowColor = NEON_MAGENTA;
        ctx.shadowBlur = 15;
        ctx.fillText("GAME OVER", W / 2, H / 2 - 10);
        ctx.shadowBlur = 0;
        ctx.font = "14px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText(`Score: ${gm.score}`, W / 2, H / 2 + 15);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasRef, gameOver, spawnObstacle]);

  useEffect(() => {
    if (disabled || displayState !== "running") return;
    const handleKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump, disabled, displayState]);

  return { displayState, displayScore, displayHigh, jump, startGame };
};
