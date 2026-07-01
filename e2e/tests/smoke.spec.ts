import { test, expect } from "@playwright/test";

test("busca rick, abre detalle y volver conserva la busqueda (D-27)", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar personaje por nombre").fill("rick");

  // auto-waiting: el input se debouncea (300ms) antes de reflejarse en la URL,
  // asi que esperamos a que la URL tenga el filtro aplicado antes de mirar cards.
  await expect(page).toHaveURL(/name=rick/);

  const firstCard = page.getByRole("link").first();
  await expect(firstCard).toBeVisible();
  const characterName = await firstCard.locator("span").first().innerText();

  await firstCard.click();

  await expect(page).toHaveURL(/\/character\/\d+/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(characterName);
  await expect(page.getByText("Especie")).toBeVisible();

  await page.getByRole("button", { name: "← Volver" }).click();

  await expect(page).toHaveURL(/name=rick/);
  await expect(page.getByLabel("Buscar personaje por nombre")).toHaveValue("rick");
});

test("busqueda sin resultados muestra el mensaje vacio", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar personaje por nombre").fill("zzzzzzzz");

  await expect(page.getByText("No se encontraron personajes.")).toBeVisible();
});

test("paginacion avanza a la siguiente pagina de resultados", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar personaje por nombre").fill("rick");
  await expect(page).toHaveURL(/name=rick/);
  await expect(page.getByText("Página 1 de 2")).toBeVisible();

  await page.getByRole("button", { name: "Siguiente" }).click();

  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText("Página 2 de 2")).toBeVisible();
  await expect(page.getByRole("button", { name: "Siguiente" })).toBeDisabled();
});
