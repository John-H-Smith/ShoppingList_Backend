const { DataTypes, Model } = require( 'sequelize' );

function Rank(connection) {
    class Rank extends Model {}
    Rank.init({
        title: {
            type: DataTypes.STRING(64),
            allowNull: false,
            primaryKey: true
        }
    },
    {
        sequelize: connection,
        modelName: 'Rank'
    });
    return Rank;
}

module.exports = Rank;