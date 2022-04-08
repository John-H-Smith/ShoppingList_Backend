const express = require( 'express' );
const { User } = require( '../controller/orm.js' );
const router = express.Router();

// route to check if a uuid exists
router.get( '/check/:username', async ( req, res ) => {
    if( req.params.username == null || req.params.username == '' ) {
        res.status( 400 ).end();
        return;
    }

    const user = await User.findByUsername( req.params.username );

    let exists = false;
    if( user )
        exists = true;

    res.status( 200 ).json( { exists: exists } );
});

module.exports = router;