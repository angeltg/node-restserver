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
    urlDB = 'mongodb+srv://admin:UsJKlW31zOoq4ZMC@cluster0-mhsrp.mongodb.net/cafe';
}

process.env.URLDB = urlDB;