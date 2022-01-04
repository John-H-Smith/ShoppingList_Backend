const { ShoppingList, User_List_Rank, Rank, User } = require( "../controller/orm" );

async function getShoppingLists( user ) {
    user = await User.findByPk( user.uuid, {
        include: {
            model: User_List_Rank,
            include: [ ShoppingList, Rank ]
        }
    });
    let lists = [];
    user.User_List_Ranks.forEach( userlistrank => {
        lists.push( userlistrank.listId );
    });
    return lists;
}

module.exports = { getShoppingLists };