import { useEffect, useRef, useCallback } from "react";

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isPointer = useRef(false);
  const isClicking = useRef(false);
  const rafId = useRef<number>(0);
  const visible = useRef(false);

  const loop = useCallback(() => {
    ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
    ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (dot && ring) {
      const dotScale = isClicking.current ? 0.5 : 1;
      dot.style.transform = `translate3d(${pos.current.x - 3}px, ${pos.current.y - 3}px, 0) scale(${dotScale})`;

      const ringScale = isPointer.current ? 1.6 : isClicking.current ? 0.6 : 1;
      const ringOpacity = isPointer.current ? 0.8 : 0.4;
      ring.style.transform = `translate3d(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px, 0) scale(${ringScale})`;
      ring.style.opacity = String(ringOpacity);
      ring.style.borderColor = isPointer.current
        ? "hsl(330 100% 50% / 0.6)"
        : "hsl(185 100% 50% / 0.4)";
    }

    rafId.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "0.4";
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
      }
      const target = e.target as HTMLElement;
      const computed = window.getComputedStyle(target);
      isPointer.current =
        computed.cursor === "pointer" ||
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null;
    };

    const onDown = () => {
      isClicking.current = true;
    };
    const onUp = () => {
      isClicking.current = false;
    };
    const onLeave = () => {
      visible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      visible.current = true;
      if (dotRef.current) dotRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    rafId.current = requestAnimationFrame(loop);

    return () => {
      document.body.style.cursor = "";
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [loop]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-9999"
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full bg-primary will-change-transform"
        style={{ width: 6, height: 6, opacity: 0, transition: "opacity 0.2s" }}
      />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 rounded-full border will-change-transform"
        style={{
          width: 32,
          height: 32,
          opacity: 0,
          transition: "opacity 0.2s, border-color 0.2s, transform 0.15s",
        }}
      />
    </div>
  );
};
