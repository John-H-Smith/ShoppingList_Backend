const express = require( 'express' );
const { User } = require( '../controller/orm.js' );
const router = express.Router();

// route to check if a uuid exists
router.get( '/check/:uuid', async ( req, res ) => {
    if( req.params.uuid == null || req.params.uuid == '' ) {
        res.status( 400 ).end();
        return;
    }

    const user = await User.findByPk( req.params.uuid );

    let exists = false;
    if( user != null )
        exists = true;

    res.status( 200 ).json( { exists: exists } );
});

module.exports = router;