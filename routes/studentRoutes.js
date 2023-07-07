import express from 'express';
import studentController from '../controllers/studentControllers.js';
// Create a router for mentor
const router = express.Router();

router.route('/create-student')
  .post(studentController.createStudent);

router.route('/all-students')
  .get(studentController.getAllStudents);

router.route('/unassigned-students')
  .get(studentController.getUnassignedStudents);

router.route('/assigned-students')
  .get(studentController.getassignedStudents);

router.route('/add-mentor/:id')
  .patch(studentController.addMentor);

export default router;