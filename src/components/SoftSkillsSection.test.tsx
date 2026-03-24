import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SoftSkillsSection } from "./SoftSkillsSection";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "soft_skills.comment": "// Além do Código",
        "soft_skills.title1": "Habilidades",
        "soft_skills.title2": "Interpessoais",
        "soft_skills.hint": "< Passe o mouse para explorar >",
        "soft_skills.items.communication": "Comunicação",
        "soft_skills.items.teamwork": "Trabalho em equipe",
        "soft_skills.items.problem_solving": "Resolução de problemas",
        "soft_skills.items.continuous_learning": "Aprendizado contínuo",
        "soft_skills.items.attention_detail": "Atenção a detalhes",
        "soft_skills.items.autonomy": "Autonomia",
        "soft_skills.items.adaptability": "Adaptabilidade",
        "soft_skills.items.proactivity": "Proatividade",
        "soft_skills.items.critical_thinking": "Pensamento crítico",
        "soft_skills.items.delivery_focus": "Foco em entrega",
        "soft_skills.items.resilience": "Resiliência",
        "soft_skills.items.product_vision": "Visão de produto",
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

vi.mock("lucide-react", () => ({
  MessageCircle: () => <svg data-testid="icon-message-circle" />,
  Users: () => <svg data-testid="icon-users" />,
  Lightbulb: () => <svg data-testid="icon-lightbulb" />,
  BookOpen: () => <svg data-testid="icon-book-open" />,
  Eye: () => <svg data-testid="icon-eye" />,
  Compass: () => <svg data-testid="icon-compass" />,
  Shuffle: () => <svg data-testid="icon-shuffle" />,
  Rocket: () => <svg data-testid="icon-rocket" />,
  Brain: () => <svg data-testid="icon-brain" />,
  Target: () => <svg data-testid="icon-target" />,
  Shield: () => <svg data-testid="icon-shield" />,
  Glasses: () => <svg data-testid="icon-glasses" />,
}));

describe("SoftSkillsSection", () => {
  it("deve renderizar sem quebrar", () => {
    render(<SoftSkillsSection />);
    expect(document.body).toBeTruthy();
  });

  it("deve conter apenas um h2 na seção", () => {
    render(<SoftSkillsSection />);
    const heading = screen.getAllByRole("heading", { level: 2 });
    expect(heading).toHaveLength(1);
  });

  it("deve renderizar o título da seção", () => {
    render(<SoftSkillsSection />);
    const heading = screen.getByTestId("soft-skills-heading");
    expect(heading).toHaveTextContent("Habilidades");
    expect(heading).toHaveTextContent("Interpessoais");
  });

  it("deve renderizar o comentário da seção", () => {
    render(<SoftSkillsSection />);
    expect(screen.getByTestId("soft-skills-heading")).toHaveTextContent(
      "// Além do Código",
    );
  });

  it("deve renderizar o hint", () => {
    render(<SoftSkillsSection />);
    expect(screen.getByTestId("soft-skills-hint")).toHaveTextContent(
      "< Passe o mouse para explorar >",
    );
  });

  it("deve renderizar o carrossel", () => {
    render(<SoftSkillsSection />);
    expect(screen.getByTestId("soft-skills-carousel")).toBeInTheDocument();
  });

  it("deve renderizar 3 cópias de cada soft skill", () => {
    render(<SoftSkillsSection />);
    const softSkillKey = [
      "communication",
      "teamwork",
      "problem_solving",
      "continuous_learning",
      "attention_detail",
      "autonomy",
      "adaptability",
      "proactivity",
      "critical_thinking",
      "delivery_focus",
      "resilience",
      "product_vision",
    ];
    softSkillKey.forEach((key) => {
      const softSkill = screen.getAllByTestId(`soft-skill-item-${key}`);
      expect(softSkill).toHaveLength(3);
    });
  });

  it("deve renderizar todas as 12 soft skills", () => {
    render(<SoftSkillsSection />);
    const softSkills = [
      "Comunicação",
      "Trabalho em equipe",
      "Resolução de problemas",
      "Aprendizado contínuo",
      "Atenção a detalhes",
      "Autonomia",
      "Adaptabilidade",
      "Proatividade",
      "Pensamento crítico",
      "Foco em entrega",
      "Resiliência",
      "Visão de produto",
    ];
    softSkills.forEach((label) => {
      const items = screen.getAllByText(label);
      expect(items).toHaveLength(3);
    });
  });

  it("deve pausar o carrossel ao hover", () => {
    render(<SoftSkillsSection />);
    const carousel = screen.getByTestId("soft-skills-carousel");
    const scrollEl = screen.getByTestId("soft-skills-scroll");

    fireEvent.mouseEnter(carousel);
    expect(scrollEl.style.animationPlayState).toBe("paused");
  });

  it("deve retomar o carrossel ao sair do hover", () => {
    render(<SoftSkillsSection />);
    const carousel = screen.getByTestId("soft-skills-carousel");
    const scrollEl = screen.getByTestId("soft-skills-scroll");

    fireEvent.mouseEnter(carousel);
    fireEvent.mouseLeave(carousel);

    expect(scrollEl.style.animationPlayState).toBe("running");
  });
});
