import { DataTypes, Model } from 'sequelize';

function ListItem(connection) {
    class ListItem extends Model {}
    ListItem.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: connection,
        modelName: 'ListItem'
    });
    return ListItem;
}

export default ListItem;