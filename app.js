const express = require('express')
const app = express();
const productos = require('./utils/products')
const contador = require('./utils/contador')
const path = require('path')
const port = process.env.PORT || 3000

app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    productos.getAllProducts(productos => {
        contador.getContador(contador => {
            res.render('index', {
                title: "Productos",
                productos,
                contador
            })
        })

    })
})

// app.get('/productos', (req, res) => {
//     productos.getAllProducts(callback =>{
//         res.render('index', {
//             title: "Productos",
//             callback
//         })
//     })
// })

app.get('/add', (req, res) => {
    res.render('./pages/add', {
        title: "Añadir Producto"
    })
})

app.get('/update', (req, res) => {
    res.render('./pages/update', {
        title: "Actualizar Producto"
    })
})


app.get('/delete', (req, res) => {
    res.render('./pages/delete', {
        title: "Eliminar Producto"
    })
})

app.get('/escaso', (req, res) => {
    productos.getAllProducts(productos => {
        res.render('./pages/escaso', {
            title: "Productos",
            productos
        })
    })
})


app.listen(port, () => {
    console.log(`Corriendo en puerto ${port}`)
})