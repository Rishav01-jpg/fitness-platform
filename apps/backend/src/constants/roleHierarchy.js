import { ROLES } from "./roles.js";

export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 6,
  [ROLES.ADMIN]: 5,
  [ROLES.TRAINER]: 4,
  [ROLES.DIETITIAN]: 3,
  [ROLES.CLIENT]: 2,
  [ROLES.INDIVIDUAL]: 1,
};