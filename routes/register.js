const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );
const { User } = require( '../controller/orm.js' );
const mainConfig = require( '../config/main.config.js' );
const router = express.Router();

// route to register a user
router.post( '/', async ( req, res ) => {
    if( req.body.name == null || req.body.name == ''
    ||  req.body.password == null || req.body.password == '' ) {
        res.status( 400 ).end();
        return;
    }

    // check for valid e mail address
    if( req.body.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( req.body.email ) ) {
        res.status( 400 ).json( { message: 'Invalid mail address' } );
        return;
    }

    // check for 3 characters in name
    if( !/^.{3,}$/.test( req.body.name ) ) {
        res.status( 400 ).json( { message: 'Name must be 3 characters long' } );
        return;
    }

    // password must be at least 6 characters long and contains at least one number
    if( !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test( req.body.password ) ) {
        res.status( 400 ).json( { message: 'Password must be 6 characters or longer and contains at least one number' } );
        return;
    }

    try {    
        // create a new shopping list user
        let userId = await getRandomId( 5 );
        let user = await User.create({
            uuid: userId,
            name: req.body.name,
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

async function getRandomId( length ) {
    //return Math.random().toString( 36 ).substring( 2, 15 ) + Math.random().toString( 36 ).substring( 2, 15 );
    let random = generateRandom( length );
    let user = await User.findByPk( random );
    while( user ) {
        random = generateRandom( length );
        user = await User.findByPk( random );
    }
    return random;
}

function generateRandom( length ) {
    return Number( Math.random().toString().substring( 2, 2 + length ) );
}