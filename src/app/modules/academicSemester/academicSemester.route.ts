import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidations.createAcademicSemesterValidationSchema,
  ), // middleware for validation
  AcademicSemesterControllers.createAcademicSemester, // controller function
);

router.get('/', AcademicSemesterControllers.getAllAcademicSemesters);

router.get(
  '/:id',
  AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:id',
  validateRequest(
    academicSemesterValidations.updateAcademicSemesterValidationSchema,
  ), // middleware for validation
  AcademicSemesterControllers.updateAcademicSemester, // controller function
);

export const AcademicSemesterRoutes = router;
