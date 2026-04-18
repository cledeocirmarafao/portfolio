import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Scene3D from "./Scene3D";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="scene3d-canvas" {...props}>
      {children}
    </div>
  ),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Float: ({ children }: any) => <>{children}</>,
  MeshDistortMaterial: () => null,
}));

vi.mock("three", () => ({
  Mesh: class Mesh {
    rotation = { x: 0, y: 0 };
  },
  Points: class Points {
    rotation = { x: 0, y: 0 };
  },
}));

describe("Scene3D", () => {
  it("deve rendrizar sem quebrar", () => {
    render(<Scene3D />);
    expect(document.body).toBeTruthy();
  });

  it("deve renderizar o container", () => {
    render(<Scene3D />);
    expect(screen.getByTestId("scene3d-container")).toBeInTheDocument();
  });

  it("deve renderizar o canvas", () => {
    render(<Scene3D />);
    expect(screen.getByTestId("scene3d-canvas")).toBeInTheDocument();
  });

  it("deve ter as classes corretas no container", () => {
    render(<Scene3D />);
    const container = screen.getByTestId("scene3d-container");
    expect(container).toHaveClass("absolute");
    expect(container).toHaveClass("inset-0");
    expect(container).toHaveClass("-z-10");
  });

  it("o canvas deve estar dentro do container", () => {
    render(<Scene3D />);
    const container = screen.getByTestId("scene3d-container");
    const canvas = screen.getByTestId("scene3d-canvas");
    expect(container).toContainElement(canvas);
  });
});
