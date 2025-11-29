import { Router } from "express";
import { activityLevelController } from "../controllers/activityLevel.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ActivityLevel
 *   description: Activity Level management endpoints
 */

/**
 * @swagger
 * /activity-levels:
 *   get:
 *     summary: Get all activity levels
 *     tags: [ActivityLevel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of activity levels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   value:
 *                     type: string
 *                   label:
 *                     type: string
 *                   created_at:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get("/", activityLevelController.getAllActivityLevels);

export default router;
