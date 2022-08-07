const mainConfig = require( '../config/main.config.js' );
const jwt = require( 'jsonwebtoken' );

/*
express middleware to verify jwt token
Args:
 - req, res, next

*/
const authenticateJWT = async( req, res, next ) => {
    if( !req.headers.authorization ) {
        res.status( 401 ).end();
        return;
    }
    const token = req.headers.authorization;
    if( !token ) {
        res.status( 401 ).end();
        return;
    }

    jwt.verify( token, mainConfig.accessToken, ( err, user ) => {
        if( err ) {
            res.status( 401 ).end();
            return;
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;