import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "motion/react";
import { IntroAnimation } from "@/components/IntroAnimation";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";

const ProjectsSection = lazy(() =>
  import("@/components/ProjectsSection").then((m) => ({
    default: m.ProjectsSection,
  })),
);
const SkillsSection = lazy(() =>
  import("@/components/HardSkillsSection").then((m) => ({
    default: m.HardSkillsSection,
  })),
);
const SoftSkillsSection = lazy(() =>
  import("@/components/SoftSkillsSection").then((m) => ({
    default: m.SoftSkillsSection,
  })),
);
const AboutSection = lazy(() =>
  import("@/components/AboutSection").then((m) => ({
    default: m.AboutSection,
  })),
);
const ContactSection = lazy(() =>
  import("@/components/ContactSection").then((m) => ({
    default: m.ContactSection,
  })),
);
const Footer = lazy(() =>
  import("@/components/Footer").then((m) => ({ default: m.Footer })),
);
const ChatBot = lazy(() =>
  import("@/components/ChatBot").then((m) => ({ default: m.ChatBot })),
);

export const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setShowIntro(false);
      setContentReady(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setContentReady(true);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      {contentReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Navigation />
          <main>
            <HeroSection />
            <Suspense fallback={null}>
              <ProjectsSection />
              <SkillsSection />
              <SoftSkillsSection />
              <AboutSection />
              <ContactSection />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
            <ChatBot />
          </Suspense>
        </motion.div>
      )}
    </>
  );
};
