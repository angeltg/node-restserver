const express = require('express');


const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');




// ============
// Mostrar todos los productos
//=============
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.body.desde || 0;
    desde = Number(desde);
    //cargar usuario y categoría
    //paginadp
    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        //.limit(1)
        .populate('Usuario', 'nombre email')
        .populate('Categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Producto.countDocuments((err, cuantos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };
                res.json({
                    ok: true,
                    cuantos,
                    productos
                })


            })
        });


});

// ============
// Mostrar un producto por ID
//=============
app.get('/producto/:id', [verificaToken], (req, res) => {

    const id = req.params.id;

    Producto.findById(id)
        .populate('Usuario', 'nombre email')
        .populate('Categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        err,
                        massage: 'No se encuentra el producto solicitado'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });


});
// ============
// Buscar productos
//=============

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    //Expresion regular para buscar coincidencias sin filtrar por mayusculas
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        // .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        });

});


// ============
// Crear nuevo producto
//=============
app.post('/producto', [verificaToken, verificaAdmin_Role], (req, res) => {

    const body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        displonible: body.displonible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

// ============
// Modificar un producto por ID
//=============
app.put('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Producto.findByIdAndUpdate(id, body, (err, productoModificado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'El producto se ha modificado correctamente',
            productoModificado
        });

    });

});

app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    const id = req.params.id;
    const cambioDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambioDisponible, (err, productoModificado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'El producto se ha borrado correctamente',
            productoModificado
        });

    });
});

module.exports = app;