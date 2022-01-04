const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const mainConfig = require( './config/main.config' );
const { connection } = require( './controller/orm' );

const app = express();

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );


//Routes
app.use( '/api', require( './routes/api' ) );
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