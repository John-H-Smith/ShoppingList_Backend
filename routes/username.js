const express = require( 'express' );
const { User } = require( '../controller/orm.js' );
const router = express.Router();

// route to check if a uuid exists
/**
 * @api {get} /api/username/check/:uuid Check if a uuid exists
 * @swagger
 * /api/username/check/{uuid}/:
 *  get:
 *   summary: UUID check
 *   description: Check if a uuid exists
 *   parameters:
 *   - in: path
 *     name: uuid
 *     description: The uuid to check
 *     required: true
 *     schema:
 *      type: string
 *   responses:
 *    400:
 *     description: Bad request. Username or password missing.
 *    200:
 *     description: Success. Returns true if the uuid exists, false if not.
 */
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