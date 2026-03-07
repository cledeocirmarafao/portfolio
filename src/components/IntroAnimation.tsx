import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const { t } = useTranslation();
  const stages = [
    { text: t("intro.stage1"), duration: 1200 },
    { text: t("intro.stage2"), duration: 1000 },
    { text: t("intro.stage3"), duration: 800 },
  ];

  const [currentStage, setCurrentStage] = useState(0);
  const [displayedName, setDisplayedName] = useState("");
  const [showStages, setShowStages] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const fullName = "DEV PORTFÓLIO";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullName.length) {
        setDisplayedName(fullName.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowStages(true), 100);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showStages) return;
    if (currentStage < stages.length) {
      const timer = setTimeout(
        () => setCurrentStage((prev) => prev + 1),
        stages[currentStage].duration,
      );
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 500);
      }, 150);
    }
  }, [showStages, currentStage, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-5 flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0  grid-pattern opacity-20" />
          <motion.div
            className="relative mb-8 inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className=" text-[clamp(2rem,5vw,6rem)] font-bold tracking-wider">
              <span className="text-gradient">{displayedName}</span>
              <span className="text-primary cursor-blink">_</span>
            </h1>
            <motion.span
              className="absolute text-[clamp(2rem,5vw,6rem)] inline-block inset-0 font-bold tracking-wider text-cyan opacity-50 "
              animate={{ x: [0, -2, 2, 0], opacity: [0.5, 0.3, 0.5] }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              aria-hidden="true"
            >
              {displayedName}
            </motion.span>
            <motion.span
              className="absolute inset-0 text-[clamp(2rem,5vw,6rem)] font-bold tracking-wider text-magenta opacity-50 "
              animate={{ x: [0, 2, -2, 0], opacity: [0.5, 0.3, 0.5] }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.1,
              }}
              aria-hidden="true"
            >
              {displayedName}
            </motion.span>
          </motion.div>
          <AnimatePresence mode="wait">
            {showStages && currentStage < stages.length && (
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground font-mono text-[clamp(0.8rem,3vw,1.1rem)]"
              >
                <span className="text-primary">{">"}</span>{" "}
                {stages[currentStage].text}
                <span className="cursor-blink"> |</span>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            className="absolute bottom-40 w-64 h-1 bg-muted rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-cyber-gradient"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
            />
          </motion.div>
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-secondary/50" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-secondary/50" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
