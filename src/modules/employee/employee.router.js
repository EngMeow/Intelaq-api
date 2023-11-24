import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  allEmployees,
  deleteEmployeeById,
  getEmployeeById,
} from "./employee.controller.js";

const employeeRouter = express.Router();

// Routes for getting all Employees
employeeRouter.get("/", protect, allEmployees);

// Routes for getting a Employee by id
employeeRouter.get("/:id", protect, getEmployeeById);

// Routes for deleting a Employee by id
employeeRouter.delete("/:id", protect, deleteEmployeeById);

export default employeeRouter;

