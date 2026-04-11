import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactSection } from "./ContactSection";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "contact.comment": "// Entre em contato",
        "contact.title1": "Vamos",
        "contact.title2": "Trabalhar",
        "contact.title3": "Juntos",
        "contact.subtitle":
          "Tem um projeto em mente ou uma oportunidade para compartilhar? Estou disponível e responderei em breve.",
      };
      if (!(key in translations))
        throw new Error(`Chave de tradução não mockada: "${key}"`);
      return translations[key];
    },
    i18n: { changeLanguage: vi.fn(), language: "pt" },
  }),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("lucide-react", () => ({
  Mail: () => <svg />,
  Linkedin: () => <svg />,
  Github: () => <svg />,
  MessageSquare: () => <svg />,
  Copy: () => <svg data-testid="icon-copy" />,
  Check: () => <svg data-testid="icon-check" />,
}));

vi.mock("./ContactForm", () => ({
  ContactForm: () => <div data-testid="contact-form-mock" />,
}));

vi.mock("./LocationMap", () => ({
  LocationMap: () => <div data-testid="location-map-mock" />,
}));

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ContactSection", () => {
  it("deve renderizar sem quebrar", () => {
    render(<ContactSection />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar a seção com id contact", () => {
    render(<ContactSection />);
    expect(screen.getByTestId("contact-section")).toHaveAttribute(
      "id",
      "contact",
    );
  });

  it("deve renderizar o comentário da seção com o conteúdo correto", () => {
    render(<ContactSection />);
    const comment = screen.getByTestId("contact-comment");
    expect(comment).toBeInTheDocument();
    expect(comment).toHaveTextContent("// Entre em contato");
  });

  it("deve ter apenas um h2 na seção", () => {
    render(<ContactSection />);
    const heading = screen.getAllByRole("heading", { level: 2 });
    expect(heading).toHaveLength(1);
  });

  it("deve renderizar o heading com as 3 partes do título", () => {
    render(<ContactSection />);
    const heading = screen.getByTestId("contact-heading");
    expect(heading).toHaveTextContent("Vamos");
    expect(heading).toHaveTextContent("Trabalhar");
    expect(heading).toHaveTextContent("Juntos");
  });

  it("deve renderizar o subtítulo com o conteúdo correto", () => {
    render(<ContactSection />);
    const subtitle = screen.getByTestId("contact-subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent(
      "Tem um projeto em mente ou uma oportunidade para compartilhar? Estou disponível e responderei em breve.",
    );
  });

  it("deve renderizar os 4 links sociais", () => {
    render(<ContactSection />);
    expect(screen.getAllByTestId(/contact-social-item-/)).toHaveLength(4);
  });

  it("link do Email deve ter o href correto", () => {
    render(<ContactSection />);
    expect(screen.getByTestId("contact-social-link-email")).toHaveAttribute(
      "href",
      "mailto:cledeocirms96@gmail.com",
    );
  });

  it("link do LinkedIn deve ter o href correto", () => {
    render(<ContactSection />);
    expect(screen.getByTestId("contact-social-link-linkedin")).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/cledeocirmarafao/",
    );
  });

  it("link do GitHub deve ter o href correto", () => {
    render(<ContactSection />);
    expect(screen.getByTestId("contact-social-link-github")).toHaveAttribute(
      "href",
      "https://github.com/cledeocirmarafao",
    );
  });

  it("link do WhatsApp deve ter o href correto", () => {
    render(<ContactSection />);
    expect(screen.getByTestId("contact-social-link-whatsapp")).toHaveAttribute(
      "href",
      "https://wa.me/5548988669970",
    );
  });

  it("todos os links devem abrir em nova aba com rel correto", () => {
    render(<ContactSection />);
    const links = screen.getAllByTestId(/contact-social-link-/);
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("deve chamar clipboard.writeText com valor correto ao clicar", () => {
    render(<ContactSection />);
    fireEvent.click(screen.getByTestId("contact-copy-btn-email"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "cledeocirms96@gmail.com",
    );
  });

  it("deve exibir o ícone de check após copiar", () => {
    render(<ContactSection />);
    fireEvent.click(screen.getByTestId("contact-copy-btn-email"));
    expect(screen.getByTestId("icon-check")).toBeInTheDocument();
  });
});
