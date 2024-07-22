const putForm = document.querySelector('.put-form')

putForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const putInput = document.querySelector('.name-input').value
    const capital = putInput.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const putData = new FormData(putForm)
    const putDataJson = Object.fromEntries(putData)
    putDataJson.name = capital
    putDataJson.price = parseInt(putDataJson.price)
    putDataJson.quantity = parseInt(putDataJson.quantity)
    if(isNaN(putDataJson.price)) {
        fetch('https://local-api-822e4889e0cf.herokuapp.com/producto', {
            method: 'PUT',
            body: JSON.stringify({name: putDataJson.name}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(producto => {
            const precioOriginal = producto.price
            putDataJson.price = precioOriginal
            console.log(putDataJson)
            return fetch(`https://local-api-822e4889e0cf.herokuapp.com/producto`, {
                method: 'PUT',
                body: JSON.stringify(putDataJson),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        })
    } else if (isNaN(putDataJson.quantity)) {
        fetch('https://local-api-822e4889e0cf.herokuapp.com/producto', {
            method: 'PUT',
            body: JSON.stringify({name: putDataJson.name}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(producto => {
            const cantidadOriginal = producto.quantity
            putDataJson.quantity = cantidadOriginal
            console.log(putDataJson)
            return fetch(`https://local-api-822e4889e0cf.herokuapp.com/producto`, {
                method: 'PUT',
                body: JSON.stringify(putDataJson),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        })
    }  else {
        console.log(putDataJson)
        fetch(`https://local-api-822e4889e0cf.herokuapp.com/producto`, {
            method: 'PUT',
            body: JSON.stringify(putDataJson),
            headers:{
                'Content-Type': 'application/json'
            }
        })  
    }
})
