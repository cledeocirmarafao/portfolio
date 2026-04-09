import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

interface FormData {
  from_name: string;
  from_email: string;
  message: string;
}

export const useContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    from_name: "",
    from_email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [gameBoost, setGameBoost] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    const sanitized = field === "message" ? value.slice(0, 500) : value;
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    try {
      await emailjs.sendForm(
        "service_7krxxe8",
        "template_w3souss",
        formRef.current!,
        "GsWBXK5donIUZElAZ",
      );
      setStatus("success");
      setFormData({ from_name: "", from_email: "", message: "" });
      setGameBoost(true);
      setTimeout(() => setGameBoost(false), 1000);
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    formRef,
    formData,
    isSubmitting,
    status,
    gameBoost,
    updateField,
    handleSubmit,
  };
};
