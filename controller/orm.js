const dbConfig = require( '../config/database.config.js' );
const Sequelize = require( 'sequelize' );

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
const User = require( '../models/user.model' )( connection );
const Rank = require( '../models/rank.model' )( connection );
const ShoppingList = require( '../models/shoppingList.model' )( connection );
const ListItem = require( '../models/listItem.model' )( connection );
const ShoppingList_ListItem = require( '../models/shoppingList_listItem.model' )( connection );  
const User_List_Rank = require( '../models/user_list_rank.model' )( connection );  

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

module.exports = { connection, ListItem, ShoppingList, User, Rank, ShoppingList_ListItem, User_List_Rank };