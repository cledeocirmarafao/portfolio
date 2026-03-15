import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navigation } from "./Navigation";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "nav.home": "Início",
        "nav.projects": "Projetos",
        "nav.skills": "Skills",
        "nav.about": "Sobre",
        "nav.contact": "Contato",
      };
      if (!(key in translations)) {
        throw new Error(`Chave de tradução não mockada: "${key}"`);
      }
      return translations[key];
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: "pt",
    },
  }),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useScroll: () => ({
    scrollY: { getPrevious: () => 0, onChange: vi.fn() },
    scrollYProgress: 0,
  }),
  useMotionValueEvent: vi.fn(),
}));

vi.mock("./ui/LanguageToggle.tsx", () => ({
  LanguageToggle: ({ className }: { className?: string }) => (
    <div data-testid="language-toggle" className={className} />
  ),
}));

const scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

describe("Navigation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    scrollIntoViewMock.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("deve rendrizar sem quebrar", () => {
    render(<Navigation />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar a barra de progresso", () => {
    render(<Navigation />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("deve renderizar a logo", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-logo")).toBeInTheDocument();
  });

  it("deve renderizar o texto da logo corretamente", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-logo")).toHaveTextContent("<MarafaDev/>");
  });

  it("deve renderizar o menu desktop", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-desktop")).toBeInTheDocument();
  });

  it("deve renderizar o botão do menu mobile", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-mobile-button")).toBeInTheDocument();
  });

  it("deve renderizar o LanfuageToggle", () => {
    render(<Navigation />);
    expect(
      screen.getAllByTestId("language-toggle").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("deve renderizar os 5 links no menu desktop", () => {
    render(<Navigation />);
    const links = [
      screen.getByTestId("nav-link-desktop-hero"),
      screen.getByTestId("nav-link-desktop-projects"),
      screen.getByTestId("nav-link-desktop-skills"),
      screen.getByTestId("nav-link-desktop-about"),
      screen.getByTestId("nav-link-desktop-contact"),
    ];
    links.forEach((link) => expect(link).toBeInTheDocument());
  });

  it("deve rendrizar os textos traduzidos nos links desktop", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-link-desktop-hero")).toHaveTextContent(
      "Início",
    );
    expect(screen.getByTestId("nav-link-desktop-projects")).toHaveTextContent(
      "Projetos",
    );
    expect(screen.getByTestId("nav-link-desktop-skills")).toHaveTextContent(
      "Skills",
    );
    expect(screen.getByTestId("nav-link-desktop-about")).toHaveTextContent(
      "Sobre",
    );
    expect(screen.getByTestId("nav-link-desktop-contact")).toHaveTextContent(
      "Contato",
    );
  });

  it("deve ter os hrefs corretos nos links html", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-link-desktop-hero")).toHaveAttribute(
      "href",
      "#hero",
    );
    expect(screen.getByTestId("nav-link-desktop-projects")).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByTestId("nav-link-desktop-skills")).toHaveAttribute(
      "href",
      "#skills",
    );
    expect(screen.getByTestId("nav-link-desktop-about")).toHaveAttribute(
      "href",
      "#about",
    );
    expect(screen.getByTestId("nav-link-desktop-contact")).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("não deve mostrar o menu mobile inicialmente", () => {
    render(<Navigation />);
    expect(screen.queryByTestId("nav-mobile-menu")).not.toBeInTheDocument();
  });

  it("deve abrir o menu mobile ao clicar no botão", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByTestId("nav-mobile-button"));
    expect(screen.getByTestId("nav-mobile-menu")).toBeInTheDocument();
  });

  it("deve fechar o menu mobile ao clicar no botão novamente", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByTestId("nav-mobile-button"));
    expect(screen.getByTestId("nav-mobile-menu")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("nav-mobile-button"));
    expect(screen.queryByTestId("nav-mobile-menu")).not.toBeInTheDocument();
  });

  it("deve renderizar os 5 links no menu mobile quando aberto", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByTestId("nav-mobile-button"));
    const links = [
      screen.getByTestId("nav-link-hero"),
      screen.getByTestId("nav-link-projects"),
      screen.getByTestId("nav-link-skills"),
      screen.getByTestId("nav-link-about"),
      screen.getByTestId("nav-link-contact"),
    ];
    links.forEach((link) => expect(link).toBeInTheDocument());
  });

  it("deve fechar o menu mobile ao clicar em um link", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByTestId("nav-mobile-button"));
    expect(screen.getByTestId("nav-mobile-menu")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("nav-link-hero"));
    expect(screen.queryByTestId("nav-mobile-menu")).not.toBeInTheDocument();
  });

  it("deve chamar scrollIntoView ao clicar no logo", () => {
    const heroEl = document.createElement("div");
    heroEl.id = "hero";
    document.body.appendChild(heroEl);

    render(<Navigation />);
    fireEvent.click(screen.getByTestId("nav-logo"));
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    document.body.removeChild(heroEl);
  });

  it("deve chamar scrollIntoView ao clicar em um link desktop", () => {
    const projectsEl = document.createElement("div");
    projectsEl.id = "projects";
    document.body.appendChild(projectsEl);

    render(<Navigation />);
    fireEvent.click(screen.getByTestId("nav-link-desktop-projects"));
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    document.body.removeChild(projectsEl);
  });

  it("deve ter hero como seção ativa principal", () => {
    render(<Navigation />);
    const heroLink = screen.getByTestId("nav-link-desktop-hero");
    expect(heroLink).toHaveClass("text-primary");
  });

  it("o logo deve apontar para #hero", () => {
    render(<Navigation />);
    expect(screen.getByTestId("nav-logo")).toHaveAttribute("href", "#hero");
  });
});
