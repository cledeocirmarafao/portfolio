import { describe, it, expect, vi } from "vitest";
import { getByTestId, render, screen } from "@testing-library/react";
import { ProjectsSection } from "./ProjectsSection";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, unknown> = {
        "projects.comment": "// Meu trabalho",
        "projects.title1": "Projetos em",
        "projects.title2": "Destaque",
        "projects.live_demo": "Live Demo",
        "projects.view_code": "Ver Código",
        "projects.see_more_github": "Veja mais projetos no GitHub",
        "projects.items": [
          {
            title: "Animated Background",
            category: "IA & Automação",
            description:
              "Gerador de fundos dinâmicos usando Google Gemini e n8n para transformar descrições em código CSS puro.",
          },
          {
            title: "Pokédex",
            category: "Web App",
            description:
              "Explorador de Pokémon com busca em tempo real, filtros avançados e uma interface moderna totalmente responsiva.",
          },
          {
            title: "CineAI",
            category: "IA & Entretenimento",
            description:
              "Assistente inteligente que recomenda filmes baseados no seu humor, integrado com a API do TMDB e fluxos n8n.",
          },
          {
            title: "LoveCats",
            category: "Colaborativo",
            description:
              "Plataforma para adoção de gatos desenvolvida em equipe, focada em facilitar o encontro entre pets e novos lares.",
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
    i18n: {
      changeLanguage: vi.fn(),
      language: "pt",
    },
  }),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatedPresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("./ui/Button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/assets/project-1.webp", () => ({ default: "project-1.webp" }));
vi.mock("@/assets/project-2.webp", () => ({ default: "project-2.webp" }));
vi.mock("@/assets/project-3.webp", () => ({ default: "project-3.webp" }));
vi.mock("@/assets/project-4.webp", () => ({ default: "project-4.webp" }));

describe("ProjectsSection", () => {
  it("deve renderizar sem quebrar", () => {
    render(<ProjectsSection />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar a ProjectSection com id projects", () => {
    render(<ProjectsSection />);
    const container = screen.getByTestId("projects-section");
    expect(container).toHaveAttribute("id", "projects");
  });

  it("deve renderizar o heading da seção", () => {
    render(<ProjectsSection />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it("deve renderizar o comentário de seção", () => {
    render(<ProjectsSection />);
    const comment = screen.getByTestId("projects-heading");
    expect(comment).toHaveTextContent("// Meu trabalho");
  });

  it("deve renderizar o título da seção", () => {
    render(<ProjectsSection />);
    const titleEl = screen.getByTestId("projects-heading");
    expect(titleEl).toHaveTextContent("Projetos em");
    expect(titleEl).toHaveTextContent("Destaque");
  });

  it("deve rendreizar os 4 cards de projetos", () => {
    render(<ProjectsSection />);
    expect(screen.getByTestId("project-card-01")).toBeInTheDocument();
    expect(screen.getByTestId("project-card-02")).toBeInTheDocument();
    expect(screen.getByTestId("project-card-03")).toBeInTheDocument();
    expect(screen.getByTestId("project-card-04")).toBeInTheDocument();
  });

  it("deve renderizar as imagens dos projetos", () => {
    render(<ProjectsSection />);
    expect(screen.getByTestId("project-image-01")).toBeInTheDocument();
    expect(screen.getByTestId("project-image-02")).toBeInTheDocument();
    expect(screen.getByTestId("project-image-03")).toBeInTheDocument();
    expect(screen.getByTestId("project-image-04")).toBeInTheDocument();
  });

  it("deve renderizar o conteúdo dos projetos", () => {
    render(<ProjectsSection />);
    expect(screen.getByTestId("project-content-01")).toBeInTheDocument();
    expect(screen.getByTestId("project-content-02")).toBeInTheDocument();
    expect(screen.getByTestId("project-content-03")).toBeInTheDocument();
    expect(screen.getByTestId("project-content-04")).toBeInTheDocument();
  });

  it("deve renderizar o título do projeto 01", () => {
    render(<ProjectsSection />);
    expect(screen.getByTestId("project-content-01")).toHaveTextContent(
      "Animated Background",
    );
  });

  it("deve renderizar a categoria do projeto 01", () => {
    render(<ProjectsSection />);
    expect(screen.getByTestId("project-content-01")).toHaveTextContent(
      "IA & Automação",
    );
  });

  it("deve renderizar todo o conteúdo do projeto 01", () => {
    render(<ProjectsSection />);
    const projectEl = screen.getByTestId("project-content-01");
    expect(projectEl).toHaveTextContent("Animated Background");
    expect(projectEl).toHaveTextContent("IA & Automação");
    expect(projectEl).toHaveTextContent(
      "Gerador de fundos dinâmicos usando Google Gemini e n8n para transformar descrições em código CSS puro.",
    );
  });

  it("deve renderizar todo o conteúdo do projeto 02", () => {
    render(<ProjectsSection />);
    const projectEl = screen.getByTestId("project-content-02");
    expect(projectEl).toHaveTextContent("Pokédex");
    expect(projectEl).toHaveTextContent("Web App");
    expect(projectEl).toHaveTextContent(
      "Explorador de Pokémon com busca em tempo real, filtros avançados e uma interface moderna totalmente responsiva.",
    );
  });

  it("deve renderizar todo o conteúdo do projeto 03", () => {
    render(<ProjectsSection />);
    const projectEl = screen.getByTestId("project-content-03");
    expect(projectEl).toHaveTextContent("CineAI");
    expect(projectEl).toHaveTextContent("IA & Entretenimento");
    expect(projectEl).toHaveTextContent(
      "Assistente inteligente que recomenda filmes baseados no seu humor, integrado com a API do TMDB e fluxos n8n.",
    );
  });

  it("deve renderizar todo o conteúdo do projeto 04", () => {
    render(<ProjectsSection />);
    const projectEl = screen.getByTestId("project-content-04");
    expect(projectEl).toHaveTextContent("LoveCats");
    expect(projectEl).toHaveTextContent("Colaborativo");
    expect(projectEl).toHaveTextContent(
      "Plataforma para adoção de gatos desenvolvida em equipe, focada em facilitar o encontro entre pets e novos lares.",
    );
  });

  it("deve renderizar os botões de live demo", () => {
    render(<ProjectsSection />);
    expect(screen.getByTestId("project-demo-01")).toBeInTheDocument();
    expect(screen.getByTestId("project-demo-02")).toBeInTheDocument();
    expect(screen.getByTestId("project-demo-03")).toBeInTheDocument();
    expect(screen.getByTestId("project-demo-04")).toBeInTheDocument();
  });

  it("deve renderizar os botões de view code", () => {
    render(<ProjectsSection />);
    expect(screen.getByTestId("project-code-01")).toBeInTheDocument();
    expect(screen.getByTestId("project-code-02")).toBeInTheDocument();
    expect(screen.getByTestId("project-code-03")).toBeInTheDocument();
    expect(screen.getByTestId("project-code-04")).toBeInTheDocument();
  });

  it("deve ter o conteúdo correto nos botões", () => {
    render(<ProjectsSection />);
    const demoButton = screen.getAllByText("Live Demo");
    const codeButton = screen.getAllByText("Ver Código");
    expect(demoButton).toHaveLength(4);
    expect(codeButton).toHaveLength(4);
  });

  it("deve ter os links corretos nos botões de demo", () => {
    render(<ProjectsSection />);

    const expectedLinks = [
      { id: "01", href: "https://animated-background-pi.vercel.app/" },
      { id: "02", href: "https://poke-gotta-catch.vercel.app/" },
      { id: "03", href: "https://cledeocirmarafao.github.io/project-cineai/" },
      { id: "04", href: "https://team-lovecats.netlify.app/" },
    ];

    expectedLinks.forEach(({ id, href }) => {
      const link = screen.getByTestId(`project-demo-${id}`).querySelector("a");
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("deve ter os links corretos nos botões de código", () => {
    render(<ProjectsSection />);

    const expectedLinks = [
      {
        id: "01",
        href: "https://github.com/cledeocirmarafao/animated-background",
      },
      { id: "02", href: "https://github.com/cledeocirmarafao/pokedex" },
      { id: "03", href: "https://github.com/cledeocirmarafao/project-cineai" },
      { id: "04", href: "https://github.com/ipierette/lovecats" },
    ];

    expectedLinks.forEach(({ id, href }) => {
      const link = screen.getByTestId(`project-code-${id}`).querySelector("a");
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("deve renderizar o botão que direciona ao github", () => {
    render(<ProjectsSection />);
    expect(screen.getByTestId("projects-github-link")).toBeInTheDocument();
  });

  it("deve conter o href correto no botão que direciona ao github", () => {
    render(<ProjectsSection />);
    const githubButton = screen.getByTestId("projects-github-link");
    expect(githubButton).toHaveAttribute(
      "href",
      "https://github.com/cledeocirmarafao",
    );
    expect(githubButton).toHaveAttribute("target", "_blank");
    expect(githubButton).toHaveAttribute("rel", "noopener noreferrer");
    expect(githubButton).toHaveTextContent("Veja mais projetos no GitHub");
  });

  it("deve ter as imagens com atributo alt", () => {
    render(<ProjectsSection />);
    const image = screen.getAllByRole("img");
    image.forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });
  });

  it("deve ter apenas um h2 na seção", () => {
    render(<ProjectsSection />);
    const heading = screen.getAllByRole("heading", { level: 2 });
    expect(heading).toHaveLength(1);
  });
});
