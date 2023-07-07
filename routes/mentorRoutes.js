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

export default router;