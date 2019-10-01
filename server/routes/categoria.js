const express = require('express');

let { verificaToken, verificaRole } = require('../middlewares/autenticacion');

let app = express();

const Categoria = require('../models/categoria');

// Mostrar todas las categorias
app.get('/categoria', (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => {

                res.json({
                    ok: true,
                    cuantos: conteo,
                    categorias
                });

            });


        });

});

// Mostrar una categoria por id
app.get('/categoria/:id', (req, res) => {

    let id = req.params._id;

    Categoria.findById(id)
    .exec( (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

            res.json({
                ok: true,
                categoria
            });

    });


});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
      
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    
    categoria.save( (err, categoriaDB) => {

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

// actualizar el nombre de la categoria
app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate( id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {

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

// borrar categoria (solo puede borrarla el administrador)
app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;

     Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'categoria no encontrada'
                    }
                }); 
            }

            res.json({
                ok: true,
                categoria: categoriaBorrado
            });
        });

});

module.exports = app;
