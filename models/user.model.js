const { DataTypes, Model } = require( 'sequelize' );

function User(connection) {
    class User extends Model {}
    User.init({
        username: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true
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