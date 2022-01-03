import { DataTypes, Model } from 'sequelize';

function User(connection) {
    class User extends Model {}
    User.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
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

export default User;