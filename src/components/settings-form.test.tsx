// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SettingsForm } from "./settings-form";

vi.mock("@/app/(workspace)/pengaturan/actions", () => ({
  deleteAccountAction: vi.fn(),
  updatePreferencesAction: vi.fn(),
  updateProfileAction: vi.fn(),
  updateStageVisibilityAction: vi.fn(),
}));

afterEach(cleanup);

describe("SettingsForm account deletion dialog", () => {
  it("shows a styled close control without a delete control in the top-left corner", async () => {
    const user = userEvent.setup();
    render(
      <SettingsForm
        account={{ displayName: "Ayu", email: "ayu@example.com" }}
        preferences={{ currency: "IDR", dateFormat: "DD MMM YYYY", timezone: "Asia/Jakarta" }}
        stages={[]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Hapus akun" }));

    const dialog = screen.getByRole("alertdialog");
    const closeButton = within(dialog).getByRole("button", { name: "Tutup dialog" });
    expect(closeButton).toHaveClass("delete-dialog-close");
    expect(dialog.querySelector(".delete-dialog-icon")).not.toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Hapus permanen" })).toBeDisabled();

    await user.click(closeButton);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
