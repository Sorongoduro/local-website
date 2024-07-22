const postForm = document.querySelector('.post-form')
const url = 'http://localhost:3001/producto'

postForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const updateInputName = document.querySelector('.name-input').value
    const updateInputType = document.querySelector('.type-input').value
    const capitalName = updateInputName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    const capitalType = updateInputType.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    const postData = new FormData(postForm)
    const postDataJson = Object.fromEntries(postData)
    postDataJson.name = capitalName
    postDataJson.type = capitalType
    postDataJson.price = parseInt(postDataJson.price)
    postDataJson.quantity = parseInt(postDataJson.quantity)
    console.log(postDataJson)
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(postDataJson),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(res => console.log('Success', res))
    .catch(error => console.log('Error', error))
})

