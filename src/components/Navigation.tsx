import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "./ui/LanguageToggle";

const navKeys = [
  { key: "nav.home", href: "hero" },
  { key: "nav.projects", href: "projects" },
  { key: "nav.skills", href: "skills" },
  { key: "nav.about", href: "about" },
  { key: "nav.contact", href: "contact" },
];

export const Navigation = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [hidden, setHidden] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 50);
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const sectionIds = navKeys.map((i) => i.href);

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.3;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const timeout = setTimeout(handleScroll, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.div
        data-testid="progress-bar"
        className="fixed top-0 left-0 right-0 h-0.5 bg-cyber-gradient origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.nav
        data-testid="navbar"
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "glass-strong py-3" : "py-6"}`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.a
            data-testid="nav-logo"
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
            className="text-2xl font-bold text-gradient"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            &lt;MarafaDev/&gt;
          </motion.a>

          <div
            data-testid="nav-desktop"
            className="hidden md:flex items-center gap-8"
          >
            {navKeys.map((i) => (
              <motion.a
                data-testid={`nav-link-desktop-${i.href}`}
                key={i.href}
                href={`#${i.href}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(`#${i.href}`);
                }}
                className={`relative font-medium text-sm transition-colors ${activeSection === i.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t(i.key)}
                {activeSection === i.href && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyber-gradient"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          <LanguageToggle className="hidden md:flex" />

          <motion.button
            data-testid="nav-mobile-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            data-testid="nav-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 glass-strong md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navKeys.map((i, index) => (
                <motion.a
                  data-testid={`nav-link-${i.href}`}
                  key={i.href}
                  href={`#${i.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(`#${i.href}`);
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${activeSection === i.href ? "text-primary" : "text-muted-foreground hover:text-foreground"} relative`}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(i.key)}
                  {activeSection === i.href && (
                    <motion.div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyber-gradient" />
                  )}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <LanguageToggle className="text-lg" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
