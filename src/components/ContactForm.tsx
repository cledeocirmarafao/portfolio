import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useTranslation } from "react-i18next";
import { useContactForm } from "@/hooks/useContactForm";
import { lazy, Suspense } from "react";

const PulseRunner = lazy(() =>
  import("./PulseRunner").then((m) => ({ default: m.PulseRunner })),
);

export const ContactForm = () => {
  const { t } = useTranslation();
  const {
    formRef,
    formData,
    isSubmitting,
    status,
    gameBoost,
    updateField,
    handleSubmit,
  } = useContactForm();

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-8 space-y-6"
      >
        <div className="space-y-2">
          <label
            data-testid="contact-label-name"
            className="text-sm font-medium"
          >
            {t("contact.label_name")}
          </label>
          <Input
            data-testid="contact-input-name"
            name="from_name"
            value={formData.from_name}
            onChange={(e) => updateField("from_name", e.target.value)}
            placeholder={t("contact.placeholder_name")}
            required
            className="bg-muted/50 border-border focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label
            data-testid="contact-label-email"
            className="text-sm font-medium"
          >
            {t("contact.label_email")}
          </label>
          <Input
            data-testid="contact-input-email"
            name="from_email"
            type="email"
            value={formData.from_email}
            onChange={(e) => updateField("from_email", e.target.value)}
            placeholder={t("contact.placeholder_email")}
            required
            className="bg-muted/50 border-border focus:border-primary transition-colors"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <label
              data-testid="contact-label-message"
              className="text-sm font-medium"
            >
              {t("contact.label_message")}
            </label>
            <span
              data-testid="contact-message-counter"
              className="text-xs text-muted-foreground"
            >
              {formData.message.length}/500
            </span>
          </div>
          <Textarea
            data-testid="contact-input-message"
            name="message"
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder={t("contact.placeholder_message")}
            required
            rows={5}
            className="bg-muted/50 border-border focus:border-primary transition-colors resize-none"
          />
        </div>

        <AnimatePresence>
          {status === "success" && (
            <motion.div
              data-testid="contact-status-success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border border-green-500/30 p-3 text-center"
            >
              <p className="text-sm font-medium text-green-400">
                ✅ {t("contact.toast_title", "Mensagem enviada com sucesso!")}
              </p>
              <p className="text-xs text-green-400/70 mt-1">
                {t("contact.toast_description", "Retornarei em breve.")}
              </p>
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              data-testid="contact-status-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-center"
            >
              <p className="text-sm font-medium text-destructive">
                ❌ Erro ao enviar. Tente novamente.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          data-testid="contact-submit-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyber-gradient hover:opacity-90 font-semibold cursor-pointer"
          size={"lg"}
        >
          {isSubmitting ? (
            <motion.div
              data-testid="contact-submit-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
            />
          ) : (
            <>
              {t("contact.submit")} <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <Suspense fallback={null}>
        <PulseRunner boost={gameBoost} />
      </Suspense>
    </>
  );
};
