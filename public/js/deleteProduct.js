const delForm = document.querySelector('.del-form')

delForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const delInput = document.querySelector('.name-input').value
    const capital = delInput.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const delData = new FormData(delForm)
    const delDataJson = Object.fromEntries(delData)
    delDataJson.name = capital
    console.log(delDataJson)
    fetch(`http://localhost:3001/producto/`, {
        method: 'DELETE',
        body: JSON.stringify({name: delDataJson.name}),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(res => console.log('Success', res))
    .catch(error => console.log('Error', error))
})
