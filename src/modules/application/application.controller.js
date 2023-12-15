import mongoose from "mongoose";
import { ApplicationModel } from "../../../databases/models/application.model.js";
import { JobModel } from "../../../databases/models/job.model.js";
import { UserModel } from "../../../databases/models/user.model.js";
import { ObjectId } from "mongodb";

const createApplication = async (req, res) => {
  try {
    const jobId = req.params.id
    // Fetch the employer
    const employeeObj = await UserModel.findById(req.user.id ,
      { name: true, email: true, nationalID: true, phone: true, role: true })
  
    const JobObj = await JobModel.findById({
      _id: jobId
    },{
      title:true, jobDescription:true, location:true, programmingLanguages:true, experienceLevel:true,
    });

    // Create a new Application and assign the employer
    const newApplication = new ApplicationModel({
        job: JobObj,
        employee: employeeObj,
    });

    await newApplication.save();

    res.status(201).json(newApplication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while creating the Application.' });
  }
};

const getApplications = async (req, res) => {
  let filter = {};
  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: 'i' };
  }
  try {
    const Applications = await ApplicationModel.find(filter)
      .populate('job', 'title jobDescription location programmingLanguages experienceLevel');
    res.status(200).json(Applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving Applications.' });
  }
};

const getJobApplications = async (req, res) => {
  
  const jobId = req.params.id;
  try {
    const Applications = await ApplicationModel.find({ "job": jobId })
      .populate('employee', 'name email nationalID phone role')
      .populate('job', 'title jobDescription location programmingLanguages experienceLevel');
    res.status(200).json(Applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving Applications.' });
  }
};

const getMyApplications = async (req, res) => {
  const employeeId = req.user._id;

  try {
    const myApplications = await ApplicationModel.find({
      "employee._id": employeeId})
    .populate('employee.profile', 'name email nationalID phone role')
    .populate('job', 'title jobDescription location programmingLanguages experienceLevel');

    res.status(200).json(myApplications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving Applicationes.' });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const Application = await ApplicationModel.findById(req.params.id)
    .populate('employee.profile', 'name email nationalID phone role')
    .populate('job' , 'title jobDescription location programmingLanguages experienceLevel');

    if (!Application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json(Application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving Application.' });
  }
};

const updateApplication = async (req, res) => {
  const { id } = req.params;
  const { status} = req.body;

  try {
    const updatedApplication = await ApplicationModel.findByIdAndUpdate(id, {
      status
    },{new:true});

    if (!updatedApplication) {
      throw new NotFoundError("Application not updated.", 400);
    }

    res.status(200).json(updatedApplication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while updating the Application.' });
  }
};

const deleteApplication = async (req, res) => {
    const id = req.params.id;
  
    try {
      const deletedApplication = await ApplicationModel.findByIdAndDelete(id);
  
      if (!deletedApplication) {
        throw new NotFoundError("Application not deleted.", 400);
      }
  
      res.status(200).json({ message: 'Application deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while deleting the Application.' });
    }
};

  export { createApplication, getApplications,getJobApplications, getMyApplications ,updateApplication, getApplicationById , deleteApplication};
  
    

