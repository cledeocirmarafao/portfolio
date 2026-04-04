import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "./AboutSection";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, unknown> = {
        "about.comment": "// Quem sou eu",
        "about.title1": "Sobre",
        "about.title2": "Mim",
        "about.photo_alt": "Foto de perfil",
        "about.badge_role": "Fullstack Jr",
        "about.badge_open": "Open to Work",
        "about.badge_location": "Floripa 🏝️",
        "about.p1":
          "Olá! Meu nome é <1>Cledeocir Marafão</1>! Sou pai de duas meninas e, após a perda funcional do meu braço direito (CID G54.0) em um acidente automobilístico, encontrei no desenvolvimento de software uma forma poderosa de reconstruir meu caminho.",
        "about.p2":
          "Hoje me especializo no ecossistema JavaScript (<1>React</1>, <1>Node.js</1> e <1>TypeScript</1>). Enquanto isso, aprofundo meus conhecimentos em renderizações 3D, Next.js, Prisma, Docker, integrações e automações com IA e N8n, consolidando minha formação em FullStack.",
        "about.p3":
          "Estou em constante evolução, aprofundando conhecimentos em arquitetura de software e práticas de DevOps. Disponível para projetos freelance, oportunidades full-time em <1>Florianópolis</1> ou remoto.",
        "about.timeline_title": "Resumo da minha Trajetória",
        "about.contributions": "contribuições",
        "about.contributions_period": "nos últimos 6 meses",
        "about.timeline": [
          {
            year: "2026",
            title: "Certificação Frontend Profissional",
            description:
              "Certificado de mais de 80 horas com foco em arquitetura de interfaces, performance e acessibilidade (React, TypeScript, Tailwind CSS e testes automatizados).",
          },
          {
            year: "2025",
            title: "DevQuest – Extensão Universitária Full Stack",
            description:
              "Imersão intensiva: mais de 25 projetos reais (curso + pessoais), aprofundamento em HTML, CSS, JavaScript, React, TypeScript, Tailwind, Jest, Vitest e Redux.",
          },
          {
            year: "2024",
            title: "Início na Programação",
            description:
              "Primeiro contato com tecnologia. Início da formação DevQuest e desenvolvimento dos primeiros projetos pessoais com foco em lógica e ecossistema JavaScript.",
          },
        ],
      };
      if (!(key in translations)) {
        throw new Error(`Chave de tradução não mockada: "${key}"`);
      }
      if (options?.returnObjects) {
        return translations[key];
      }
      return translations[key] as string;
    },
    i18n: { changeLanguage: vi.fn(), language: "pt" },
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("lucide-react", () => ({
  MapPin: () => <svg data-testid="icon-map-pin" />,
  Briefcase: () => <svg data-testid="icon-map-briefcase" />,
  Calendar: () => <svg data-testid="icon-map-calendar" />,
}));

vi.mock("profile-photo", () => ({ default: "profile-port.webp" }));

vi.mock("../hooks/useGithubData", () => ({
  useGitHubData: () => ({
    totalContributions: 540,
    contributions: [],
  }),
}));

vi.mock("./GithubContributionGraph", () => ({
  GitHubContributionGraph: () => <div data-testid="contribution-graph-mock" />,
}));

describe("AboutSection", () => {
  it("deve renderizar sem quebrar", () => {
    render(<AboutSection />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar a seção com id about", () => {
    render(<AboutSection />);
    const container = screen.getByTestId("about-section");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("id", "about");
  });

  it("deve renderizar a foto de perfil", () => {
    render(<AboutSection />);
    expect(screen.getByTestId("about-photo")).toBeInTheDocument();
  });

  it("deve ter o alt correto na foto de perfil", () => {
    render(<AboutSection />);
    const photo = screen.getByTestId("about-photo");
    expect(photo).toHaveAttribute("alt", "Foto de perfil");
  });

  it("deve renderizar o badge de role", () => {
    render(<AboutSection />);
    const badge = screen.getByTestId("about-badge-role");
    expect(badge).toHaveTextContent("Fullstack Jr");
  });

  it("deve renderizar o badge open to work", () => {
    render(<AboutSection />);
    const badge = screen.getByTestId("about-badge-open");
    expect(badge).toHaveTextContent("Open to Work");
  });

  it("deve renderizar o badge de localização", () => {
    render(<AboutSection />);
    const badge = screen.getByTestId("about-badge-location");
    expect(badge).toHaveTextContent("Floripa 🏝️");
  });

  it("deve renderizar o heading com o título correto", () => {
    render(<AboutSection />);
    const heading = screen.getByTestId("about-heading");
    expect(heading).toHaveTextContent("Sobre");
    expect(heading).toHaveTextContent("Mim");
  });

  it("deve ter apenas um h2 na seção", () => {
    render(<AboutSection />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(1);
  });

  it("deve renderizar a timeline", () => {
    render(<AboutSection />);
    expect(screen.getByTestId("about-timeline")).toBeInTheDocument();
  });

  it("deve renderizar o h3 como título principal das timelines", () => {
    render(<AboutSection />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Resumo da minha Trajetória");
  });

  it("deve renderizar os três itens da timeline", () => {
    render(<AboutSection />);
    expect(screen.getByTestId("timeline-item-2026")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-2025")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-2024")).toBeInTheDocument();
  });

  it("deve renderizar o título correto de cada timeline", () => {
    render(<AboutSection />);
    const timelines = screen.getByTestId("about-timeline");
    expect(timelines);
    expect(timelines).toHaveTextContent(
      "DevQuest – Extensão Universitária Full Stack",
    );
    expect(timelines).toHaveTextContent("Início na Programação");
  });

  it("deve renderizar o conteúdo correto dos itens da timeline", () => {
    render(<AboutSection />);
    expect(screen.getByTestId("timeline-item-2026")).toHaveTextContent(
      "Certificado de mais de 80 horas com foco em arquitetura de interfaces, performance e acessibilidade (React, TypeScript, Tailwind CSS e testes automatizados).",
    );
    expect(screen.getByTestId("timeline-item-2025")).toHaveTextContent(
      "Imersão intensiva: mais de 25 projetos reais (curso + pessoais), aprofundamento em HTML, CSS, JavaScript, React, TypeScript, Tailwind, Jest, Vitest e Redux.",
    );
    expect(screen.getByTestId("timeline-item-2024")).toHaveTextContent(
      "Primeiro contato com tecnologia. Início da formação DevQuest e desenvolvimento dos primeiros projetos pessoais com foco em lógica e ecossistema JavaScript.",
    );
  });

  it("deve renderizar o gráfico de contribuições", () => {
    render(<AboutSection />);
    expect(screen.getByTestId("contribution-graph-mock")).toBeInTheDocument();
  });
});
