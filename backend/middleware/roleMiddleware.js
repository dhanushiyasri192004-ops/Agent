export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user context missing'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Access denied: Requires one of these roles: ${roles.join(', ')}`));
    }

    next();
  };
};
