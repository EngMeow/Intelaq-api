import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  allEmployers,
  getEmployerById,
  deleteEmployerById,
} from "./employer.controller.js";

const employerRouter = express.Router();

// Routes for getting all Employers
employerRouter.get("/", protect, allEmployers);

// Routes for getting a Employer by id
employerRouter.get("/:id", protect, getEmployerById);

// Routes for deleting a Employer by id
employerRouter.delete("/:id", protect, deleteEmployerById);

export default employerRouter;
