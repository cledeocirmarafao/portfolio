import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Linkedin,
  Github,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContactForm } from "./ContactForm";
import { LocationMap } from "./LocationMap";

const socialLinks = [
  {
    id: "email",
    icon: Mail,
    label: "Email",
    value: "cledeocirms96@gmail.com",
    href: "mailto:cledeocirms96@gmail.com",
  },
  {
    id: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
    value: "/in/cledeocirmarafao/",
    href: "https://www.linkedin.com/in/cledeocirmarafao/",
  },
  {
    id: "github",
    icon: Github,
    label: "GitHub",
    value: "@cledeocirmarafao",
    href: "https://github.com/cledeocirmarafao",
  },
  {
    id: "whatsapp",
    icon: MessageSquare,
    label: "WhatsApp",
    value: "+55 48 98866-9970",
    href: "https://wa.me/5548988669970",
  },
];

export const ContactSection = () => {
  const { t } = useTranslation();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-16 md:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <span
            data-testid="contact-comment"
            className="text-primary font-mono text-xs sm:text-sm"
          >
            {t("contact.comment")}
          </span>
          <h2
            data-testid="contact-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
          >
            {t("contact.title1")}{" "}
            <span className="text-gradient">{t("contact.title2")}</span>{" "}
            {t("contact.title3")}
          </h2>
          <p
            data-testid="contact-subtitle"
            className="text-muted-foreground mt-4 text-sm sm:text-base"
          >
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ContactForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {socialLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.label}
                  data-testid={`contact-social-item-${link.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-3 sm:p-6 flex flex-row items-center justify-between group hover:border-primary/30 transition-all card-hover gap-2 sm:gap-3"
                >
                  <a
                    data-testid={`contact-social-link-${link.id}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">
                        {link.label}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {link.value}
                      </p>
                    </div>
                  </a>
                  <button
                    data-testid={`contact-copy-btn-${link.id}`}
                    onClick={() => handleCopy(link.value, i)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </motion.div>
              );
            })}
            <LocationMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
};