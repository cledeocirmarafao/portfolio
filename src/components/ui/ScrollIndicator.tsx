import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ScrollIndicatorProps {
  className?: string;
}

export const ScrollIndicator = ({ className = "" }: ScrollIndicatorProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className={`flex flex-col items-center gap-1 ${className}`}
    >
      <span className="text-xs text-muted-foreground font-mono">
        {t("hero.scroll")}
      </span>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ArrowDown className="w-5 h-5 text-primary" />
      </motion.div>
    </motion.div>
  );
};
