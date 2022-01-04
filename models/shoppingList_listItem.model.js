const { DataTypes, Model } = require( 'sequelize' );

function ShoppingList_ListItem(connection) {
    class ShoppingList_ListItem extends Model {}
    ShoppingList_ListItem.init({
        count: DataTypes.SMALLINT,
        bought: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        bought_at: DataTypes.DATE,
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize: connection,
        modelName: 'ShoppingList_ListItem'
    });
    return ShoppingList_ListItem;
}

module.exports = ShoppingList_ListItem;