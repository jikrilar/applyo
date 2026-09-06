// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApplicationForm } from "./application-form";

const mocks = vi.hoisted(() => ({
  createApplication: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));

vi.mock("@/app/(workspace)/aplikasi/actions", () => ({
  createApplicationAction: mocks.createApplication,
  updateApplicationAction: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ApplicationForm compensation", () => {
  it("uses the preference currency without showing a currency field", async () => {
    const user = userEvent.setup();
    const updatedBoard = { stages: [], cardsByStage: {} };
    const onSaved = vi.fn();
    mocks.createApplication.mockResolvedValue({ success: true, data: updatedBoard });
    const { container } = render(
      <ApplicationForm
        currency="USD"
        stages={[
          {
            id: "wishlist-stage",
            name: "Wishlist",
            systemKey: "wishlist",
            colorKey: "yellow",
            position: 0,
            isClosed: false,
            isVisible: true,
          },
        ]}
        onCancel={vi.fn()}
        onSaved={onSaved}
      />,
    );

    expect(screen.queryByText("Mata uang")).not.toBeInTheDocument();
    expect(container.querySelector('input[name="currency"]')).toHaveAttribute("type", "hidden");
    expect(container.querySelector('input[name="currency"]')).toHaveValue("USD");

    await user.type(screen.getByLabelText("Perusahaan *"), "Applyo");
    await user.type(screen.getByLabelText("Posisi *"), "Frontend Engineer");
    await user.click(screen.getByRole("button", { name: "Simpan lamaran" }));

    await waitFor(() =>
      expect(mocks.createApplication).toHaveBeenCalledWith(
        expect.objectContaining({ currency: "USD" }),
      ),
    );
    expect(onSaved).toHaveBeenCalledWith(updatedBoard);
  });
});
