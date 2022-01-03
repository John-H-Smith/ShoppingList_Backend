import { DataTypes, Model } from 'sequelize';

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

export default ShoppingList;