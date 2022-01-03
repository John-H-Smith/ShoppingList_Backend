import express from "express";
const router = express.Router();
import authenticateJWT from "../controller/verifyJWT.js";
import login from "./login.js";
import register from "./register.js";
import shoppinglist from "./shoppinglist.js";

router.use( ( req, res, next ) => {
	res.header( 'Cache-Control', 'public, max-age=0' );
	res.header( 'Content-Type', 'application/json' );
	next();
});
router.use( '/login', login );
router.use( '/register', register );

// Only authenticate if not login
router.use( authenticateJWT, ( req, res, next ) => {
	next();
});
router.use( '/shoppinglist/', shoppinglist );

export default router;