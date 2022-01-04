const express = require( 'express' );
const { ShoppingList, User_List_Rank, Rank } = require( "../controller/orm.js" );
const { getShoppingLists } = require( "../utils/ShoppingListUtil.js" );
const router = express.Router();

router.post( "/", async ( req, res ) => {
    if( req.body.listname == null || req.body.listname == ""
    || req.body.username == null || req.body.username == "" ) {
       res.status( 400 ).json( { error: "Wrong params" } );
       return;
    }

    try {
        const shoppingList = await ShoppingList.create({ name: req.body.listname }).catch( err => { throw new Error( err ) } );
        const rank = await Rank.findByPk( "admin" );
        if(!rank)
            throw new Error( "Rank admin not found" );
        const user_list_rank = await User_List_Rank.create({ userUuid: req.user.user.uuid, alias: req.body.username, listId: shoppingList.id, rank: rank.title }).catch( err => { throw new Error( err ) } );;
        res.status( 201 ).end();
    } catch(error) {
        console.error( error );
        res.status( 500 ).json( { error: "An internal error occured." } );
    }
});

router.get( '/', async ( req, res ) => {

    let lists = await getShoppingLists( req.user.user );

    lists = await ShoppingList.findAll({
        where: {
            id: lists
        }
    });

    res.status(200).json( lists );
});

module.exports = router;