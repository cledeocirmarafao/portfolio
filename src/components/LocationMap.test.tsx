import { describe, it, expect, vi } from "vitest";
import { getByTestId, render, screen } from "@testing-library/react";
import { LocationMap } from "./LocationMap";

vi.mock("@/hooks/useMapbox", () => ({
  useMapbox: vi.fn(() => ({
    containerRef: { current: null },
    mapRef: { current: null },
  })),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("lucide-react", () => ({
  MapPin: () => <svg data-testid="icon-map-pin" />,
  ExternalLink: () => <svg data-testid="icon-external-link" />,
}));

describe("LocationMap", () => {
  it("deve renderizar sem quebrar", () => {
    render(<LocationMap />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar o container do mapa", () => {
    render(<LocationMap />);
    expect(screen.getByTestId("location-map-container")).toBeInTheDocument();
  });

  it("deve renderizar o título Localização", () => {
    render(<LocationMap />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Localização",
    );
  });

  it("deve renderizar o icone de localização", () => {
    render(<LocationMap />);
    expect(screen.getByTestId("icon-map-pin")).toBeInTheDocument();
  });

  it("deve renderizar o nome da cidade", () => {
    render(<LocationMap />);
    expect(screen.getByTestId("location-city")).toHaveTextContent(
      "Florianópolis, SC",
    );
  });

  it("deve renderizar o país", () => {
    render(<LocationMap />);
    expect(screen.getByTestId("location-country")).toHaveTextContent(
      "Brasil 🇧🇷",
    );
  });

  it("deve renderizar o link para o Google Maps", () => {
    render(<LocationMap />);
    const link = screen.getByTestId("location-maps-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://www.google.com/maps/place/Florian%C3%B3polis,+SC",
    );
  });

  it("deve abrir em uma nova aba", () => {
    render(<LocationMap />);
    expect(screen.getByTestId("location-maps-link")).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("deve ter rel noopener noreferrer", () => {
    render(<LocationMap />);
    expect(screen.getByTestId("location-maps-link")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("deve renderizar o texto do link", () => {
    render(<LocationMap />);
    expect(screen.getByTestId("location-maps-link")).toHaveTextContent(
      "Ver no Google Maps",
    );
  });
});
