import { Router } from 'express';
import {
  getInstructors,
  createInstructor,
} from '../controllers/instructorController';

const router = Router();

router.route('/').get(getInstructors).post(createInstructor);

export default router;