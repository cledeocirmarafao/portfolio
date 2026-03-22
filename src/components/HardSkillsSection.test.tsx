import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HardSkillsSection } from "./HardSkillsSection";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "skills.comment": "// Habilidades Técnicas",
        "skills.title1": "Arsenal",
        "skills.title2": "Técnico",
        "skills.hint": "< Passe o mouse para explorar >",
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
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("react-icons/si", () => ({
  SiJavascript: () => <svg data-testid="icon-javascript" />,
  SiTypescript: () => <svg data-testid="icon-typescript" />,
  SiTailwindcss: () => <svg data-testid="icon-tailwindcss" />,
  SiHtml5: () => <svg data-testid="icon-html5" />,
  SiVite: () => <svg data-testid="icon-vite" />,
  SiJest: () => <svg data-testid="icon-jest" />,
  SiVitest: () => <svg data-testid="icon-vitest" />,
  SiReactrouter: () => <svg data-testid="icon-reactrouter" />,
  SiAxios: () => <svg data-testid="icon-axios" />,
  SiTestinglibrary: () => <svg data-testid="icon-testinglibrary" />,
  SiFastapi: () => <svg data-testid="icon-fastapi" />,
  SiThreedotjs: () => <svg data-testid="icon-threedotjs" />,
  SiN8N: () => <svg data-testid="icon-workflow" />,
}));

vi.mock("react-icons/fa6", () => ({
  FaCss3Alt: () => <svg data-testid="icon-css3" />,
}));

describe("HardSkillsSection", () => {
  it("deve rendrizar sem quebrar", () => {
    render(<HardSkillsSection />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar a seção com id skills", () => {
    render(<HardSkillsSection />);
    const container = screen.getByTestId("skills-section");
    expect(container).toHaveAttribute("id", "skills");
  });

  it("deve ter apenas um h2 na seção", () => {
    render(<HardSkillsSection />);
    const heading = screen.getAllByRole("heading", { level: 2 });
    expect(heading).toHaveLength(1);
  });

  it("deve renderizar o comentário da seção", () => {
    render(<HardSkillsSection />);
    const container = screen.getByTestId("skills-section");
    expect(container).toHaveTextContent("// Habilidades Técnicas");
  });

  it("deve renderizar o título da seção", () => {
    render(<HardSkillsSection />);
    const container = screen.getByTestId("skills-section");
    expect(container).toHaveTextContent("Arsenal");
    expect(container).toHaveTextContent("Técnico");
  });

  it("deve renderizar o hint", () => {
    render(<HardSkillsSection />);
    expect(screen.getByTestId("skills-hint")).toHaveTextContent(
      "Passe o mouse para explorar",
    );
  });

  it("deve renderizar o carrossel", () => {
    render(<HardSkillsSection />);
    expect(screen.getByTestId("skills-carousel")).toBeInTheDocument();
  });

  it("deve renderizar 3 cópias das tecnologias", () => {
    render(<HardSkillsSection />);
    const tsItem = screen.getAllByTestId("skill-item-typescript");
    expect(tsItem).toHaveLength(3);
  });

  it("deve renderizar todas as 13 tecnologias", () => {
    render(<HardSkillsSection />);
    const techs = [
      "javascript",
      "typescript",
      "tailwind-css",
      "css",
      "html",
      "n8n",
      "vite",
      "jest",
      "vitest",
      "react-router",
      "axios",
      "testing-library",
      "fastapi",
      "three.js",
    ];
    techs.forEach((tech) => {
      const items = screen.getAllByTestId(`skill-item-${tech}`);
      expect(items.length).toBe(3);
    });
  });

  it("deve renderizar o nome de cada tecnologia corretamente", () => {
    render(<HardSkillsSection />);
    const techNames = [
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "CSS",
      "HTML",
      "n8n",
      "Vite",
      "Jest",
      "Vitest",
      "React Router",
      "Axios",
      "Testing Library",
      "FastAPI",
      "Three.js",
    ];
    techNames.forEach((name) => {
      const items = screen.getAllByText(name);
      expect(items.length).toBe(3);
    });
  });

  it("deve pausar o carrossel ao hover", () => {
    render(<HardSkillsSection />);
    const carousel = screen.getByTestId("skills-carousel");
    const scrollDiv = carousel.querySelector(
      ".animate-scroll-left",
    ) as HTMLElement;

    fireEvent.mouseEnter(carousel);
    expect(scrollDiv?.style.animationPlayState).toBe("paused");
  });

  it("deve retormar o carrossel ao sair do hover", () => {
    render(<HardSkillsSection />);
    const carousel = screen.getByTestId("skills-carousel");
    const scrollDiv = carousel.querySelector(
      ".animate-scroll-left",
    ) as HTMLElement;

    fireEvent.mouseEnter(carousel);
    fireEvent.mouseLeave(carousel);
    expect(scrollDiv?.style.animationPlayState).toBe("running");
  });
});
