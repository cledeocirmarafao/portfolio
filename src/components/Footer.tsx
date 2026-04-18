import { motion } from "motion/react";
import { Github, Linkedin, ArrowUp, Heart, Coffee } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const socialLinks = [
  {
    id: "github",
    icon: Github,
    href: "https://github.com/cledeocirmarafao",
    label: "GitHub",
  },
  {
    id: "linkedin",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/cledeocirmarafao/",
    label: "LinkedIn",
  },
  {
    id: "discord",
    icon: FaDiscord,
    href: "https://discord.com/users/1410185695661916181",
    label: "Discord",
  },
];

export const Footer = () => {
  const { t } = useTranslation();
  const footerLinks = [
    { label: t("nav.home"), href: "#hero" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      data-testid="footer-section"
      className="relative pt-20 pb-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-t from-card to-background" />
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <a
              data-testid="footer-logo"
              href="#hero"
              className="font-display text-3xl font-bold text-gradient"
            >
              &lt;MarafaDev/&gt;
            </a>
            <p
              data-testid="footer-description"
              className="text-muted-foreground"
            >
              {t("footer.description1")}
              <br />
              {t("footer.description2")}
            </p>
            <p
              data-testid="footer-location"
              className="text-sm text-muted-foreground flex items-center gap-1"
            >
              {t("footer.location")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3
              data-testid="footer-quick-links-title"
              className="text-lg font-bold mb-4"
            >
              {t("footer.quick_links")}
            </h3>
            <ul data-testid="footer-nav-links" className="space-y-2">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <a
                    data-testid={"footer-nav-link-" + l.href.replace("#", "")}
                    href={l.href}
                    className="text-muted-foreground hover:text-primary transition-colors link-underline"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .querySelector(l.href)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3
              data-testid="footer-social-title"
              className="text-lg font-bold mb-4"
            >
              {t("footer.social")}
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((l) => {
                const Icon = l.icon;
                return (
                  <motion.a
                    key={l.label}
                    data-testid={"footer-social-link-" + l.id}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={l.label}
                    className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            data-testid="footer-copyright"
            className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 flex-wrap justify-center"
          >
            {t("footer.copyright")}
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-secondary fill-secondary shrink-0" />
            <span className="whitespace-nowrap">{t("footer.and")}</span>
            <Coffee className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="whitespace-nowrap">{t("footer.in_floripa")}</span>
          </p>
          <motion.button
            data-testid="footer-scroll-top"
            onClick={scrollToTop}
            className="w-10 h-10 -translate-x-20 max-sm:translate-x-0 rounded-xl glass flex items-center justify-center text-primary hover:bg-primary/10 transition-all cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};