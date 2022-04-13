const { DataTypes, Model } = require( 'sequelize' );

function ShoppingList(connection) {
    class ShoppingList extends Model {}
    ShoppingList.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize: connection,
        modelName: 'ShoppingList'
    });
    return ShoppingList;
}

module.exports = ShoppingList;