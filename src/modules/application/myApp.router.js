import express from "express";
import { checkEmployee, protect } from "../../middlewares/authMiddleware.js";
import { getMyApplications,getApplications } from "./application.controller.js";

const myApplicationRouter = express.Router({ mergeParams: true });

myApplicationRouter
  .route("/")
  .get(protect, checkEmployee , getMyApplications)

  myApplicationRouter
  .route("/all")
  .get(protect , getApplications)


export default myApplicationRouter;
