import express from "express";
import { checkEmployee, checkEmployer, protect } from "../../middlewares/authMiddleware.js";
import { createApplication ,getJobApplications, getApplicationById, updateApplication , deleteApplication} from "./application.controller.js";

const applicationRouter = express.Router({ mergeParams: true });

// Routes for handling classes
applicationRouter
  .route("/")
  .post(protect, checkEmployee , createApplication)
  .get(protect, getJobApplications)

applicationRouter
  .route("/:id")
  .get(protect, getApplicationById)
  .put(protect, checkEmployer,updateApplication)
  .delete(protect, deleteApplication);

// Routes for handling teachers and students in a class

export default applicationRouter;
