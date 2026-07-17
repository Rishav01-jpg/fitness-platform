import express from "express";

import {
  createIndividual,
  getAllIndividuals,
  getIndividualById,
  updateIndividual,
  deleteIndividual,
} from "./individual.controller.js";

const router = express.Router();

router.get("/", getAllIndividuals);
router.get("/:individualId", getIndividualById);
router.post("/", createIndividual);
router.put("/:individualId", updateIndividual);
router.delete("/:individualId", deleteIndividual);

export default router;