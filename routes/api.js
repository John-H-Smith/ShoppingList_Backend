const express = require( 'express' );
const router = express.Router();
const authenticateJWT = require( '../controller/verifyJWT' );
const shoppinglist = require( './shoppinglist' );

router.use( ( req, res, next ) => {
	res.header( 'Cache-Control', 'public, max-age=0' );
	res.header( 'Content-Type', 'application/json' );
	next();
});
router.use( '/login', require( './login.js' ) );
router.use( '/register', require( './register.js' ) );

// Only authenticate if not login
router.use( authenticateJWT, ( req, res, next ) => {
	next();
});
router.use( '/shoppinglist/', shoppinglist );

module.exports = router;