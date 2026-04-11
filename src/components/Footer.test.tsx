import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Footer } from "./Footer";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "nav.home": "Início",
        "nav.projects": "Projetos",
        "nav.skills": "Habilidades",
        "nav.about": "Sobre",
        "nav.contact": "Contato",
        "footer.description1": "Desenvolvedor FullStack em formação.",
        "footer.description2": "Focado em criar interfaces incríveis.",
        "footer.location": "Florianópolis, SC — Brasil 🏝️",
        "footer.quick_links": "Links Rápidos",
        "footer.social": "Redes Sociais",
        "footer.copyright": "© 2026 Desenvolvido por Cledeocir Marafão",
        "footer.and": "e",
        "footer.in_floripa": "em Floripa.",
      };
      if (!(key in translations)) {
        throw new Error(`Chave de tradução não mockada"${key}"`);
      }
      return translations[key];
    },
    i18n: { changeLanguge: vi.fn(), language: "pt" },
  }),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}));

vi.mock("lucide-react", () => ({
  Github: () => <svg data-testid="icon-github" />,
  Linkedin: () => <svg data-testid="icon-linkedin" />,
  ArrowUp: () => <svg data-testid="icon-arrow-up" />,
  Heart: () => <svg data-testid="icon-heart" />,
  Coffee: () => <svg data-testid="icon-coffee" />,
}));

vi.mock("react-icons/fa", () => ({
  FaDiscord: () => <svg data-testid="icon-discord" />,
}));

const scrollToMock = vi.fn();
window.scrollTo = scrollToMock;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Footer", () => {
  it("deve renderizar sem quebrar", () => {
    render(<Footer />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar o Footer com o id", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-section")).toBeInTheDocument();
  });

  it("deve renderizar a logo com o conteúdo correto", () => {
    render(<Footer />);
    const logo = screen.getByTestId("footer-logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent("<MarafaDev/>");
  });

  it("deve ter href para #hero", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-logo")).toHaveAttribute("href", "#hero");
  });

  it("deve renderizar a descrição", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-description")).toBeInTheDocument();
  });

  it("deve renderizar a localização", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-location")).toBeInTheDocument();
  });

  it("deve renderizar o copyright com o conteúdo correto", () => {
    render(<Footer />);
    const copyright = screen.getByTestId("footer-copyright");
    expect(copyright).toBeInTheDocument();
    expect(copyright).toHaveTextContent(
      "© 2026 Desenvolvido por Cledeocir Marafão",
    );
  });

  it("deve renderizar o título de links rápidos", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-quick-links-title")).toHaveTextContent(
      "Links Rápidos",
    );
  });

  it("deve renderizar os 5 links de navegação", () => {
    render(<Footer />);
    expect(screen.getAllByTestId(/footer-nav-link-/)).toHaveLength(5);
    expect(screen.getByTestId("footer-nav-link-hero")).toBeInTheDocument();
    expect(screen.getByTestId("footer-nav-link-projects")).toBeInTheDocument();
    expect(screen.getByTestId("footer-nav-link-skills")).toBeInTheDocument();
    expect(screen.getByTestId("footer-nav-link-about")).toBeInTheDocument();
    expect(screen.getByTestId("footer-nav-link-contact")).toBeInTheDocument();
  });

  it("deve renderizar os links para cada seção com href correto", () => {
    render(<Footer />);
    const links = [
      { testid: "footer-nav-link-hero", href: "#hero" },
      { testid: "footer-nav-link-projects", href: "#projects" },
      { testid: "footer-nav-link-skills", href: "#skills" },
      { testid: "footer-nav-link-about", href: "#about" },
      { testid: "footer-nav-link-contact", href: "#contact" },
    ];
    links.forEach(({ testid, href }) => {
      expect(screen.getByTestId(testid)).toHaveAttribute("href", href);
    });
  });

  it("deve renderizar o título de redes sociais com conteúdo correto", () => {
    render(<Footer />);
    const socialTitle = screen.getByTestId("footer-social-title");
    expect(socialTitle).toBeInTheDocument();
    expect(socialTitle).toHaveTextContent("Redes Sociais");
  });

  it("deve renderizar os 3 links sociais", () => {
    render(<Footer />);
    expect(screen.getAllByTestId(/footer-social-link-/)).toHaveLength(3);
  });

  it("os links devem ter o href correto", () => {
    render(<Footer />);
    const links = [
      {
        testid: "footer-social-link-github",
        href: "https://github.com/cledeocirmarafao",
      },
      {
        testid: "footer-social-link-linkedin",
        href: "https://www.linkedin.com/in/cledeocirmarafao/",
      },
      {
        testid: "footer-social-link-discord",
        href: "https://discord.com/users/1410185695661916181",
      },
    ];
    links.forEach(({ testid, href }) => {
      expect(screen.getByTestId(testid)).toHaveAttribute("href", href);
    });
  });

  it("todos os link sociais devem abrir em nova aba com rel correto", () => {
    render(<Footer />);
    const links = screen.getAllByTestId(/footer-social-link-/);
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("deve renderizar o botão de scroll to top", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-scroll-top")).toBeInTheDocument();
  });

  it("deve chamar window.scrollTo ao clicar no botão", () => {
    render(<Footer />);
    fireEvent.click(screen.getByTestId("footer-scroll-top"));
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
