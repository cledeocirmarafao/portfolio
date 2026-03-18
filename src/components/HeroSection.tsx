import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import { ScrollIndicator } from "./ui/ScrollIndicator";

const Scene3D = lazy(() => import("./Scene3D"));

export const HeroSection = () => {
  const { t } = useTranslation();

  const handleScrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      data-testid="hero-section"
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden max-w-full pt-20 sm:pt-0 lg:pt-0"
    >
      <Suspense fallback={null}><Scene3D/></Suspense>
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              data-testid="hero-role-badge"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">
                {t("hero.role")}
              </span>
            </motion.div>

            <motion.h1
              data-testid="hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[1.75rem] sm:text-5xl lg:text-7xl font-bold leading-tight"
            >
              {t("hero.headline1")}{" "}
              <span className="text-gradient">{t("hero.headline2")}</span>
              <br />
              {t("hero.headline3")}{" "}
              <span className="relative">
                {t("hero.headline4")}
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 w-full bg-cyber-gradient"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>
            </motion.h1>

            <motion.p
              data-testid="hero-tagline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm sm:text-lg text-muted-foreground max-w-xl"
            >
              {t("hero.tagline1")}
              <br />
              {t("hero.tagline2")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button
                data-testid="hero-cta-projects"
                size={"lg"}
                className="bg-cyber-gradient hover:opacity-90 text-primary-foreground font-semibold group cursor-pointer text-sm sm:text-base max-sm:h-7"
                onClick={handleScrollToProjects}
              >
                {t("hero.cta_projects")}
                <ExternalLink className="ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                data-testid="hero-cta-cv"
                size={"lg"}
                variant={"outline"}
                className="border-primary/50 text-primary hover:bg-primary/10 group cursor-pointer text-sm sm:text-base max-sm:h-7"
                asChild
              >
                <a href="/public/assets/curriculum.pdf" download>
                  {t("hero.cta_cv")}
                  <Download className="ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </Button>
            </motion.div>

            <ScrollIndicator className="flex sm:hidden" />

            <motion.div
              data-testid="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex gap-8 pt-8 border-t border-border/50 max-sm:justify-center"
            >
              {[
                { value: "25+", label: t("hero.stat_repos") },
                { value: "1000+", label: t("hero.stat_contributions") },
                { value: "1+", label: t("hero.stat_years") },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-xl sm:text-3xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            data-testid="hero-code-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 hidden lg:block perspective-midrange"
           >
            <motion.div
              className="glass rounded-2xl p-6 border-glow"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
              }}
              style={{
                transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-xs text-muted-foreground font-mono">
                  {t("hero.code_file")}
                </span>
              </div>
              <pre className="font-mono text-sm leading-relaxed">
                <code>
                  <span className="text-magenta">const</span>{" "}
                  <span className="text-foreground">developer</span>{" "}
                  <span className="text-muted-foreground">=</span> {"{"}
                  {"\n"}  <span className="text-cyan">name</span>:{" "}
                  <span className="text-green-400">"Cledeocir Marafão"</span>,
                  {"\n"}  <span className="text-cyan">github</span>:{" "}
                  <span className="text-green-400">"@cledeocirmarafao"</span>,
                  {"\n"}  <span className="text-cyan">skills</span>: [
                  {"\n"}    <span className="text-green-400">"TypeScript"</span>,
                  {"\n"}    <span className="text-green-400">"React"</span>,
                  {"\n"}    <span className="text-green-400">"TailwindCSS"</span>
                  {"\n"}  ],
                  {"\n"}  <span className="text-cyan">repos</span>:{" "}
                  <span className="text-yellow-400">25+</span>,
                  {"\n"}  <span className="text-cyan">available</span>:{" "}
                  <span className="text-magenta">true</span>
                  {"\n"}
                  {"}"};
                </code>
              </pre>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ScrollIndicator className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex" />
    </section>
  );
};
