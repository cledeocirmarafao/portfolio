import { useMemo } from "react";
import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import project1Img from "@/assets/project-1.webp";
import project2Img from "@/assets/project-2.webp";
import project3Img from "@/assets/project-3.webp";
import project4Img from "@/assets/project-4.webp";

function BubbleTech({ name, index }: { name: string; index: number }) {
  const instances = useMemo(() => {
    return Array.from({ length: 1 }, () => ({
      left: `${5 + Math.random() * 80}%`,
      delay: index * 2.5 + Math.random() * 1,
      duration: 8 + Math.random() * 3,
    }));
  }, [index]);

  return (
    <>
      {instances.map((inst, i) => (
        <motion.span
          key={i}
          className="absolute text-xs font-mono text-foreground/80 pointer-events-none whitespace-nowrap"
          style={{ left: inst.left, bottom: "-4px" }}
          animate={{ y: [0, -300], opacity: [0, 0.8, 0.7, 0] }}
          transition={{
            duration: inst.duration,
            delay: inst.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {name}
        </motion.span>
      ))}
    </>
  );
}

const projectMeta = [
  {
    id: "01",
    tech: ["TypeScript", "React", "N8n", "Jest", "Tailwind"],
    color: "cyan",
    image: project1Img,
    github: "https://github.com/cledeocirmarafao/animated-background",
    demo: "https://animated-background-pi.vercel.app/",
  },
  {
    id: "02",
    tech: ["TypeScript", "React", "React Router", "Vitest", "Tailwind"],
    color: "magenta",
    image: project2Img,
    github: "https://github.com/cledeocirmarafao/pokedex",
    demo: "https://poke-gotta-catch.vercel.app/",
  },
  {
    id: "03",
    tech: ["JavaScript", "CSS", "HTML", "N8n", "Gemini"],
    color: "cyan",
    image: project3Img,
    github: "https://github.com/cledeocirmarafao/project-cineai",
    demo: "https://cledeocirmarafao.github.io/project-cineai/",
  },
  {
    id: "04",
    tech: ["JavaScript", "CSS", "HTML", "GitFlow"],
    color: "magenta",
    image: project4Img,
    github: "https://github.com/ipierette/lovecats",
    demo: "https://team-lovecats.netlify.app/",
  },
];

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const items = t("projects.items", { returnObjects: true }) as Array<{
    title: string;
    category: string;
    description: string;
  }>;

  return (
    <section
      data-testid="projects-section"
      id="projects"
      className="py-16 md:py-32 relative"
    >
      <div className="container mx-auto px-6">
        <motion.div
          data-testid="projects-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-primary font-mono text-sm">
            {t("projects.comment")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            {t("projects.title1")}{" "}
            <span className="text-gradient">{t("projects.title2")}</span>
          </h2>
        </motion.div>

        <div className="space-y-32">
          {projectMeta.map((project, i) => {
            const item = items[i];
            const isReversed = i % 2 === 1;

            return (
              <motion.div
                data-testid={`project-card-${project.id}`}
                key={project.id}
                initial={{ opacity: 0, x: isReversed ? 100 : -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <motion.div
                  data-testid={`project-image-${project.id}`}
                  className={`relative group ${isReversed ? "lg:order-2" : "lg:order-1"}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`aspect-video rounded-2xl overflow-hidden glass border ${
                      project.color === "cyan"
                        ? "border-glow"
                        : "border-glow-magenta"
                    }`}
                  >
                    <div className="w-full h-full relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={item?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-background/20" />
                      {project.tech.map((tech, i) => (
                        <BubbleTech
                          key={`${tech}-${i}`}
                          name={tech}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                <div
                  data-testid={`project-content-${project.id}`}
                  className={`space-y-6 ${isReversed ? "lg:order-1" : "lg:order-2"}`}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <span
                      className={`text-6xl font-bold ${
                        project.color === "cyan"
                          ? "text-cyan/30"
                          : "text-magenta/30"
                      }`}
                    >
                      {project.id}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.color === "cyan"
                          ? "bg-cyan/10 text-cyan border border-cyan/30"
                          : "bg-magenta/10 text-magenta border border-magenta/30"
                      }`}
                    >
                      {item?.category}
                    </span>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold"
                  >
                    {item?.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-lg"
                  >
                    {item?.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-2"
                  >
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + techIndex * 0.1 }}
                        className={`px-3 py-1 glass rounded-lg text-xs text-foreground/80 transition-colors cursor-default
                        ${techIndex % 2 === 0 ? "hover:text-cyan" : "hover:text-magenta"}`}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 pt-4"
                  >
                    <Button
                      data-testid={`project-demo-${project.id}`}
                      size="lg"
                      className="bg-cyber-gradient hover:opacity-80 text-primary-foreground font-semibold max-sm:h-8"
                      asChild
                    >
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {t("projects.live_demo")}
                      </a>
                    </Button>
                    <Button
                      data-testid={`project-code-${project.id}`}
                      variant="outline"
                      className="border-border hover:border-primary hover:text-primary max-sm:h-8.5 sm:h-11.5"
                      asChild
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        {t("projects.view_code")}
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center mt-20"
        >
          <motion.a
            data-testid="projects-github-link"
            href="https://github.com/cledeocirmarafao"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 glass rounded-full border border-border hover:border-primary/50 transition-colors text-sm sm:text-base"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/80 group-hover:text-primary transition-colors" />
            <span className="text-foreground/80 group-hover:text-primary font-medium transition-colors">
              {t("projects.see_more_github")}
            </span>
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              className="text-foreground/60"
            >
              <ExternalLink className="w-4 h-4" />
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
