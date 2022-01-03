import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../controller/orm.js';
import mainConfig from '../config/main.config.js';
const router = express.Router();

// route to register a user
router.post( '/', async ( req, res ) => {
    if( req.body.email == null || req.body.email == ''
    ||  req.body.password == null || req.body.password == '' ) {
        res.status( 400 ).end();
        return;
    }

    // check for valid e mail address
    if( !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( req.body.email ) ) {
        res.status( 400 ).json( { message: 'Invalid mail address' } );
        return;
    }

    // password must be at least 6 characters long and contains at least one number
    if( !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test( req.body.password ) ) {
        res.status( 400 ).json( { message: 'Password must be at least 6 characters long and contain at least one number' } );
        return;
    }

    let user = await User.findOne({
        where: {
            email: req.body.email,
        }
    });

    // Check if a user is already registered with this email address
    if( user ) {
        res.status( 403 ).json( { message: 'User already registered' } );
        return;
    }

    // create a new shopping list user
    user = await User.create({
        email: req.body.email,
        password: req.body.password,
    });

    // Sign the token
    const accessToken = jwt.sign( { user: user }, mainConfig.accessToken );
    res.status( 200 ).json( { token: accessToken } );
});

export default router;