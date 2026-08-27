const admin = require("firebase-admin");

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.slice(7);
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const role = req.user?.role;
      if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      req.userRole = role;
      next();
    } catch (err) {
      return res.status(500).json({ error: "Role check failed" });
    }
  };
}

module.exports = { verifyToken, requireRole };
