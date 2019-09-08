const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Configuracion de rutas

app.use( require('./routes/index'));
 
// conexion moongose

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

  if ( err ) throw err;

  console.log('Base de datos Online');

});
 
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${ process.env.PORT }`);
});