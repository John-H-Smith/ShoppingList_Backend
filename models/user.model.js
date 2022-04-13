const Sequelize = require( "sequelize" );


exports.User = ( connection ) => {
    class User extends Sequelize.Model {

        static async find( user ) {
            return await this.findByUsername( user.username );
        }

        static async findByUsername( username ) {
            const { User } = require( "../controller/orm" );
            return await User.findOne({ 
                where: { username: username }
            });
        }

        async getAllShoppingLists() {
            const { User_List_Rank, ShoppingList } = require( "../controller/orm" );
            let shoppingListRanks = await User_List_Rank.findAll({ 
                where: { userId: this.getDataValue( 'id' ) }, 
            });
            let shoppingLists = [];
            for( let i = 0; i < shoppingListRanks.length; i++ ) {
                let shoppingListRank = shoppingListRanks[i];
                let list = await ShoppingList.findByPk( shoppingListRank.listId );
                let owner = await User.findByPk( list.ownerId );
                
                list = await ShoppingList.findByPk( shoppingListRank.listId, { attributes: { exclude: ['ownerId'] } } );

                list.dataValues.owner = { id: owner.id, alias: shoppingListRank.alias };
                if( !list.deleted )
                    shoppingLists.push( list );
            }
            return shoppingLists;
        }
    }

    User.init({
        username: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING(255),
            defaultValue: null,
            allowNull: true
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
        }
    },
    {
        sequelize: connection,
        modelName: 'User'
    });

    return User;
}