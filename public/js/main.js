const productsInput = document.querySelector('.product-search');
const productName = document.querySelectorAll('.product-name');
const cards = document.querySelectorAll('.card-product');
const addBtn = document.querySelectorAll('.add-btn');
const cart = document.querySelector('.cart');
const productosVendidosCtn = document.querySelector('.productos-vendidos')
const productosVendidos = document.querySelector('.producto-vendido')
const totalVendidosCtn = document.querySelector('.total-vendidos')
const totalVendidos = document.querySelector('.total-vendido')
const promedioCtn = document.querySelector('.promedio-text')
const promedioVentas = document.querySelector('.promedio-ventas')
// const promedioBtn = document.querySelector('.promedio-btn')
const editQuantBtn = document.querySelectorAll('.edit-quantity')
const editPriceBtn = document.querySelectorAll('.edit-price')


async function updateCont(contOriginal, cont, totalOriginal, total) {
    try {
        const response = await fetch('https://local-api-822e4889e0cf.herokuapp.com/contador', {
            method: 'PUT',
            body: JSON.stringify({contador: contOriginal + cont, total: totalOriginal + total}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

const cartTitle = document.createElement('h2');
cart.appendChild(cartTitle);
cartTitle.innerHTML = 'Total de productos:';


const isActive = true

const totalPrice = document.createElement('p');
cart.appendChild(totalPrice);
let total = 0;
totalPrice.innerHTML = `<strong>Total:</strong> $${total}`;

let cont = 0
let valorProductosVendidos = parseInt(productosVendidosCtn.getAttribute('data-cont'))
let valorTotalVendido = parseInt(totalVendidosCtn.getAttribute('data-total'))
let promedio = valorTotalVendido / valorProductosVendidos
promedioVentas.textContent = `$${parseFloat(promedio).toFixed(2)}`




// Objeto para rastrear los productos en el carrito
const cartProducts = {};

// Cola de operaciones
const operationQueue = [];
let isProcessing = false;


// Función para procesar la cola de operaciones
async function processQueue() {
    if (isProcessing || operationQueue.length === 0) return;

    isProcessing = true;
    const operation = operationQueue.shift();
    await operation();
    isProcessing = false;
    processQueue();
}

// Función para actualizar el producto en el servidor
async function updateProduct(productName, quantity) {
    try {
        const response = await fetch('https://local-api-822e4889e0cf.herokuapp.com/producto', {
            method: 'PUT',
            body: JSON.stringify({name: productName, quantity: quantity}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error updating product:', error);
    }
}


async function updateProductPrice(productName, price) {
    try {
        const response = await fetch('https://local-api-822e4889e0cf.herokuapp.com/producto', {
            method: 'PUT',
            body: JSON.stringify({name: productName, price: price}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error updating product:', error);
    }
}


// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    cart.innerHTML = '';
    cart.appendChild(totalVendidosCtn);
    cart.appendChild(productosVendidosCtn);
    cart.appendChild(promedioCtn)
    // cart.appendChild(promedioBtn)
    cart.appendChild(cartTitle);

    for (const [name, data] of Object.entries(cartProducts)) {
        const cartProductDiv = document.createElement('div');
        cartProductDiv.classList.add('product-ctn')
        const cartProduct = document.createElement('p');
        cartProduct.innerHTML = `${name} - $${data.price} <strong> x ${data.quantity}</strong>`;
        cartProductDiv.appendChild(cartProduct);

        const delBtn = document.createElement('a');
        delBtn.innerHTML = 'Eliminar';
        delBtn.href = '';
        delBtn.classList.add('bttn')
        cartProductDiv.appendChild(delBtn);

        cart.appendChild(cartProductDiv);

        delBtn.addEventListener('click', (e) => handleDelete(e, name, data));
    }

    cart.appendChild(totalPrice);
    totalPrice.innerHTML = `<strong>Total:</strong> $${total}`;
    // totalPrice.style.display = Object.keys(cartProducts).length > 0 ? 'block' : 'none';

    const finishBtn = document.createElement('a')
    finishBtn.innerHTML = 'Aceptar'
    finishBtn.href = ''
    finishBtn.classList.add('bttn')
    cart.appendChild(finishBtn);
    

    finishBtn.style.display = Object.keys(cartProducts).length > 0 ? 'inline-block' : 'none';
        finishBtn.addEventListener('click', async e => {
            e.preventDefault();
            if (e.target.disabled) return;
            e.target.disabled = true;

   
            await updateCont(valorProductosVendidos, cont, valorTotalVendido, total);

            let resultadoTotalVendido = valorTotalVendido + total;
            let resultadoProductosVendidos = valorProductosVendidos + cont;
            valorProductosVendidos = resultadoProductosVendidos
            valorTotalVendido = resultadoTotalVendido
            let promedio = resultadoTotalVendido / resultadoProductosVendidos;
    
            productosVendidos.textContent = `${resultadoProductosVendidos}`;
            totalVendidos.textContent = `$${resultadoTotalVendido}`;
            promedioVentas.textContent = `$${parseFloat(promedio).toFixed(2)}`;

            // let resultadoTotalVendido = valorTotalVendido + total
            // let resultadoProductosVendidos = valorProductosVendidos + cont
            // let promedio = resultadoTotalVendido / resultadoProductosVendidos
            // productosVendidos.textContent = `${resultadoProductosVendidos}`
            // totalVendidos.textContent = `$${resultadoTotalVendido}`
            // promedioVentas.textContent = `$${parseFloat(promedio).toFixed(2)}`
            total = 0;
            cont = 0;
    
            for (let key in cartProducts) {
                delete cartProducts[key];
            }
        
            updateCartDisplay()

            // totalPrice.innerHTML = `<strong>Total:</strong> $${0}`
            // const cartProductDiv = document.querySelectorAll('.product-ctn')
            // cartProductDiv.forEach(el => {
            //     el.style.display = 'none'
            // })
            finishBtn.style.display = 'none'  
        })


}

// promedioBtn.addEventListener('click', e => {
//     e.preventDefault();
//     let resultadoTotalVendido = valorTotalVendido + total
//     let resultadoProductosVendidos = valorProductosVendidos + cont

// })

// Función para manejar la eliminación de productos
function handleDelete(e, productName, data) {
    e.preventDefault();
    if (e.target.disabled) return;
    e.target.disabled = true;

    operationQueue.push(async () => {
        if (cartProducts[productName].quantity > 1) {
            cartProducts[productName].quantity -= 1;
        } else {
            delete cartProducts[productName];
        }
        cont -= 1
        console.log(cont)
        total -= parseInt(data.price);

        const card = Array.from(document.querySelectorAll('.card-product')).find(card =>
            card.querySelector('.product-name').textContent.trim() === productName)

        const productQuantElement = card.querySelector('.quantity-element');
        let realQuantity = parseInt(productQuantElement.textContent) + 1;
        productQuantElement.textContent = realQuantity;

        await updateProduct(productName, realQuantity);
        updateCartDisplay();
        e.target.disabled = false;
    });

    processQueue();
}


addBtn.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        if (button.disabled) return;
        button.disabled = true;
        const addBtnCtn = button.closest('.add-btn-ctn');
        const productQuantElement = addBtnCtn.parentElement.querySelector('.quantity-element');
        realQuantity = parseInt(productQuantElement.textContent);
        const productName = button.getAttribute('data-name');
        const productPrice = button.getAttribute('data-price');

        if (realQuantity > 0) {
            

            // realQuantity -= 1;
            let inputQuantity = addBtnCtn.querySelector('input');
            if (!inputQuantity) {
                const inputQuantity = document.createElement('input');

                inputQuantity.style.display = 'block'
                inputQuantity.min = '1';
                inputQuantity.max = realQuantity;
                addBtnCtn.appendChild(inputQuantity);
                inputQuantity.addEventListener('keypress', e => {
                    if (e.key === 'Enter') {
                        let abstractQuantity = parseInt(inputQuantity.value)
                        if (!isNaN(abstractQuantity) && realQuantity >= abstractQuantity) {
                            cont += abstractQuantity
                            let updatedQuantity = realQuantity - abstractQuantity
                            console.log(`Cantidad DOM: ${realQuantity}
                                        Cantidad que se resta: ${abstractQuantity}
                                        Total: ${updatedQuantity}`)
                            productQuantElement.textContent = `${updatedQuantity}`;
                            operationQueue.push(async () => {
                                await updateProduct(productName, updatedQuantity);
                                console.log('Se llamo a la cola')
                                if (productName in cartProducts) {
                                    cartProducts[productName].quantity += abstractQuantity;
                                } else {
                                    cartProducts[productName] = {
                                        price: productPrice,
                                        quantity: abstractQuantity
                                    };
                                }
                
                                total += parseInt(productPrice*abstractQuantity);
                                realQuantity = parseInt(productQuantElement.textContent)
                                updateCartDisplay();
                            });
                        } else {
                            console.error('No hay suficiente stock o el valor no es numerico')
                        }
                        processQueue()
                        inputQuantity.value = ''
                        inputQuantity.style.display = 'none'
                    }
                })
                inputQuantity.focus();
            } else {
                inputQuantity.style.display = 'block'
                inputQuantity.focus();
            }
        } else {
            console.log("No hay suficiente producto");
        }
        button.disabled = false;
    });
});

// console.log(editQuantBtn)

editQuantBtn.forEach(editButton => {
    const inputEditQuant  = document.createElement('input');
    const editChangeQuant  = document.createElement('a');
    
    inputEditQuant.style.display = 'none';
    
    inputEditQuant.placeholder = 'Nueva Cantidad';
    
    editChangeQuant.style.display = 'none';
    editChangeQuant.innerHTML = 'Aceptar';
    editChangeQuant.href = '#';
    
    const quantityCtn = editButton.closest('.quantity-ctn');
    quantityCtn.appendChild(inputEditQuant);
    inputEditQuant.insertAdjacentElement('afterend', editChangeQuant);
    

    editButton.addEventListener('click', e => {
        e.preventDefault();

        editButton.style.display = 'none'
        inputEditQuant.style.display = 'block';
        inputEditQuant.style.width = '30%';
        editChangeQuant.style.display = 'block';
        inputEditQuant.focus();

    });
    
    editChangeQuant.addEventListener('click', e => {
        e.preventDefault();
        const card = editButton.closest('.card-product');
        const editQuantName = editButton.getAttribute('data-name');
        // Aquí puedes añadir la lógica para actualizar la cantidad
        const inputEditValue = parseInt(inputEditQuant.value)
        if (isNaN(inputEditValue)) {
            console.error('Input value is not a valid number');
            inputEditQuant.style.display = 'none';
            editChangeQuant.style.display = 'none';
            editButton.style.display = 'inline-block'
            return;
        }
        updateProduct(editQuantName, inputEditValue)
        const productQuantElement = card.querySelector('.quantity-element');
        productQuantElement.textContent = inputEditValue
        inputEditQuant.value = ''
        editButton.style.display = 'inline-block'
        inputEditQuant.style.display = 'none';
        editChangeQuant.style.display = 'none';
    });

    inputEditQuant.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            editChangeQuant.click();
        }
    });
})

editPriceBtn.forEach(editButton => {
    const inputEditPrice  = document.createElement('input');
    const editChangePrice  = document.createElement('a');
    
    inputEditPrice.style.display = 'none';
    
    inputEditPrice.placeholder = 'Nueva Cantidad';
    
    editChangePrice.style.display = 'none';
    editChangePrice.innerHTML = 'Aceptar';
    editChangePrice.href = '#';
    
    const priceCtn = editButton.closest('.price-ctn');
    priceCtn.appendChild(inputEditPrice);
    inputEditPrice.insertAdjacentElement('afterend', editChangePrice);
    

    editButton.addEventListener('click', e => {
        e.preventDefault();

        editButton.style.display = 'none'
        inputEditPrice .style.display = 'block';
        inputEditPrice .style.width = '30%';
        editChangePrice.style.display = 'block';
        inputEditPrice.focus();

    });
    
    editChangePrice.addEventListener('click', e => {
        e.preventDefault();
        const card = editButton.closest('.card-product');
        const editPriceName = editButton.getAttribute('data-name');
        // Aquí puedes añadir la lógica para actualizar la cantidad
        const inputEditValue = parseInt(inputEditPrice.value)
        if (isNaN(inputEditValue)) {
            console.error('Input value is not a valid number');
            inputEditPrice.style.display = 'none';
            editChangePrice.style.display = 'none';
            editButton.style.display = 'inline-block'
            return;
        }
        updateProductPrice(editPriceName, inputEditValue)
        const productPriceElement = card.querySelector('.price-element');
        productPriceElement.textContent = `$${inputEditValue}`
        inputEditPrice.value = ''
        editButton.style.display = 'inline-block'
        inputEditPrice.style.display = 'none';
        editChangePrice.style.display = 'none';
    });

    inputEditPrice.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            editChangePrice.click();
        }
    });
})


productsInput.addEventListener('input', event => {
    const inputValue = productsInput.value.toLowerCase();
    
    cards.forEach(card => {
        const productName = card.querySelector('.card-info h4').innerText.toLowerCase();
        const typeName = card.getAttribute('data-type').toLowerCase();
        if (productName.includes(inputValue) || typeName.includes(inputValue)) {
            card.style.display = 'block'; // Muestra la tarjeta
            card.closest('.card').style.display = 'block';
        } else {
            card.style.display = 'none'; // Oculta la tarjeta
            card.closest('.card').style.display = 'none'
        }
    });
});
