import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "hero.role": "Fullstack Developer",
        "hero.headline1": "Código limpo,",
        "hero.headline2": "interfaces",
        "hero.headline3": "que ficam na",
        "hero.headline4": "memória",
        "hero.tagline1": "Café virou código, código virou produto ☕→💻",
        "hero.tagline2":
          "Construo interfaces rápidas e acessíveis com React, Node.js e TypeScript, do design ao deploy.",
        "hero.cta_projects": "Ver Projetos",
        "hero.cta_cv": "Download CV",
        "hero.stat_repos": "Repositórios",
        "hero.stat_contributions": "Contribuições",
        "hero.stat_years": "Anos de GitHub",
        "hero.scroll": "Scroll para descobrir",
        "hero.code_file": "developer.ts",
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
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatedPresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("./Scene3D", () => ({
  default: () => <div data-testid="scene3d-mock" />,
}));

vi.mock("./ui/ScrollIndicator", () => ({
  ScrollIndicator: ({ className }: any) => (
    <div data-testid="scroll-indicator" className={className} />
  ),
}));

vi.mock("./ui/Button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const ScrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = ScrollIntoViewMock;

describe("HeroSection", () => {
  it("deve rendrizar sem quebrar", () => {
    render(<HeroSection />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar a section com id hero", () => {
    render(<HeroSection />);
    const section = screen.getByTestId("hero-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "hero");
  });

  it("deve renderizar o badge do role", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-role-badge")).toBeInTheDocument();
  });

  it("deve rendrizar o texto do role corretamente", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-role-badge")).toHaveTextContent(
      "Fullstack Developer",
    );
  });

  it("deve rendrizar o conteúdo do h1 corretamente", () => {
    render(<HeroSection />);
    const heading = screen.getByTestId("hero-heading");
    expect(heading).toHaveTextContent("Código limpo,");
    expect(heading).toHaveTextContent("interfaces");
    expect(heading).toHaveTextContent("que ficam na");
    expect(heading).toHaveTextContent("memória");
  });

  it("deve renderizar a tagline", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-tagline")).toBeInTheDocument();
  });

  it("deve renderizar o conteúdo da tagline corretamente", () => {
    render(<HeroSection />);
    const tagline = screen.getByTestId("hero-tagline");
    expect(tagline).toHaveTextContent(
      "Café virou código, código virou produto ☕→💻",
    );
    expect(tagline).toHaveTextContent(
      "Construo interfaces rápidas e acessíveis com React, Node.js e TypeScript, do design ao deploy.",
    );
  });

  it("deve renderizar o botão de projetos", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-cta-projects")).toBeInTheDocument();
  });

  it("deve renderizar o conteúdo no botão de projetos corretamente", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-cta-projects")).toHaveTextContent(
      "Ver Projetos",
    );
  });

  it("deve renderizar o botão de download CV", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-cta-cv")).toBeInTheDocument();
  });

  it("deve renderizar o conteúdo no botão de cv corretamente", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-cta-cv")).toHaveTextContent("Download CV");
  });

  it("deve chamar scrollIntoView ao clicar no botão de projects", () => {
    const projectsEl = document.createElement("div");
    projectsEl.id = "projects";
    document.body.appendChild(projectsEl);

    render(<HeroSection />);
    fireEvent.click(screen.getByTestId("hero-cta-projects"));
    expect(ScrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    document.body.removeChild(projectsEl);
  });

  it("deve renderizar o container de stats", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-stats")).toBeInTheDocument();
  });

  it("deve renderizar os 3 stats", () => {
    render(<HeroSection />);
    const stats = screen.getByTestId("hero-stats");
    expect(stats).toHaveTextContent("25+");
    expect(stats).toHaveTextContent("1000+");
    expect(stats).toHaveTextContent("1+");
  });

  it("deve renderizar os labels dos stats corretamente", () => {
    render(<HeroSection />);
    const label = screen.getByTestId("hero-stats");
    expect(label).toHaveTextContent("Repositórios");
    expect(label).toHaveTextContent("Contribuições");
    expect(label).toHaveTextContent("Anos de GitHub");
  });

  it("deve renderizar o card de código no DOM", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("hero-code-card")).toBeInTheDocument();
  });

  it("deve renderizar a visibilidade correta do card de código", () => {
    render(<HeroSection />);
    const card = screen.getByTestId("hero-code-card");
    expect(card).toHaveClass("hidden");
    expect(card).toHaveClass("lg:block");
  });

  it("deve renderizar o conteúdo do card de código corretamente", () => {
    render(<HeroSection />);
    const card = screen.getByTestId("hero-code-card");
    expect(card).toHaveTextContent("Cledeocir Marafão");
    expect(card).toHaveTextContent("@cledeocirmarafao");
    expect(card).toHaveTextContent("TypeScript");
    expect(card).toHaveTextContent("React");
    expect(card).toHaveTextContent("TailwindCSS");
    expect(card).toHaveTextContent("25+");
    expect(card).toHaveTextContent("true");
  });

  it("deve renderizar o ScrollIndicator", () => {
    render(<HeroSection />);
    const indicator = screen.getAllByTestId("scroll-indicator");
    expect(indicator.length).toBeGreaterThanOrEqual(1);
  });

  it("deve renderizar a Scene3D", async () => {
    render(<HeroSection />);
    expect(await screen.findByTestId("scene3d-mock")).toBeInTheDocument();
  });

  it("deve ter apenas um h1 na seção", () => {
    render(<HeroSection />);
    const heading = screen.getAllByRole("heading", { level: 1 });
    expect(heading).toHaveLength(1);
  });

  it("deve ter o link do CV com atributo download", () => {
    render(<HeroSection />);
    const cvButton = screen.getByTestId("hero-cta-cv");
    const link = cvButton.querySelector("a");
    expect(link).toHaveAttribute("download");
  });
});
