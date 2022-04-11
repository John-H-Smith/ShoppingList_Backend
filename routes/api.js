const express = require( 'express' );
const router = express.Router();
const authenticateJWT = require( '../controller/verifyJWT' );
const shoppinglist = require( './shoppinglist' );
const requestIp = require( 'request-ip' );

router.use( ( req, res, next ) => {
	console.log( req.method + " request from IP: " + requestIp.getClientIp( req ) + " to " + req.originalUrl + ". Body data: " + JSON.stringify( req.body ) );
	res.header( 'Cache-Control', 'public, max-age=0' );
	res.header( 'Content-Type', 'application/json' );
	next();
});
router.use( '/username', require( './username.js' ) );
router.use( '/login', require( './login.js' ) );
router.use( '/register', require( './register.js' ) );

// Only authenticate if not login
router.use( authenticateJWT, ( req, res, next ) => {
	next();
});
router.use( '/shoppinglist/', shoppinglist );

module.exports = router;