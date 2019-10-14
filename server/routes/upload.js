const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No exite ningún archivo a subir'
        });
    }

    //validar tipos
    let tiposValidos = ['users', 'products'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: `Las extensiones permitidas son ${ tiposValidos.join(', ') }`
        });
    };

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extensionArchivo = nombreArchivo[nombreArchivo.length - 1];

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            message: `Las extensiones permitidas son ${ extensionesValidas.join(', ') }`
        });
    };

    //Cambiar nombre del archivo
    let nombreFinalArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    archivo.mv(`uploads/${ tipo }/${ nombreFinalArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Imgen subida
        if (tipo === 'users') {
            imagenUsuario(id, res, nombreFinalArchivo);
        } else {
            imagenProducto(id, res, nombreFinalArchivo);
        }


    });

});

function imagenUsuario(id, res, nombreFinalArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchvio(nombreFinalArchivo, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!usuarioDB) {
            borrarArchvio(nombreFinalArchivo, 'users');
            return res.status(400).json({
                ok: false,
                message: 'El usuario no exite'
            });
        };
        //Borramos el archivo anterior
        borrarArchvio(usuarioDB.img, 'users');

        usuarioDB.img = nombreFinalArchivo;
        usuarioDB.save((err, usuarioGrabado) => {
            res.json({
                ok: true,
                img: nombreFinalArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreFinalArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchvio(nombreFinalArchivo, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            borrarArchvio(nombreFinalArchivo, 'products');
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        };
        //Borramos el archivo anterior
        borrarArchvio(productoDB.img, 'products');

        productoDB.img = nombreFinalArchivo;
        productoDB.save((err, productoGrabado) => {
            res.json({
                ok: true,
                img: nombreFinalArchivo,
                productoGrabado
            });
        });
    });
}


function borrarArchvio(nombreArchivo, tipo) {
    //borrar imagen anterior en el servidor
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    };
}


module.exports = app;