import { NotFoundError } from "../errors/index.js";



const getAllEntities = async (req, res, model) => {
  // filter by user email or name
  let query = {};
  if (req.query.name) {
    query = {
      $or: [
        { 'profile.firstName': { $regex: new RegExp(req.query.name, 'i') } },
        { 'profile.email': { $regex: new RegExp(`^${req.query.name}`, 'i') } },
      ],
    };
  }

  // paginate
  let options = {};
  if (req.query.pgnum) {
    const page = req.query.pgnum ? parseInt(req.query.pgnum) : 1;
    const limit = req.query.pgsize ? parseInt(req.query.pgsize) : 10;
    options = {
      skip: (page - 1) * limit,
      limit,
    };
  }

  const entities = await model.find(query)
    .populate('profile', { name: true, email: true, nationalID: true, phone: true, role: true })
    .skip(options.skip)
    .limit(options.limit);

  if (!entities || entities.length === 0) throw new NotFoundError(`${model}s not found`, 404);
  return entities;
};


const getEntityById = async (req, res, model) => {
  const entity = await model.findById(req.params.id)
  .populate('profile')
  if(entity.profile.role == 'employee'){
    entity.populate('assignedApplications')
  }
  if(entity.profile.role == 'employer'){
    entity.populate('createdJobs');
  }
  if (!entity) throw new NotFoundError(`${model} not found`, 404);
  return entity;
};

const updateEntityById = async (req, res, model) => {
  const entity = await model.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('profile');
  if (!entity) throw new NotFoundError(`${model} not found`, 404);
  return entity;
};

const deleteEntityById = async (req, res, model) => {
  const entity = await model.findByIdAndDelete(req.params.id).populate('profile');
  if (!entity) throw new NotFoundError(`${model} not found`, 404);
  return entity;
};

export { getAllEntities, getEntityById, updateEntityById, deleteEntityById };
