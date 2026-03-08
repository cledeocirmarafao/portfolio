import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { IntroAnimation } from "./IntroAnimation";

// @vitest-environment jsdom
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "intro.stage1": "Inicializando portfólio...",
        "intro.stage2": "Carregando assets...",
        "intro.stage3": "Bem-vindo",
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
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("IntroAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("deve renderizar sem quebrar", () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar o h1 principal", () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("não deve mostrar frases do terminal antes do typewriter terminar", () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);
    expect(
      screen.queryByText("Inicializando portfólio..."),
    ).not.toBeInTheDocument();
  });

  it("deve rendrizar os quatro cantos decorativos", () => {
    const onComplete = vi.fn();
    const { container } = render(<IntroAnimation onComplete={onComplete} />);
    const corners = container.querySelectorAll(
      '[data-testid="corner-decoration"]',
    );
    expect(corners.length).toBe(4);
  });

  it("deve rendrizar a barra de progresso", () => {
    const onComplete = vi.fn();
    const { container } = render(<IntroAnimation onComplete={onComplete} />);
    const progressBar = container.querySelector('[data-testid="progress-bar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it("deve começar com o texto vazio", () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("_");
  });

  it("deve digitar o texto letra por letra", () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("D");
  });

  it('deve completar o texto "DEV PORTFÓLIO" após o tempo correto', () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("DEV PORTFÓLIO");
  });

  it("deve mostrar o stage1 após o typewriter terminar", () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(screen.getByText("Inicializando portfólio...")).toBeInTheDocument();
  });

  it("deve avançar para o stage2 após a duração do stage1", async () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(900);
    });
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByTestId("terminal-text")).toHaveTextContent(
      "Carregando assets...",
    );
  });

  it("deve avançar para o stage3 após a duração do stage2", () => {
    const onComplete = vi.fn();
    render(<IntroAnimation onComplete={onComplete} />);

    act(() => {
      vi.advanceTimersByTime(900);
    });
    act(() => vi.advanceTimersByTime(1200));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("terminal-text")).toHaveTextContent("Bem-vindo");
  });

  it('deve chamar onComplete após todos os stages', () => {
    const onComplete = vi.fn()
    render(<IntroAnimation onComplete={onComplete}/>)

    act(() => {
      vi.advanceTimersByTime(900);
    });
    act(() => vi.advanceTimersByTime(1200));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(800);
    });
    act(() => vi.advanceTimersByTime(700));
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('deve ter aria-hidden nas camadas de glitch', () => {
    const onComplete = vi.fn()
    const { container } = render(<IntroAnimation onComplete={onComplete}/>)
    const hiddenElements = container.querySelectorAll('[aria-hidden="true"]')
    expect(hiddenElements.length).toBeGreaterThanOrEqual(2)
  })

  it('deve ter apenas um h1 na página', () => {
    const onComplete = vi.fn()
    render(<IntroAnimation onComplete={onComplete}/>)
    const headings = screen.getAllByRole('heading', { level: 1})
    expect(headings).toHaveLength(1)
  })
});
