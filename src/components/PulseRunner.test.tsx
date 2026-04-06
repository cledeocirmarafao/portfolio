import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PulseRunner } from "./PulseRunner";
import { usePulseRunnerGame } from "@/hooks/usePulseRunnerGame";
import type { GameState } from "@/hooks/usePulseRunnerGame";

vi.mock("@/hooks/usePulseRunnerGame", () => ({
  usePulseRunnerGame: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "pulse_runner.play": "Jogar",
        "pulse_runner.restart": "Reiniciar",
        "pulse_runner.hint": "Use espaço ou clique para pular os obstáculos.",
      };
      if (!(key in translations)) {
        throw new Error(`Chave de tradução não mockada: "${key}"`);
      }
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

const mockUsePulseRunnerGame = vi.mocked(usePulseRunnerGame);

const mockGame = (state: GameState, score = 0, high = 0) =>
  mockUsePulseRunnerGame.mockReturnValue({
    displayState: state,
    displayScore: score,
    displayHigh: high,
    jump: vi.fn(),
    startGame: vi.fn(),
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PulseRunner", () => {
  describe("estado idle", () => {
    it("deve renderizar o botão Jogar com o conteúdo correto", () => {
      mockGame("idle");
      render(<PulseRunner />);
      const container = screen.getByTestId("pulse-runner-play-btn");
      expect(container).toBeInTheDocument();
      expect(container).toHaveTextContent("Jogar");
    });

    it("não deve renderizar o botão Reiniciar", () => {
      mockGame("idle");
      render(<PulseRunner />);
      expect(
        screen.queryByTestId("pulse-runner-restart-btn"),
      ).not.toBeInTheDocument();
    });
  });

  describe("estado over", () => {
    it("deve renderizar o botão de Reiniciar com o conteúdo correto", () => {
      mockGame("over");
      render(<PulseRunner />);
      const button = screen.getByTestId("pulse-runner-restart-btn");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Reiniciar");
    });

    it("não deve renderizar o botão Jogar", () => {
      mockGame("over");
      render(<PulseRunner />);
      expect(
        screen.queryByTestId("pulse-runner-start-btn"),
      ).not.toBeInTheDocument();
    });
  });

  describe("estado running", () => {
    it("não deve renderizar nenhum botão de ação", () => {
      mockGame("running");
      render(<PulseRunner />);
      const buttonStart = screen.queryByTestId("pulse-runner-play-btn");
      const buttonRestart = screen.queryByTestId("pulse-runner-restart-btn");
      expect(buttonStart && buttonRestart).not.toBeInTheDocument();
    });
  });

  describe("score display", () => {
    it("deve formatar o score com cinco dígitos", () => {
      mockGame("running", 42);
      render(<PulseRunner />);
      expect(screen.getByTestId("pulse-runner-score")).toHaveTextContent(
        "00042",
      );
    });

    it("deve formatar o high score com cinco dígitos", () => {
      mockGame("running", 0, 1337);
      render(<PulseRunner />);
      expect(screen.getByTestId("pulse-runner-high")).toHaveTextContent(
        "01337",
      );
    });

    it("deve exibit o score zerado com 00000 antes de iniciar", () => {
      mockGame("idle");
      render(<PulseRunner />);
      const score = screen.getByTestId("pulse-runner-score");
      const high = screen.getByTestId("pulse-runner-high");
      expect(score && high).toHaveTextContent("00000");
    });
  });

  describe("acessibilidade", () => {
    it("canvas deve ter aria-label", () => {
      mockGame("idle");
      render(<PulseRunner />);
      const canvas = screen.getByTestId("pulse-runner-canvas");
      expect(canvas).toHaveAttribute(
        "aria-label",
        "Pulse Runner - mini-game estilo endless runner. Pressione Espaço ou clique para pular.",
      );
    });

    it("canvas deve ter tabIndex 0 quando não disabled", () => {
      mockGame("idle");
      render(<PulseRunner disabled={false} />);
      expect(screen.getByTestId("pulse-runner-canvas")).toHaveAttribute(
        "tabIndex",
      );
    });

    it("canvas deve ter tabIndex -1 quando disabled", () => {
      mockGame("idle");
      render(<PulseRunner disabled={true} />);
      expect(screen.getByTestId("pulse-runner-canvas")).toHaveAttribute(
        "tabIndex",
        "-1",
      );
    });
  });

  describe("prop disabled", () => {
    it("deve aplicar pointer-events-none quando disabled", () => {
      mockGame("idle");
      render(<PulseRunner disabled={true} />);
      expect(screen.getByTestId("pulse-runner-wrapper")).toHaveClass(
        "pointer-events-none",
      );
    });

    it("não deve aplicar pointer-events-none quando não disabled", () => {
      mockGame("idle");
      render(<PulseRunner disabled={false} />);
      expect(screen.getByTestId("pulse-runner-wrapper")).not.toHaveClass(
        "pointer-events-none",
      );
    });
  });

  describe("hint de tradução", () => {
    it("deve renderizar o hint corretamente", () => {
      mockGame("idle");
      render(<PulseRunner />);
      const hint = screen.getByTestId("pulse-runner-hint");
      expect(hint).toBeInTheDocument();
      expect(hint).toHaveTextContent(
        "Use espaço ou clique para pular os obstáculos.",
      );
    });
  });
});
