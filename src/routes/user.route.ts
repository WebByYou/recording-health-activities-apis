import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               gender:
 *                 type: string
 *               age:
 *                 type: integer
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               activity_level:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
import multer from "multer";
import fs from "fs";
import path from "path";

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Path to frontend public/imgProfile
        // Assuming backend is in recording-health-activities-apis and frontend is in recording-health-activities
        // We need to go up one level from src/routes (../..) then up from project root (..) then into frontend
        // Actually, process.cwd() is usually the project root.
        // Let's use absolute path to be safe or relative to process.cwd()
        const uploadPath = path.join(process.cwd(), "../recording-health-activities/public/imgProfile");

        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });

router.put("/profile", upload.single("profileImage"), userController.updateProfile);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 height:
 *                   type: number
 *                 weight:
 *                   type: number
 *                 activity_level:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/profile", userController.getProfile);

/**
 * @swagger
 * /user/password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid current password or missing fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/password", userController.updatePassword);

export default router;
