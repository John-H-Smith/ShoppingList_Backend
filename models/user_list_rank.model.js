const { DataTypes, Model } = require( 'sequelize' );

function User_List_Rank(connection) {
    class User_List_Rank extends Model {}
    User_List_Rank.init({
        alias: DataTypes.STRING(64),
    },
    {
        sequelize: connection,
        modelName: 'User_List_Rank'
    });
    return User_List_Rank;
}

module.exports = User_List_Rank;