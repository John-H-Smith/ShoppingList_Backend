const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );
const { User } = require( '../controller/orm.js' );
const mainConfig = require( '../config/main.config.js' );
const router = express.Router();

// route to log a user in
/**
 * @api {post} /api/login/ Login
 * @swagger
 * /api/login/:
 *  post:
 *   summary: Login
 *   description: Login a user
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        username:
 *         type: string
 *         required: true
 *         description: The username of the user
 *         example: peter
 *        password:
 *         type: string
 *         required: true
 *         description: The password of the user
 *         example: IamAPassword123
 *   responses:
 *    400:
 *     description: Bad request. Username or password missing.
 *    403:
 *     description: Forbidden. Wrong username or password.
 *    200:
 *     description: Success.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         token:
 *          type: string
 *          description: The signed JWT for the user
 */
router.post( '/', async ( req, res ) => {
    if( req.body.username == null || req.body.username == '' 
    ||  req.body.password == null || req.body.password == '' ) {
        res.status( 400 ).end();
        return;
    }

    const user = await User.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        },
        attributes: [ 'id', 'username', 'email' ]
    });

    if( user == null ) {
        res.status( 403 ).json( { message: 'username or password incorrect' } );
        return;
    }

    // Sign the token
    const accessToken = jwt.sign( { user: user }, mainConfig.accessToken );
    res.status( 200 ).json( { token: accessToken } );
});

module.exports = router;