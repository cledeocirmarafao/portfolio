import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useGitHubData } from "./useGithubData";

vi.mock("axios");

const generateMockContributions = (
  days: { date: string; count: number; level: number }[],
) => ({
  total: { "2025": 100, "2026": 50 },
  contributions: days,
});

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split("T")[0];

const recentDate = formatDate(
  new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
);

const oldDate = formatDate(
  new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
);

const mockEmptyResponse = { data: generateMockContributions([]) };

const mockWithContributions = {
  data: generateMockContributions([{ date: recentDate, count: 5, level: 2 }]),
};

const mockNetworkError = new Error("Network Error");

describe("useGithubData", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(today);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("deve iniciar com totalContributions igual a 0", () => {
    vi.mocked(axios.get).mockResolvedValue(mockEmptyResponse);
    const { result } = renderHook(() => useGitHubData());
    expect(result.current.totalContributions).toBe(0);
  });

  it("deve iniciar com contributions como um array vazio", () => {
    vi.mocked(axios.get).mockResolvedValue(mockEmptyResponse);
    const { result } = renderHook(() => useGitHubData());
    expect(result.current.contributions).toEqual([]);
  });

  it("deve buscar os dados da API corretamente", async () => {
    vi.mocked(axios.get).mockResolvedValue(mockWithContributions);

    renderHook(() => useGitHubData());

    await waitFor(() => {
      expect(vi.mocked(axios.get)).toHaveBeenCalledWith(
        expect.stringContaining("cledeocirmarafao"),
      );
    });
  });

  it("deve chamar a API com o parâmetro y=all", async () => {
    vi.mocked(axios.get).mockResolvedValue(mockEmptyResponse);
    renderHook(() => useGitHubData());
    await waitFor(() => {
      expect(vi.mocked(axios.get)).toHaveBeenCalledWith(
        expect.stringContaining("y=all"),
      );
    });
  });

  it("deve calcular o total de contribuições corretamente", async () => {
    vi.mocked(axios.get).mockResolvedValue(mockEmptyResponse);
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      expect(result.current.totalContributions).not.toBe(0);
    });
    expect(result.current.totalContributions).toBe(150);
  });

  it("deve retornar 0 se o total for undefined", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { contribution: [] },
    });
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      expect(result.current.totalContributions).toBe(0);
    });
  });

  it("deve incluir contribuições do último ano", async () => {
    vi.mocked(axios.get).mockResolvedValue(mockWithContributions);
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      const allDays = result.current.contributions.flatMap((w) => w.days);
      const found = allDays.find((d) => d.date === recentDate);
      expect(found).toBeDefined();
      expect(found?.count).toBe(5);
      expect(found?.level).toBe(2);
    });
  });

  it("deve descartar contribuições mais antigas que 1 ano", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: generateMockContributions([{ date: oldDate, count: 10, level: 3 }]),
    });
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      const allDays = result.current.contributions.flatMap((w) => w.days);
      const found = allDays.find((d) => d.date === oldDate && d.count === 10);
      expect(found).toBeUndefined();
    });
  });

  it("deve preencher dias sem contribuições com count 0 e level 0", async () => {
    vi.mocked(axios.get).mockResolvedValue(mockWithContributions);
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      const allDays = result.current.contributions.flatMap((w) => w.days);
      const emptyDay = allDays.find((d) => d.count === 0);
      expect(emptyDay).toBeDefined();
      expect(emptyDay?.level).toBe(0);
    });
  });

  it("deve retornar contributions como array de semanas", async () => {
    vi.mocked(axios.get).mockResolvedValue(mockWithContributions);
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      expect(Array.isArray(result.current.contributions)).toBe(true);
      expect(result.current.contributions.length).toBeGreaterThan(0);
    });
  });

  it("cada semana deve ter no máximo 7 dias", async () => {
    vi.mocked(axios.get).mockResolvedValue(mockWithContributions);
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      result.current.contributions.forEach((w) => {
        expect(w.days.length).toBeLessThanOrEqual(7);
      });
    });
  });

  it("deve resetar cobtributions para array vazio em caso de erro", async () => {
    vi.mocked(axios.get).mockRejectedValue(mockNetworkError);
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      expect(result.current.totalContributions).toBe(0);
    });
  });

  it("deve  resetar totalContributions para 0 em caso de erro", async () => {
    vi.mocked(axios.get).mockRejectedValue(mockNetworkError);
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      expect(result.current.totalContributions).toBe(0);
    });
  });

  it("não deve quebrar se contributions vier vazio da API", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { total: { "2026": 10 }, contributions: [] },
    });
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      expect(result.current.contributions).toEqual([]);
    });
  });

  it("não deve quebrar se conributions vier undefined da API", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { total: { "2026": 10 } },
    });
    const { result } = renderHook(() => useGitHubData());
    await waitFor(() => {
      expect(result.current.contributions).toEqual([]);
    });
  });
});
