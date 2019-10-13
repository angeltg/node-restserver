const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');



// ============
// Mostrar todas las categorias
//=============
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        // .populate('usuario')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            Categoria.countDocuments((err, cuantos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };
                res.json({
                    ok: true,
                    cuantos,
                    categorias
                })


            })
        });

});

// ============
// Mostrar una categoria por ID
//=============
app.get('/categoria/:id', [verificaToken], (req, res) => {

    const { id } = req.params;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// ============
// Crear nueva categoria
//=============
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ============
// Modificar una categoria por ID
//=============
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Descripcion de la categoria

    const { id } = req.params;
    const body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo el admin puede borrar.
    const { id } = req.params;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                e: {
                    message: "No se ha encontrado la categoría"
                }
            });
        }
        if (!categoriaBorrada) {
            return res.status(500).json({
                ok: false,
                e: {
                    message: "No se ha encontrado la categoría a borrar"
                }
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'La categoría ha sido eliminada correctamente'
        });
    });
});

module.exports = app;