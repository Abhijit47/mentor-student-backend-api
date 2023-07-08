import express from 'express';
import mentorController from '../controllers/mentorControllers.js';
// Create a router for mentor
const router = express.Router();


router.route('/create-mentor')
  .post(mentorController.createMentor);

router.route('/getMentor/:id')
  .get(mentorController.getMentor);

router.route('/getAllMentors')
  .get(mentorController.getAllMentors);

router.route('/update-mentor/:id')
  .patch(mentorController.updateMentor);

router.route('/change_mentor')
  .post(mentorController.changeMentor);

router.route('/assign-mentor')
  .post(mentorController.assignMentor);

router.route('/change-mentor')
  .post(mentorController.changeMentor);

export default router;