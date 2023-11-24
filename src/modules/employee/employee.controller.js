import { EmployeeModel } from '../../../databases/models/employee.model.js';
import { UserModel } from '../../../databases/models/user.model.js';
import { deleteEntityById, getAllEntities, getEntityById } from '../../utils/factory.js';
import tryCatch from '../../utils/tryCatch.js';

// get all Employees
const allEmployees = tryCatch(async (req, res) => {
  const entities = await getAllEntities(req, res, EmployeeModel);
  res.status(200).json(entities);
});

// get Employee by id
const getEmployeeById = tryCatch(async (req, res) => {
  const entity = await getEntityById(req, res, EmployeeModel);
  res.status(200).json(entity);
});

// delete Employee by id
const deleteEmployeeById = tryCatch(async (req, res) => {
  const entity = await deleteEntityById(req, res, EmployeeModel);

// delete the profile associated with the Employee
  req.params.id = entity.profileId;
  await deleteEntityById(req, res, UserModel);
  res.status(200).json(entity);
});

export { allEmployees, getEmployeeById, deleteEmployeeById };
