// ============
// Puerto
//=============
// Esta variable está declarada en Heroku
process.env.PORT = process.env.PORT || 3000;


// ============
// Entorno
//=============
// Esta variable está declarada en Heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============
// Vencimiento token
//=============
// Esta variable está declarada en Heroku
process.env.CADUCIDAD_TOKE = 60 * 60 * 24 * 60;

// ============
// SEED de autenticación
//=============
// Esta variable está declarada en Heroku
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============
// Base de datos
//=============

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //Variable de entorno configurada en Heroku
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ============
// Google Client ID
//=============


process.env.CLIENT_ID = process.env.CLIENT_ID || '114869447930-o7s0bmlaqn75l2are3tmrtiitug3ebmg.apps.googleusercontent.com';