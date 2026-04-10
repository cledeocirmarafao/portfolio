import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ContactForm } from "./ContactForm";

vi.mock("@/hooks/useContactForm", () => ({
  useContactForm: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      const translations: Record<string, string> = {
        "contact.label_name": "Nome",
        "contact.label_email": "E-mail",
        "contact.label_message": "Mensagem",
        "contact.placeholder_name": "Seu nome",
        "contact.placeholder_email": "seu@email.com",
        "contact.placeholder_message": "Sua mensagem...",
        "contact.submit": "Enviar",
        "contact.toast_title": "Mensagem enviada com sucesso!",
        "contact.toast_description": "Retornarei em breve.",
      };
      if (!(key in translations)) return fallback ?? key;
      return translations[key];
    },
    i18n: { changeLanguage: vi.fn(), language: "pt" },
  }),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("lucide-react", () => ({
  Send: () => <svg data-testid="icon-send" />,
}));

vi.mock("./PulseRunner", () => ({
  PulseRunner: ({ boost }: { boost: boolean }) => (
    <div data-testid="pulse-runner-mock" data-boost={boost} />
  ),
}));

import { useContactForm } from "@/hooks/useContactForm";

const mockUseContactForm = vi.mocked(useContactForm);

const mockForm = (overrides = {}) =>
  mockUseContactForm.mockReturnValue({
    formRef: { current: null },
    formData: { from_name: "", from_email: "", message: "" },
    isSubmitting: false,
    status: "idle",
    gameBoost: false,
    updateField: vi.fn(),
    handleSubmit: vi.fn(),
    ...overrides,
  });

beforeEach(() => {
  vi.clearAllMocks();
  mockForm();
});

describe("ContactForm", () => {
  it("deve renderizar sem quebrar", () => {
    render(<ContactForm />);
    expect(document.body).toBeInTheDocument();
  });

  it("deve renderizar o campo de nome", () => {
    render(<ContactForm />);
    expect(screen.getByTestId("contact-label-name")).toBeInTheDocument();
  });

  it("deve renderizar o campo de email", () => {
    render(<ContactForm />);
    expect(screen.getByTestId("contact-label-email")).toBeInTheDocument();
  });

  it("deve renderizar o campo de mensagem", () => {
    render(<ContactForm />);
    expect(screen.getByTestId("contact-label-message")).toBeInTheDocument();
  });

  it("deve renderizar o botão de submit com o conteúdo correto", () => {
    render(<ContactForm />);
    const button = screen.getByTestId("contact-submit-btn");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Enviar");
  });

  it("deve renderizar o contador de caracteres da mensagem", () => {
    mockForm({
      formData: { from_name: "", from_email: "", message: "Olá, Cledeocir!" },
    });
    render(<ContactForm />);
    expect(screen.getByTestId("contact-message-counter")).toHaveTextContent(
      "15/500",
    );
  });

  it("deve renderizar o label do nome", () => {
    render(<ContactForm />);
    expect(screen.getByTestId("contact-label-name")).toHaveTextContent("Nome");
  });

  it("deve renderizar o label do email", () => {
    render(<ContactForm />);
    expect(screen.getByTestId("contact-label-email")).toHaveTextContent(
      "E-mail",
    );
  });

  it("deve renderizar o label da mensagem", () => {
    render(<ContactForm />);
    expect(screen.getByTestId("contact-label-message")).toHaveTextContent(
      "Mensagem",
    );
  });

  it("não deve renderizar feedback quando status é idle", () => {
    render(<ContactForm />);
    expect(
      screen.queryByTestId("contact-status-success"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("contact-status-error"),
    ).not.toBeInTheDocument();
  });

  it("deve renderizar o feedback de sucesso", () => {
    mockForm({ status: "success" });
    render(<ContactForm />);
    const successEl = screen.getByTestId("contact-status-success");
    expect(successEl).toBeInTheDocument();
    expect(successEl).toHaveTextContent("Mensagem enviada com sucesso!");
  });

  it("deve renderizar o feedback de erro", () => {
    mockForm({ status: "error" });
    render(<ContactForm />);
    const errorEl = screen.getByTestId("contact-status-error");
    expect(errorEl).toBeInTheDocument();
    expect(errorEl).toHaveTextContent("Erro ao enviar. Tente novamente.");
  });

  it("botão deve estar desabilitado quando isSubmitting", () => {
    mockForm({ isSubmitting: true });
    render(<ContactForm />);
    expect(screen.getByTestId("contact-submit-btn")).toBeDisabled();
  });

  it("botão não deve estar desabilitado quando não isSubmitting", () => {
    render(<ContactForm />);
    expect(screen.getByTestId("contact-submit-btn")).not.toBeDisabled();
  });

  it("deve renderizar o spinner quando isSubmitting", () => {
    mockForm({ isSubmitting: true });
    render(<ContactForm />);
    expect(screen.getByTestId("contact-submit-spinner")).toBeInTheDocument();
  });

  it("não deve renderizar o spinner quando não isSubmitting", () => {
    render(<ContactForm />);
    expect(
      screen.queryByTestId("contact-submit-spinner"),
    ).not.toBeInTheDocument();
  });

  it("deve renderizar o PulseRunner", async () => {
    mockForm();
    render(<ContactForm />);
    await waitFor(() => {
      expect(screen.getByTestId("pulse-runner-mock")).toBeInTheDocument();
    });
  });

  it("deve passar gameBoost false por padrão", () => {
    mockForm({ gameBoost: false });
    render(<ContactForm />);
    expect(screen.getByTestId("pulse-runner-mock")).toHaveAttribute(
      "data-boost",
      "false",
    );
  });

  it("deve passar gameBoost true quando ative", () => {
    mockForm({ gameBoost: true });
    render(<ContactForm />);
    expect(screen.getByTestId("pulse-runner-mock")).toHaveAttribute(
      "data-boost",
      "true",
    );
  });
});
