import { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { RotateCcw, Play } from "lucide-react";
import { Button } from "./ui/Button";
import { usePulseRunnerGame } from "@/hooks/usePulseRunnerGame";

interface PulseRunnerProps {
  boost?: boolean;
  disabled?: boolean;
}

export const PulseRunner = ({
  boost = false,
  disabled = false,
}: PulseRunnerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const { displayState, displayScore, displayHigh, jump, startGame } =
    usePulseRunnerGame(canvasRef, containerRef, boost, disabled);

  const handleCanvasClick = useCallback(() => {
    if (!disabled) jump();
  }, [jump, disabled]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-8"
    >
      <div
        data-testid="pulse-runner-wrapper"
        className={`glass rounded-2xl p-4 border border-primary/20 relative overflow-hidden mx-5 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
            <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
              Pulse Runner
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="text-muted-foreground">
              Score:{" "}
              <span
                data-testid="pulse-runner-score"
                className="text-foreground font-bold"
              >
                {String(displayScore).padStart(5, "0")}
              </span>
            </span>
            <span className="text-muted-foreground">
              Best:{" "}
              <span
                data-testid="pulse-runner-high"
                className="text-[hsl(var(--primary))] font-bold"
              >
                {String(displayHigh).padStart(5, "0")}
              </span>
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="w-full rounded-lg overflow-hidden cursor-pointer"
          onClick={handleCanvasClick}
        >
          <canvas
            data-testid="pulse-runner-canvas"
            ref={canvasRef}
            className="block w-full"
            aria-label="Pulse Runner - mini-game estilo endless runner. Pressione Espaço ou clique para pular."
            role="img"
            tabIndex={disabled ? -1 : 0}
          />
        </div>
        {displayState === "over" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mt-3"
          >
            <Button
              data-testid="pulse-runner-restart-btn"
              onClick={startGame}
              variant="outline"
              size="sm"
              className="font-mono text-xs border-primary/30 hover:bg-primary/10"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> {t("pulse_runner.restart")}
            </Button>
          </motion.div>
        )}

        {displayState === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-3"
          >
            <Button
              data-testid="pulse-runner-play-btn"
              onClick={startGame}
              variant="outline"
              size="sm"
              className="font-mono text-xs border-primary/30 hover:bg-primary/10"
            >
              <Play className="w-3 h-3 mr-1" /> {t("pulse_runner.play")}
            </Button>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-center px-5"
      >
        <span
          data-testid="pulse-runner-hint"
          className="text-gradient text-sm md:text-base leading-relaxed"
        >
          {t("pulse_runner.hint")}
        </span>
      </motion.div>
    </motion.div>
  );
};
