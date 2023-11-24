import { JobModel } from "../../../databases/models/job.model.js";
import { UserModel } from "../../../databases/models/user.model.js";
import natural from 'natural';
const tokenizer = new natural.WordTokenizer();

const createJob = async (req, res) => {
  console.log(req.user);
  const { title, jobDescription, location, programmingLanguages, experienceLevel } = req.body;

  try {
    // Fetch the employer
    const employerObj = await UserModel.findById(req.user.id,
      { name: true, email: true, nationalID: true, phone: true, role: true });

    // Create a new job and assign the employer
    const newJob = new JobModel({
      title,
      jobDescription,
      location,
      programmingLanguages,
      experienceLevel,
      employer: employerObj,
    });
    await newJob.save();

    res.status(201).json(newJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while creating the Job.' });
  }
};

const getJobes = async (req, res) => {
  let filter = {};
  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: 'i' };
  }

  try {
    const Jobes = await JobModel.find(filter)
      .populate('employer.profile', 'name email nationalID phone role')
      .populate('jobApplication');

    res.status(200).json(Jobes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving Jobes.' });
  }
};


const getJobById = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id)
      job.populate({
        path: 'employer',
        populate: { path: 'profile', select: 'name email nationalID phone role'}
      })
      job.populate('jobApplication');

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving Job.' });
  }
};



const updatejob = async (req, res) => {
    const { id } = req.params;
    const { title, jobDescription, location, programmingLanguages ,experienceLevel} = req.body;
  
    try {
      const updatedjob = await JobModel.findByIdAndUpdate(id, {
        title,
        jobDescription,
        location,
        programmingLanguages,
        experienceLevel
      });
  
      if (!updatedjob) {
        throw new NotFoundError("job not updated.", 400);
      }
  
      res.status(200).json(updatedjob);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while updating the job.' });
    }
  };
  
const deletejob = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedjob = await JobModel.findByIdAndDelete(id);
  
      if (!deletedjob) {
        throw new NotFoundError("job not deleted.", 400);
      }
  
      res.status(200).json({ message: 'job deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while deleting the job.' });
    }
  };




  {/*================== Recommended Job ==================*/}
  
  const calculateJaccardSimilarity = (user, job) => {
    // Tokenize user and job text
    const userTokens = new Set(tokenizer.tokenize(`${user.progLanguage} ${user.city} ${user.experienceLevel} ${user.bio}`));
    const jobTokens = new Set(tokenizer.tokenize(`${job.programmingLanguages.join(' ')} ${job.location} ${job.experienceLevel} ${job.title}`));

    // Calculate Jaccard similarity
    const intersection = new Set([...userTokens].filter(x => jobTokens.has(x)));
    const union = new Set([...userTokens, ...jobTokens]);
    const similarity = intersection.size / union.size;

    return similarity;
};

const RecommendedJob = async (req, res) => {
    try {
        // Fetch the user (Programming language, City, Experience level, Information from bio text)
        const user = await UserModel.findById(req.user.id, {
            progLanguage: true,
            bio: true,
            city: true,
            experienceLevel: true,
        });

        // Fetch all jobs
        const allJobs = await JobModel.find({}, { programmingLanguages: true, location: true, experienceLevel: true, title: true });

        // Calculate cosine similarity for each job
        const similarities = allJobs.map(job => ({
          job,
          similarity: calculateJaccardSimilarity(user, job)
      }));

        // Sort jobs by similarity score in descending order
        const recommendedJobs = similarities.sort((a, b) => b.similarity - a.similarity);

        res.status(200).json(recommendedJobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while fetching recommended jobs.' });
    }
};


export { createJob, getJobes, getJobById, updatejob, deletejob, RecommendedJob };
  
    

