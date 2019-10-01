const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// Obtener productos
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario, categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

        Producto.find({disponible: true})
            .sort('nombre')
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
    
                    res.json({
                        ok: true,
                        productos
                    });    
            });

});

// Obtener un producto por id
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario, categoria

    let id = req.params.id;


    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, producto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
    
                    res.json({
                        ok: true,
                        producto
                    });    
            });
});

// buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
            .populate('categoria', 'descripcion')
            .exec( (err, productoDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productoDB
                });  
            });
});

// crear un nuevo producto
app.post('/productos', verificaToken, (req, res) => {
    // grabar usuario y categoria del listado

    let body = req.body;
      
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    
    producto.save( (err, productoDB) => {

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

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        categoria: body.categoria,
    };

    Producto.findByIdAndUpdate( id, descProducto, {new: true, runValidators: true}, (err, productoDB) => {

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

      res.json({
          ok: true,
          producto: productoDB
      });
    });

});

// borrar un producto (no fisicamente)
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate( id, cambiaEstado, {new: true}, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrado'
                }
            }); 
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });
      });

});

module.exports = app;