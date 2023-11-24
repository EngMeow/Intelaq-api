import { EmployerModel } from '../../../databases/models/employer.model.js';
import { UserModel } from '../../../databases/models/user.model.js';
import { deleteEntityById, getAllEntities, getEntityById } from '../../utils/factory.js';
import tryCatch from '../../utils/tryCatch.js';

// get all Employers
const allEmployers = tryCatch(async (req, res) => {
  const entities = await getAllEntities(req, res, EmployerModel);
  res.status(200).json(entities);
});

// get Employer by id
const getEmployerById = tryCatch(async (req, res) => {
  const entity = await getEntityById(req, res, EmployerModel);
  res.status(200).json(entity);
});

// delete Employer by id
const deleteEmployerById = tryCatch(async (req, res) => {
  const entity = await deleteEntityById(req, res, EmployerModel);

// delete the profile associated with the Employer
  req.params.id = entity.profileId;
  await deleteEntityById(req, res, UserModel);
  res.status(200).json(entity);
});

export { allEmployers, getEmployerById, deleteEmployerById };
