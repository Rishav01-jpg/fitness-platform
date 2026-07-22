import express from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import hasPermission from "../../middlewares/permission.middleware.js";

import { ROLES } from "../../constants/roles.js";
import { PERMISSIONS } from "../../constants/permissions.js";
import {
  register,
  login,
  profile,
  updateProfileController,
  changePasswordController,
  forgotPasswordController,
   resetPasswordController,
    getUsersController,
     getUserByIdController,
} from "./user.controller.js";


const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/profile",
  authenticate,
  profile
);

router.get(
  "/",
  authenticate,
  getUsersController
);
router.get(
  "/:userId",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN
  ),
  hasPermission(PERMISSIONS.VIEW_USER),
  getUserByIdController
);

router.put(
  "/profile",
  authenticate,
  updateProfileController
);

router.put(
  "/change-password",
  authenticate,
  changePasswordController
);

router.post(
  "/forgot-password",
  forgotPasswordController
);

router.post(
  "/reset-password",
  resetPasswordController
);
export default router;