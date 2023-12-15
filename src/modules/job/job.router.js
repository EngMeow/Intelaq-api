import express from "express";
import { checkEmployer, protect } from "../../middlewares/authMiddleware.js";
import { createJob, getJobes, getJobById , updatejob, deletejob, RecommendedJob, getMyJobs } from "./job.controller.js";
import applicationRouter from "../application/application.router.js";

const jobRouter = express.Router();

// Routes for handling classes
jobRouter
  .route("/")
  .get(protect, getJobes)
  .post(protect, checkEmployer,createJob);
jobRouter
  .route("/recommended")
  .get(protect, RecommendedJob)

jobRouter
  .route('/myJobs')
  .get(protect, checkEmployer , getMyJobs)
jobRouter
  .route("/:id")
  .get(protect, getJobById)
  .put(protect, updatejob)
  .delete(protect, deletejob);

jobRouter
  .use("/:id/apply",applicationRouter)

export default jobRouter;
