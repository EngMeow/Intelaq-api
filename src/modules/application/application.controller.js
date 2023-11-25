import { ApplicationModel } from "../../../databases/models/application.model.js";
import { JobModel } from "../../../databases/models/job.model.js";
import { UserModel } from "../../../databases/models/user.model.js";

const createApplication = async (req, res) => {
  try {
    const id = req.params.id
    console.log(req.params);
    // Fetch the employer
    const employeeObj = await UserModel.findById(req.user.id ,
      { name: true, email: true, nationalID: true, phone: true, role: true })
  
    const JobObj = await JobModel.findById(id , {
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

const getApplicationes = async (req, res) => {
  let filter = {};
  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: 'i' };
  }
  
  try {
    const Applicationes = await ApplicationModel.find(filter)

    res.status(200).json(Applicationes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving Applicationes.' });
  }
};

// get my applicaitons ( not done yet )
const getMyApplications = async (req, res) => {
  let queryFilters = {};

  if (req.user.role === "ADMIN") {
    const adminId = req.user.admin.id;
    queryFilters = {
      createdBy: Number(adminId),
    };
  } else if (req.user.role === "employee" || req.user.role === "STUDENT") {
    let userRoleKey = req.user.role.toLowerCase();
    const userRoleId = req.user[userRoleKey].id;

    queryFilters = {
      [`${userRoleKey}.id`]: Number(userRoleId),
    };
  } else {
    throw new InvalidRoleError("Invalid role.", 400);
  }


  try {
    const Applicationes = await ApplicationModel.find(filter)
      .populate('employee.profile', 'name email nationalID phone role')
      .populate('job');

    res.status(200).json(Applicationes);
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

  export { createApplication, getApplicationes, getMyApplications ,updateApplication, getApplicationById , deleteApplication};
  
    

