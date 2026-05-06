import { Router } from 'express';
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package management (UC3)
 */

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all packages
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: List of packages sorted by packageId
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Package'
 *   post:
 *     summary: Add a new package (UC3)
 *     description: >
 *       Creates a package with an auto-generated packageId (e.g. P00001).
 *       Returns a confirmation message that the package has been added.
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PackageInput'
 *     responses:
 *       201:
 *         description: Package created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 package:
 *                   $ref: '#/components/schemas/Package'
 *                 confirmationMessage:
 *                   type: string
 *                   example: "Package \"Monthly General\" has been added. Package ID: P00001."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/').get(getPackages).post(createPackage);

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get a package by MongoDB ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Package details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *   put:
 *     summary: Update a package
 *     tags: [Packages]
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
 *             $ref: '#/components/schemas/PackageInput'
 *     responses:
 *       200:
 *         description: Updated package
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *   delete:
 *     summary: Delete a package
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package removed
 *       404:
 *         description: Package not found
 */
router.route('/:id').get(getPackageById).put(updatePackage).delete(deletePackage);

export default router;
