import express from 'express';
import bodyParser from 'body-parser';
import mainConfig from './config/main.config.js';
import { connection } from "./controller/orm.js";
import authenticateJWT from "./controller/verifyJWT.js";
import router from './routes/api.js';

const app = express();

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );


//Routes
app.use( '/api', router );
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