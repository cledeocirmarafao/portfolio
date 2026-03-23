import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiHtml5,
  SiVite,
  SiJest,
  SiVitest,
  SiReactrouter,
  SiAxios,
  SiTestinglibrary,
  SiFastapi,
  SiThreedotjs,
  SiN8N,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa6";

const technologies = [
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "CSS", icon: FaCss3Alt, color: "#1572B6" },
  { name: "HTML", icon: SiHtml5, color: "#E34F26" },
  { name: "n8n", icon: SiN8N, color: "#EA4B71" },
  { name: "Vite", icon: SiVite, color: "#646CFF" },
  { name: "Jest", icon: SiJest, color: "#C21325" },
  { name: "Vitest", icon: SiVitest, color: "#6E9F18" },
  { name: "React Router", icon: SiReactrouter, color: "#CA4245" },
  { name: "Axios", icon: SiAxios, color: "#5A29E4" },
  { name: "Testing Library", icon: SiTestinglibrary, color: "#E33332" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  { name: "Three.js", icon: SiThreedotjs, color: "#0c2ccc" },
];

export const HardSkillsSection = () => {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const duplicatedTechs = [...technologies, ...technologies, ...technologies];

  return (
    <section
      data-testid="skills-section"
      id="skills"
      className="pt-30 relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          data-testid="skills-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-mono text-sm">
            {t("skills.comment")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
            {t("skills.title1")}{" "}
            <span className="text-gradient">{t("skills.title2")}</span>
          </h2>
        </motion.div>

        <div
          data-testid="skills-carousel"
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
            className="flex items-center gap-12 animate-scroll-left"
            style={{
              width: "fit-content",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicatedTechs.map((tech, index) => {
              const Icon = tech.icon;
              const isHovered = hoveredIndex === index;
              const actualIndex = index % technologies.length;
              const isAnyInstanceHovered =
                hoveredIndex !== null &&
                hoveredIndex % technologies.length === actualIndex;
              return (
                <motion.div
                  data-testid={`skill-item-${tech.name.toLowerCase().replace(/\s/g, "-")}`}
                  key={`${tech.name}-${index}`}
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
                        ? tech.color
                        : "hsl(var(--muted-foreground))",
                      filter: isHovered
                        ? `drop-shadow(0 0 8px ${tech.color})`
                        : "none",
                    }}
                  />
                  <span
                    className={`font-mono text-sm whitespace-nowrap transition-all duration-300 ${isHovered ? "text-foreground" : "text-muted-foreground/60"}`}
                    style={{
                      textShadow: isHovered ? `0 0 10px ${tech.color}` : "none",
                    }}
                  >
                    {tech.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.p
          data-testid="skills-hint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground/60 text-sm mt-8 font-mono"
        >
          {t("skills.hint")}
        </motion.p>
      </div>
    </section>
  );
};
