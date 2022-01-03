import dbConfig from '../config/database.config.js';
import Sequelize from 'sequelize';

let connection = null;
if(dbConfig.type === 'sqlite') {
    connection = new Sequelize({
        dialect: 'sqlite',
        storage: 'storage.sqlite'
    });
}

if(dbConfig.type === 'mysql') {
    if( !dbConfig.database || !dbConfig.user || !dbConfig.password || !dbConfig.host )
        throw new Error( 'Missing database configuration' );

    connection = new Sequelize( dbConfig.database, dbConfig.user, dbConfig.password, {
        host: dbConfig.host,
        dialect: 'mysql',
        define: { timestamps: false },
      } );
}

// Connect to the database and then authenticate
connection.authenticate().then( () => console.log( 'Database connection has been established successfully.' ),
    e => console.error( `Database error: ${e}` )
  ).catch( err => console.error( 'Unable to connect to the database:', err )
);

// Load models
import UserModel from '../models/user.model.js';
console.log(typeof UserModel);
const User = UserModel( connection );

import RankModel from '../models/rank.model.js';
const Rank = RankModel( connection );

import ShoppingListModel from '../models/shoppingList.model.js';
const ShoppingList = ShoppingListModel( connection );

import ListItemModel from '../models/listItem.model.js';
const ListItem = ListItemModel( connection );

import ShoppingList_ListItemModel from '../models/shoppingList_listItem.model.js';
const ShoppingList_ListItem = ShoppingList_ListItemModel( connection );  

import User_List_RankModel from '../models/user_list_rank.model.js';
const User_List_Rank = User_List_RankModel( connection );  

// Associations
ShoppingList.hasMany( ShoppingList_ListItem, {
    foreignKey: {
        name: 'listId',
        allowNull: false
    }
});
ShoppingList_ListItem.belongsTo( ShoppingList, {
    foreignKey: {
        name: 'listId',
        allowNull: false
    }
});
ListItem.hasMany( ShoppingList_ListItem, {
    foreignKey: {
        name: 'itemId',
        allowNull: false
    }
});
ShoppingList_ListItem.belongsTo( ListItem, {
    foreignKey: {
        name: 'itemId',
        allowNull: false
    }
});

ShoppingList.hasMany( User_List_Rank, {
    foreignKey: {
        name: 'listId',
        allowNull: false
    }
});
User_List_Rank.belongsTo( ShoppingList, {
    foreignKey: {
        name: 'listId',
        allowNull: false
    }
});
User.hasMany( User_List_Rank, {
    foreignKey: {
        name: 'userUuid',
        allowNull: false
    }
});
User_List_Rank.belongsTo( User, {
    foreignKey: {
        name: 'userUuid',
        allowNull: false
    }
});
Rank.hasMany( User_List_Rank, {
    foreignKey: {
        name: 'rank',
        allowNull: false
    }
});
User_List_Rank.belongsTo( Rank, {
    foreignKey: {
        name: 'rank',
        allowNull: false
    }
});

// resync database
(async () => {
    await connection.sync().then(
        () => console.log( 'Database connection synced' )
    ).catch(  e => {
        console.error( `Database connection error: ${JSON.stringify( e )}` );
        process.exit( 22 );
    } );  
} )();

export { connection, ListItem, ShoppingList, User, Rank, ShoppingList_ListItem, User_List_Rank };