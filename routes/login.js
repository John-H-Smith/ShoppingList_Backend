import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../controller/orm.js';
import mainConfig from '../config/main.config.js';
const router = express.Router();

// route to log a user in
router.post( '/', async ( req, res ) => {
    if( req.body.email == null || req.body.email == ''
    ||  req.body.password == null || req.body.password == '' ) {
        res.status( 400 ).end();
        return;
    }

    const user = await User.findOne({
        where: {
            email: req.body.email,
            password: req.body.password,
        },
        attributes: [ 'uuid', 'email' ]
    });

    if( user == null ) {
        res.status( 403 ).json( { message: 'Username or password incorrect' } );
        return;
    }

    // Sign the token
    const accessToken = jwt.sign( { user: user }, mainConfig.accessToken );
    res.status( 200 ).json( { token: accessToken } );
});

export default router;