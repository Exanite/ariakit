import { click, getByRole, press } from "@ariakit/test";

function getTab(name: string) {
  return getByRole("tab", { name });
}

function getPanel(name: string) {
  return getByRole("tabpanel", { name });
}

test("default selected tab", () => {
  expect(getTab("Fruits")).toHaveAttribute("aria-selected", "true");
  expect(getPanel("Fruits")).toBeVisible();
});

test("select with keyboard", async () => {
  await press.Tab();
  await press.ArrowRight();
  expect(getTab("Fruits")).toHaveAttribute("aria-selected", "true");
  expect(getPanel("Fruits")).toBeVisible();
  expect(getTab("Vegetables")).toHaveFocus();
  expect(getTab("Vegetables")).toHaveAttribute("aria-selected", "false");
  await press.Enter();
  expect(getTab("Vegetables")).toHaveAttribute("aria-selected", "true");
  expect(getPanel("Vegetables")).toBeVisible();
  await press.ArrowRight();
  expect(getTab("Vegetables")).toHaveAttribute("aria-selected", "true");
  expect(getPanel("Vegetables")).toBeVisible();
  expect(getTab("Meat")).toHaveFocus();
  expect(getTab("Meat")).toHaveAttribute("aria-selected", "false");
  await press.Space();
  expect(getTab("Meat")).toHaveAttribute("aria-selected", "true");
  expect(getPanel("Meat")).toBeVisible();
  await press.ArrowRight();
  expect(getTab("Meat")).toHaveAttribute("aria-selected", "true");
  expect(getPanel("Meat")).toBeVisible();
  expect(getTab("Fruits")).toHaveFocus();
  expect(getTab("Fruits")).toHaveAttribute("aria-selected", "false");
  await press.Enter();
  expect(getTab("Fruits")).toHaveAttribute("aria-selected", "true");
  expect(getPanel("Fruits")).toBeVisible();
  await press.ArrowLeft();
  await press.Space();
  expect(getTab("Meat")).toHaveAttribute("aria-selected", "true");
  expect(getTab("Meat")).toHaveFocus();
  expect(getPanel("Meat")).toBeVisible();
});

test("select with mouse", async () => {
  await click(getTab("Vegetables"));
  expect(getTab("Vegetables")).toHaveAttribute("aria-selected", "true");
  expect(getTab("Vegetables")).toHaveFocus();
  expect(getPanel("Vegetables")).toBeVisible();
});
