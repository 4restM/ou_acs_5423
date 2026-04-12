import { Router } from 'express';
import {
  getInstructors,
  getInstructorById,
  checkInstructorName,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../controllers/instructorController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: Instructor management (UC1)
 */

/**
 * @swagger
 * /instructors/check-name:
 *   post:
 *     summary: Check if an instructor name already exists
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Name check result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NameCheckResponse'
 */
router.post('/check-name', checkInstructorName);

/**
 * @swagger
 * /instructors:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: List of instructors sorted by last name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 *   post:
 *     summary: Create a new instructor
 *     description: >
 *       Creates an instructor with an auto-generated ID (e.g. I00001).
 *       Returns a confirmation message for the instructor's preferred communication channel.
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstructorInput'
 *     responses:
 *       201:
 *         description: Instructor created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 instructor:
 *                   $ref: '#/components/schemas/Instructor'
 *                 confirmationMessage:
 *                   type: string
 *                   example: "Welcome to Yoga'Hom! Your instructor id is I00001."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/').get(getInstructors).post(createInstructor);

/**
 * @swagger
 * /instructors/{id}:
 *   get:
 *     summary: Get an instructor by MongoDB ID
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Instructor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: Instructor not found
 *   put:
 *     summary: Update an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstructorInput'
 *     responses:
 *       200:
 *         description: Updated instructor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       404:
 *         description: Instructor not found
 *   delete:
 *     summary: Delete an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor removed
 *       404:
 *         description: Instructor not found
 */
router.route('/:id').get(getInstructorById).put(updateInstructor).delete(deleteInstructor);

export default router;
