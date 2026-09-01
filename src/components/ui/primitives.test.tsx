// @vitest-environment jsdom
import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";
import { Field, FieldError, FieldHelp, Input, Label } from "./form";

afterEach(cleanup);

describe("Button", () => {
  it("disables interaction and announces loading state", async () => {
    const user = userEvent.setup();
    let clicks = 0;
    render(
      <Button loading onClick={() => clicks++}>
        Simpan
      </Button>,
    );
    const button = screen.getByRole("button", { name: /simpan/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status", { name: "Memuat" })).toBeInTheDocument();
    await user.click(button);
    expect(clicks).toBe(0);
  });
});

describe("Field", () => {
  it("connects input help and validation messages", () => {
    render(
      <Field>
        <Label htmlFor="email">Email</Label>
        <Input id="email" aria-invalid="true" />
        <FieldHelp>Gunakan email aktif.</FieldHelp>
        <FieldError>Email tidak valid.</FieldError>
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(describedBy).toHaveLength(2);
    expect(describedBy).toContain(screen.getByText("Gunakan email aktif.").id);
    expect(describedBy).toContain(screen.getByRole("alert").id);
  });
});

describe("Dialog", () => {
  it("closes with Escape and restores focus to its trigger", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Buka</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Judul</DialogTitle>
          <DialogDescription>Penjelasan</DialogDescription>
          <button>Berikutnya</button>
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Buka" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Judul" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
