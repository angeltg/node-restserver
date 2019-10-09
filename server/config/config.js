// ============
// Puerto
//=============

process.env.PORT = process.env.PORT || 3000;


// ============
// Entorno
//=============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //Variable de entorno configurada en Heroku
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;