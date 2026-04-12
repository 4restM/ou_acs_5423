import { Router } from 'express';
import {
  getClasses,
  getClassById,
  checkConflicts,
  getAvailableSlots,
  createClass,
  updateClass,
  togglePublish,
  deleteClass,
} from '../controllers/classController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management 
 */

/**
 * @swagger
 * /classes/check-conflicts:
 *   post:
 *     summary: Check for schedule conflicts
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dayOfWeek, startTime, endTime]
 *             properties:
 *               dayOfWeek:
 *                 type: string
 *                 enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *               startTime:
 *                 type: string
 *                 example: '09:00'
 *               endTime:
 *                 type: string
 *                 example: '10:15'
 *               excludeId:
 *                 type: string
 *                 description: Class ID to exclude (for updates)
 *     responses:
 *       200:
 *         description: Conflict check result with available slots if conflicts exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 */
router.post('/check-conflicts', checkConflicts);

/**
 * @swagger
 * /classes/available-slots/{day}:
 *   get:
 *     summary: Get available time slots for a given day
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *     responses:
 *       200:
 *         description: List of available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeSlot'
 */
router.get('/available-slots/:day', getAvailableSlots);

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Get all classes (filterable)
 *     tags: [Classes]
 *     parameters:
 *       - in: query
 *         name: dayOfWeek
 *         schema:
 *           type: string
 *         description: Filter by day of week
 *       - in: query
 *         name: instructor
 *         schema:
 *           type: string
 *         description: Filter by instructor ObjectId
 *       - in: query
 *         name: published
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: List of classes sorted by day and time
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *   post:
 *     summary: Create a new class
 *     description: >
 *       Schedules a new class. Returns 409 with conflict details and
 *       available alternative time slots if a scheduling conflict is detected.
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassInput'
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 class:
 *                   $ref: '#/components/schemas/Class'
 *                 message:
 *                   type: string
 *       409:
 *         description: Schedule conflict detected
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ConflictResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *       400:
 *         description: Validation error
 */
router.route('/').get(getClasses).post(createClass);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Get a class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class details with populated instructor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found
 *   put:
 *     summary: Update a class
 *     description: Checks for schedule conflicts if day/time is changed.
 *     tags: [Classes]
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
 *             $ref: '#/components/schemas/ClassInput'
 *     responses:
 *       200:
 *         description: Updated class
 *       409:
 *         description: Schedule conflict
 *       404:
 *         description: Class not found
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class removed
 *       404:
 *         description: Class not found
 */
router.route('/:id').get(getClassById).put(updateClass).delete(deleteClass);

/**
 * @swagger
 * /classes/{id}/publish:
 *   patch:
 *     summary: Toggle class publish status
 *     description: Publishes a draft class or unpublishes a published class.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Publish status toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 class:
 *                   $ref: '#/components/schemas/Class'
 *                 message:
 *                   type: string
 *       404:
 *         description: Class not found
 */
router.patch('/:id/publish', togglePublish);

export default router;
