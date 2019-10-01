
// Puerto

process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token

process.env.CADUCIDAD_TOKEN = '48h';

// seed de autenticacion

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';

} else {

    urlDB = 'mongodb+srv://root:bilbcn9wSnuTUonZ@cluster0-jnrfu.mongodb.net/test';

}

process.env.URLDB = urlDB;

// google client id

process.env.CLIENT_ID = process.env.CLIENT_ID || '245765230457-sjveb2h7hf6fh0dvtujrlgem3kqbtijj.apps.googleusercontent.com';