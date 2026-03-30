import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GitHubContributionGraph } from "./GithubContributionGraph";
import type { ContributionWeek } from "../hooks/useGithubData";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      const translations: Record<string, unknown> = {
        "about.contributions": "contribuições",
        "about.contributions_period": "nos últimos 6 meses",
        "github.contributions_on": "contribuições",
        "github.less": "Menos",
        "github.more": "Mais",
        "github.months": [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
        "github.days": ["", "Seg", "", "Qua", "", "Sex", ""],
      };
      if (!(key in translations)) {
        throw new Error(`Chave de tradução não mockada: "key${key}"`);
      }
      if (options?.returnObjects) {
        return translations[key];
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

const makeWeek = (startDate: string): ContributionWeek => {
  const days = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split("T")[0],
      count: i === 3 ? 5 : 0,
      level: i === 3 ? 5 : 0,
    });
  }
  return { days };
};

const singleWeek: ContributionWeek[] = [makeWeek("2026-03-23")];

const multipleWeeks: ContributionWeek[] = [
  makeWeek("2026-01-05"),
  makeWeek("2026-01-12"),
  makeWeek("2026-01-19"),
  makeWeek("2026-02-02"),
  makeWeek("2026-03-02"),
  makeWeek("2026-03-09"),
];

describe("GithubContributionGraph", () => {
  it("deve renderizar sem quebrar", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={0} />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar o container principal", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={0} />);
    expect(screen.getByTestId("contribution-graph")).toBeInTheDocument();
  });

  it("deve exibir  total de contribuições", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={550} />);
    expect(screen.getByTestId("contribution-total")).toHaveTextContent("550");
  });

  it("deve exibir o label de contribuições traduzido", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={550} />);
    expect(screen.getByTestId("contribution-total")).toHaveTextContent(
      "contribuições",
    );
  });

  it("deve exibir 0 quando não houver contribuições", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={0} />);
    expect(screen.getByTestId("contribution-total")).toHaveTextContent("0");
  });

  it("deve renderizar o container de  labels de meses", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={0} />);
    expect(screen.getByTestId("month-labels")).toBeInTheDocument();
  });

  it("deve renderizar o label do mês correto", () => {
    render(
      <GitHubContributionGraph weeks={singleWeek} totalContributions={0} />,
    );
    expect(screen.getByTestId("month-label-Mar")).toBeInTheDocument();
  });

  it("deve renderizar o label do mês correto", () => {
    render(
      <GitHubContributionGraph weeks={singleWeek} totalContributions={0} />,
    );
    expect(screen.getByTestId("month-label-Mar")).toBeInTheDocument();
  });

  it("não deve renderizar labels de mês sobrepostos", () => {
    render(
      <GitHubContributionGraph weeks={multipleWeeks} totalContributions={0} />,
    );
    const janLabels = screen.queryAllByTestId("month-label-jan");
    expect(janLabels.length).toBeLessThanOrEqual(1);
  });

  it("deve renderizar labels para meses diferentes", () => {
    render(
      <GitHubContributionGraph weeks={multipleWeeks} totalContributions={0} />,
    );
    expect(screen.getByTestId("month-label-Jan")).toBeInTheDocument();
    expect(screen.getByTestId("month-label-Mar")).toBeInTheDocument();
  });

  it("deve renderizar a legenda", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={0} />);
    expect(screen.getByTestId("contribution-legend")).toBeInTheDocument();
  });

  it("deve renderizar o texto menos e mais na legenda", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={0} />);
    const legend = screen.getByTestId("contribution-legend");
    expect(legend).toHaveTextContent("Menos");
    expect(legend).toHaveTextContent("Mais");
  });

  it("deve renderizar 5 quadrinhos na legenda", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={0} />);
    const legend = screen.getByTestId("contribution-legend");
    const cells = legend.querySelectorAll(".rounded-\\[2px\\]");
    expect(cells).toHaveLength(5);
  });

  it("deve renderizar 7 quadradinhos por semana", () => {
    render(
      <GitHubContributionGraph weeks={singleWeek} totalContributions={0} />,
    );
    const graph = screen.getByTestId("contribution-graph");
    const cells = graph.querySelectorAll('[style*="width: 10px"]');
    expect(cells.length).toBeGreaterThanOrEqual(7);
  });

  it("deve ter o período de contribuições", () => {
    render(<GitHubContributionGraph weeks={[]} totalContributions={0} />);
    expect(screen.getByText("nos últimos 6 meses")).toBeInTheDocument();
  });
});
