const express = require( 'express' );
const { ShoppingList, User_List_Rank, Rank, ShoppingList_ListItem, ListItem } = require( "../controller/orm.js" );
const { getShoppingLists, hasItemAddPermission } = require( "../utils/ShoppingListUtil.js" );
const Sequelize = require( "sequelize" );
const router = express.Router();

// Create new shopping list
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

// Get all shopping lists for user
router.get( '/', async ( req, res ) => {
    try {
        let lists = await getShoppingLists( req.user.user );

        lists = await ShoppingList.findAll({
            where: {
                id: lists,
                deleted: false
            }
        });

        // Add the item count
        for( let i = 0; i < lists.length; i++ ) {
            let list = lists[i];
            list.dataValues.itemsCount = await ShoppingList_ListItem.count({
                where: {
                    listId: list.id,
                    deleted: false,
                    bought: false,
                    bought_at: null
                }
            });
        }

        res.status( 200 ).json( lists );
    } catch( error ) {
        console.error( error );
        res.status( 500 ).json( { error: "An internal error occured." } );
    }
});

// Add item to shopping list
/* Params: listId, itemId/"new"
 * Body: itemName (if "new"), itemCount
*/
router.post( '/:listId/:itemId', async ( req, res ) => {
    if( req.params.listId == null || req.params.listId == ""
    || req.params.itemId == null || req.params.itemId == ""
    || req.body.itemCount == null || req.body.itemCount == "" ) {
       res.status( 400 ).json( { error: "Wrong params" } );
       return;
    }

    try {
        const list = await ShoppingList.findByPk( req.params.listId );
        if( !list || list.deleted ) {
            res.status( 404 ).json( { error: "List not found" } );
            return;
        }

        if( !await hasItemAddPermission( req.user.user, list ) ) {
            console.log( "User has no permission to add items to this list" );
            res.status( 403 ).end();
            return;
        }

        let item = null;
        // Create new item
        if( req.params.itemId == "new" ) {
            if( req.body.itemName == null || req.body.itemName == "" ) {
                res.status( 400 ).json( { error: "Wrong params" } );
                return;
            }
        
            // Item really not existing?
            item = await ListItem.findOne({ where: { name: req.body.itemName } } );
            if( !item )
                item = await ListItem.create({ where: { name: req.body.itemName } } ).catch( err => { throw new Error( err ) } );
        } else {
            // Item already existing?
            item = await ListItem.findByPk( req.params.itemId );
            if( !item ) {
                res.status( 404 ).json( { error: "Item not found" } );
                return;
            }
        }
        
        // Item already in list?
        let shoppingListItem = await ShoppingList_ListItem.findOne( { listId: list.id, itemId: item.id, bought: false, bought_at: null, deleted: false } );
        if( !shoppingListItem )
            await ShoppingList_ListItem.create( { listId: list.id, itemId: item.id, count: req.body.itemCount } ).catch( err => { throw new Error( err ) } );
        else {
            // Update count
            shoppingListItem.count = req.body.itemCount;
            await shoppingListItem.save().catch( err => { throw new Error( err ) } );
        }
        res.status( 201 ).end();
    } catch( error ) {
        console.error( error );
        res.status( 500 ).json( { error: "An internal error occured." } );
    }
});

// Delete item from shopping list
/*router.delete( '/:listId/:itemId', async ( req, res ) => {
    if( req.params.listId == null || req.params.listId == ""
    || req.params.itemId == null || req.params.itemId == "" ) {
       res.status( 400 ).json( { error: "Wrong params" } );
       return;
    }

    try {
        const list = await ShoppingList.findByPk( req.params.listId );
        if( !list || list.deleted ) {
            res.status( 404 ).json( { error: "List not found" } );
            return;
        }

        if( !await hasItemAddPermission( req.user.user, list ) ) {
            console.log( "User has no permission to add items to this list" );
            res.status( 403 ).end();
            return;
        }

        let shoppingListItem = await ShoppingList_ListItem.findOne( { listId: list.id, itemId: item.id, bought: false, bought_at: null, deleted: false } );
        if( !shoppingListItem ) {
            res.status( 404 ).json( { error: "Item not found in list" } );
            return;
        }

        shoppingListItem.deleted = true;
        res.status( 200 ).end();
    } catch( error ) {
        console.error( error );
        res.status( 500 ).json( { error: "An internal error occured." } );
    }
});*/

module.exports = router;