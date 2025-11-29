import { Router } from "express";
import { cupController } from "../controllers/cup.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cup
 *   description: Cup management endpoints
 */

/**
 * @swagger
 * /cups:
 *   get:
 *     summary: Get all cups
 *     tags: [Cup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   icon:
 *                     type: string
 *                   label:
 *                     type: string
 *                   value:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get("/", cupController.getAllCups);

export default router;
