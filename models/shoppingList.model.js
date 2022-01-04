const { DataTypes, Model } = require( 'sequelize' );

function ShoppingList(connection) {
    class ShoppingList extends Model {}
    ShoppingList.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: connection,
        modelName: 'ShoppingList'
    });
    return ShoppingList;
}

module.exports = ShoppingList;