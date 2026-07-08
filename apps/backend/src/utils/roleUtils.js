import { ROLE_HIERARCHY } from "../constants/roleHierarchy.js";

const hasHigherOrEqualRole = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export { hasHigherOrEqualRole };