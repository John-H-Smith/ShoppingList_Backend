const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );
const { User } = require( '../controller/orm.js' );
const mainConfig = require( '../config/main.config.js' );
const router = express.Router();

// route to register a user
/**
 * @api {post} /register Register a new user
 * @swagger
 * /api/register:
 *  post:
 *   summary: Registering
 *   description: Register a new user
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
 *         minLength: 3
 *         maxLength: 64
 *         example: peter
 *        password:
 *         type: string
 *         required: true
 *         description: The password of the user
 *         minLength: 3
 *         pattern: ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$
 *         example: IamAPassword123
 *        email:
 *         type: string
 *         required: false
 *         description: The email of the user
 *         example: email@mail.com
 *   responses:
 *    400:
 *     description: Bad request. Username or password missing, email is formatted invalid, username is too short or password does not meet the requirements.
 *    409:
 *     description: Conflict. Username already exists.
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
 *    500:
 *     description: Internal server error.
 */
router.post( '/', async ( req, res ) => {
    if( req.body.username == null || req.body.username == ''
    ||  req.body.password == null || req.body.password == '' ) {
        res.status( 400 ).end();
        return;
    }

    // check for valid e mail address
    if( req.body.email && !/^(?!.{256,})\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test( req.body.email ) ) {
        res.status( 400 ).json( { message: 'Invalid mail address' } );
        return;
    }

    // check for 3 characters in name
    if( !/^.{3,64}$/.test( req.body.username ) ) {
        res.status( 400 ).json( { message: 'Name must be at least 3 and up to 64 characters long' } );
        return;
    }

    // password must be at least 6 characters long and contains at least one number
    if( !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test( req.body.password ) ) {
        res.status( 400 ).json( { message: 'Password must be 6 characters or longer and contains at least one number' } );
        return;
    }

    try {    

        let user = await User.findOne( { where: { username: req.body.username } } );
        if( user ) {
            res.status( 409 ).json( { message: 'Username already exists' } );
            return;
        }

        // create a new shopping list user
        user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }).catch( err => { throw new Error( err ) } );;
    
        // Sign the token
        const accessToken = jwt.sign( { user: user }, mainConfig.accessToken );
        res.status( 200 ).json( { token: accessToken } );
    } catch(error) {
        console.error( error );
        res.status( 500 ).json( { error: "An internal error occured." } );
    }
});

module.exports = router;