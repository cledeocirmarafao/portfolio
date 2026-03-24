import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Users,
  Lightbulb,
  BookOpen,
  Eye,
  Compass,
  Shuffle,
  Rocket,
  Brain,
  Target,
  Shield,
  Glasses,
} from "lucide-react";

const softSkills = [
  { key: "communication", icon: MessageCircle },
  { key: "teamwork", icon: Users },
  { key: "problem_solving", icon: Lightbulb },
  { key: "continuous_learning", icon: BookOpen },
  { key: "attention_detail", icon: Eye },
  { key: "autonomy", icon: Compass },
  { key: "adaptability", icon: Shuffle },
  { key: "proactivity", icon: Rocket },
  { key: "critical_thinking", icon: Brain },
  { key: "delivery_focus", icon: Target },
  { key: "resilience", icon: Shield },
  { key: "product_vision", icon: Glasses },
];

export const SoftSkillsSection = () => {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const duplicated = [...softSkills, ...softSkills, ...softSkills];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          data-testid="soft-skills-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-mono text-sm">
            {t("soft_skills.comment")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
            {t("soft_skills.title1")}{" "}
            <span className="text-gradient">{t("soft_skills.title2")}</span>
          </h2>
        </motion.div>

        <div
          data-testid="soft-skills-carousel"
          className="relative overflow-hidden py-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setHoveredIndex(null);
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
          <div
            data-testid="soft-skills-scroll"
            className="flex items-center gap-12 animate-scroll-right"
            style={{
              width: "fit-content",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicated.map((skill, index) => {
              const Icon = skill.icon;
              const isHovered = hoveredIndex === index;
              const actualIndex = index % softSkills.length;
              const isAnyInstanceHovered =
                hoveredIndex !== null &&
                hoveredIndex % softSkills.length === actualIndex;
              const isCyan = actualIndex % 2 === 0;
              const pulseColor = isCyan ? "var(--cyan)" : "var(--magenta)";

              return (
                <motion.div
                  data-testid={`soft-skill-item-${skill.key}`}
                  key={`${skill.key}-${index}`}
                  className="shrink-0 flex items-center gap-2 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    scale: isHovered ? 1.1 : isAnyInstanceHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    className="w-5 h-5 transition-all duration-300"
                    style={{
                      color: isHovered
                        ? pulseColor
                        : "hsl(var(--muted-foreground))",
                      filter: isHovered
                        ? `drop-shadow(0 0 8px ${pulseColor})`
                        : "none",
                      animation: isHovered
                        ? `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                        : "none",
                    }}
                  />
                  <span
                    className={`font-mono text-sm whitespace-nowrap transition-all duration-300 ${isHovered ? "text-foreground" : "text-muted-foreground/60"}`}
                    style={{
                      textShadow: isHovered ? `0 0 10px ${pulseColor}` : "none",
                    }}
                  >
                    {t(`soft_skills.items.${skill.key}`)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.p
          data-testid="soft-skills-hint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground/60 text-sm mt-8 font-mono"
        >
          {t("soft_skills.hint")}
        </motion.p>
      </div>
    </section>
  );
};
