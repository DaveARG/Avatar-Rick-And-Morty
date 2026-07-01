import { Router } from "express";
import { fetchCharacterById, fetchCharacterList } from "../services/rickAndMorty.service.js";
import { NotFoundError, ValidationError } from "../middlewares/errorHandler.js";
import type { CharacterListResponse } from "../types/character.types.js";
import { validateId, validateName, validatePage } from "../validators/characters.validators.js";

export const charactersRouter = Router();

charactersRouter.get("/", async (req, res, next) => {
  try {
    const name = validateName(req.query.name);
    if (name === null) {
      throw new ValidationError("name must be at most 100 characters");
    }
    const page = validatePage(req.query.page);
    if (page === null) {
      throw new ValidationError("page must be a positive integer");
    }

    const { status, body } = await fetchCharacterList(name, page);

    if (status === 200) {
      res.json(body as CharacterListResponse);
      return;
    }
    if (status === 404) {
      // name sin match O page fuera de rango: ambas se normalizan igual
      const empty: CharacterListResponse = {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
      res.json(empty);
      return;
    }
    throw new Error(`unexpected upstream status ${status}`);
  } catch (err) {
    next(err);
  }
});

charactersRouter.get("/:id", async (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    if (id === null) {
      throw new ValidationError("id must be a positive integer");
    }

    const { status, body } = await fetchCharacterById(id);

    if (status === 200) {
      res.json(body);
      return;
    }
    if (status === 404) {
      throw new NotFoundError("Character not found");
    }
    throw new Error(`unexpected upstream status ${status}`);
  } catch (err) {
    next(err);
  }
});
