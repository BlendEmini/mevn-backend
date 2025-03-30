import { expressjwt } from "express-jwt";

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  return expressjwt({
    secret,
    algorithms: ["HS256"],
    // Removed `isRevoked` (we'll handle roles separately)
    getToken: (req) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      }
      return null;
    },
  }).unless({
    path: [
      { url: /^\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /^\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /^\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

// New middleware: Check if user is admin
export function isAdmin(req, res, next) {
  if (!req.auth?.isAdmin) { // `req.auth` is set by `express-jwt`
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}

export default authJwt;