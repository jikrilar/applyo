// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemedDateOnlyPicker, ThemedDatePicker } from "./date-picker";

afterEach(cleanup);

describe("ThemedDateOnlyPicker", () => {
  it("keeps the selected date in FormData and restores focus after selection", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <ThemedDateOnlyPicker name="appliedAt" defaultValue="2026-09-12" />
      </form>,
    );
    const form = container.querySelector("form");
    const trigger = container.querySelector<HTMLButtonElement>(".date-picker-trigger");

    expect(form).not.toBeNull();
    expect(trigger).not.toBeNull();
    expect(new FormData(form!).get("appliedAt")).toBe("2026-09-12");

    await user.click(trigger!);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveClass("open");
    expect(screen.getByRole("gridcell", { name: "12" })).toHaveClass("selected");

    await user.click(screen.getByRole("gridcell", { name: "13" }));
    expect(new FormData(form!).get("appliedAt")).toBe("2026-09-13");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger!);
    expect(screen.getByRole("gridcell", { name: "13" })).toHaveClass("selected");
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("supports keyboard day navigation and disabled date limits", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ThemedDateOnlyPicker
        name="startDate"
        defaultValue="2026-09-15"
        min="2026-09-10"
        max="2026-09-20"
      />,
    );
    const trigger = container.querySelector<HTMLButtonElement>(".date-picker-trigger");

    await user.click(trigger!);
    expect(screen.getByRole("gridcell", { name: "9" })).toBeDisabled();
    expect(screen.getByRole("gridcell", { name: "21" })).toBeDisabled();

    const selectedDay = screen.getByRole("gridcell", { name: "15" });
    selectedDay.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("gridcell", { name: "16" })).toHaveFocus();
  });
});

describe("ThemedDatePicker", () => {
  it("preserves the time and field name when another day is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <ThemedDatePicker name="scheduledAt" defaultValue="2026-09-12T10:30" />
      </form>,
    );
    const form = container.querySelector("form");
    const trigger = container.querySelector<HTMLButtonElement>(".date-picker-trigger");

    await user.click(trigger!);
    await user.click(screen.getByRole("gridcell", { name: "13" }));
    await user.click(screen.getByRole("button", { name: "Gunakan tanggal" }));

    expect(new FormData(form!).get("scheduledAt")).toBe("2026-09-13T10:30");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
