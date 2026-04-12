import { motion } from "motion/react";
import { MapPin, Briefcase, Calendar } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import profilePhoto from "@/assets/profile-port.webp";
import { useGitHubData } from "../hooks/useGithubData";
import { GitHubContributionGraph } from "./GithubContributionGraph";

export const AboutSection = () => {
  const { t } = useTranslation();
  const { totalContributions, contributions } = useGitHubData();
  const timeline = t("about.timeline", { returnObjects: true }) as Array<{
    year: string;
    title: string;
    description: string;
  }>;

  return (
    <section data-testid="about-section" id="about" className="py-16 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative max-w-xs sm:max-w-md mx-auto w-full px-6 sm:px-0">
              <motion.div
                className="aspect-square max-md:aspect-auto rounded-2xl border-2 border-primary/30 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  data-testid="about-photo"
                  src={profilePhoto}
                  alt={t("about.photo_alt")}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                data-testid="about-badge-role"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -top-4 left-20 glass px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {t("about.badge_role")}
                </span>
              </motion.div>

              <motion.div
                data-testid="about-badge-open"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-4 -left-4 max-sm:left-0 glass px-4 py-2 rounded-full flex items-center gap-2 border border-green-500/30"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-green-400">
                  {t("about.badge_open")}
                </span>
              </motion.div>

              <motion.div
                data-testid="about-badge-location"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 -right-4 glass px-4 py-2 rounded-full flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">
                  {t("about.badge_location")}
                </span>
              </motion.div>
            </div>

            <div className="mt-12 w-full overflow-x-auto">
              <GitHubContributionGraph
                weeks={contributions}
                totalContributions={totalContributions}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center md:text-left">
              <span className="text-primary font-mono text-sm">
                {t("about.comment")}
              </span>
              <h2 data-testid="about-heading" className="text-4xl md:text-5xl font-bold mt-4">
                {t("about.title1")}{" "}
                <span className="text-gradient">{t("about.title2")}</span>
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground text-lg">
              <p data-testid="about-p1">
                <Trans
                  i18nKey="about.p1"
                  components={{ 1: <span className="text-foreground" /> }}
                />
              </p>
              <p data-testid="about-p2">
                <Trans
                  i18nKey="about.p2"
                  components={{ 1: <span className="text-cyan" /> }}
                />
              </p>
              <p data-testid="about-p3">
                <Trans
                  i18nKey="about.p3"
                  components={{ 1: <span className="text-magenta" /> }}
                />
              </p>
            </div>

            <div className="pt-8 border-t border-border/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {t("about.timeline_title")}
              </h3>
              <div data-testid="about-timeline" className="space-y-4">
                {timeline.map((item, index) => (
                  <motion.div
                    data-testid={`timeline-item-${item.year}`}
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 group max-sm:flex-col"
                  >
                    <div className="shrink-0 w-16">
                      <span
                        className={`font-mono text-sm ${index === 0 ? "text-cyan" : index === 1 ? "text-magenta" : "text-muted-foreground"}`}
                      >
                        {item.year}
                      </span>
                    </div>
                    <div className="flex-1 glass rounded-lg p-4 group-hover:border-primary/30 transition-colors">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
