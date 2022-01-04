const mainConfig = require( '../config/main.config.js' );
const jwt = require( 'jsonwebtoken' );

/*
express middleware to verify jwt token
Args:
 - req, res, next

*/
const authenticateJWT = async( req, res, next ) => {
    if( !req.headers.cookie ) {
        res.status( 401 ).end();
        return;
    }

    let rawCookies = req.headers.cookie.split("; ");
    let cookies = {};
    rawCookies.forEach( rawCookie => {
        cookies[rawCookie.split( "=" )[0]] = rawCookie.split( "=" )[1];
    });

    const token = cookies.accessToken;
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