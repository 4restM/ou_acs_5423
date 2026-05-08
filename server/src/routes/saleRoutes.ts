import { Router } from 'express';
import { getSales, getSaleById, createSale, deleteSale } from '../controllers/saleController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sale management (UC5)
 */

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: List of sales sorted by payment date descending
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *   post:
 *     summary: Record a new sale
 *     description: >
 *       Records a sale of a package to an existing customer.
 *       Validates that amount matches the package rate and validity dates
 *       fall within the package window. Updates the customer's class balance.
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleInput'
 *     responses:
 *       201:
 *         description: Sale recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sale:
 *                   $ref: '#/components/schemas/Sale'
 *                 confirmationMessage:
 *                   type: string
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Customer or package not found
 */
router.route('/').get(getSales).post(createSale);

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Get a sale by MongoDB ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Sale details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 *   delete:
 *     summary: Delete a sale and revert customer class balance
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale deleted and class balance updated
 *       404:
 *         description: Sale not found
 */
router.route('/:id').get(getSaleById).delete(deleteSale);

export default router;
