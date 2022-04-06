const { DataTypes, Model } = require( 'sequelize' );

function User(connection) {
    class User extends Model {}
    User.init({
        uuid: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            defaultValue: null,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        sequelize: connection,
        modelName: 'User'
    });
    return User;
}

module.exports = User;