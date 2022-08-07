const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const mainConfig = require( './config/main.config' );
const { connection } = require( './controller/orm' );
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

/*  Swagger  */
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API for the shoppinglist backend',
        version: '1.0.0',
        description: 'API for the public shoppinglist backend',
        contact: {
            name: 'shoppinglist_backend',
            email: 'email@fabian-heinz-webdesign.de'
        }
    },
    servers: [
        {
            url: `http://localhost:${mainConfig.port}/`,
            description: 'local development server'
        }
    ],
    components: {
        securitySchemes: {
            jwt: {
                /*type: 'apiKey',
                in: 'cookie',
                name: 'accessToken',*/
                description: 'Authentication via json web token',
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            },
        }
    }
}

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
}
const swaggerSpec = swaggerJSDoc( options );

//Routes
app.use( '/api', require( './routes/api' ) );
app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerSpec ) );
app.use( ( req , res ) => res.status( 404 ).end() );

app.listen( mainConfig.port, () => {
    console.log( `Server running on port ${mainConfig.port}` );
});

process.on( 'SIGINT', () => {
    console.log( 'Server shutting down...' );
    connection.close().then( () => {
        console.log( 'Shutdown complete.' );
        process.exit( 0 );
    });
});