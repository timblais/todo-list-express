const deleteBtn = document.querySelectorAll('.fa-trash') // defines delete button variable as all elements with the .fa-trash class
const item = document.querySelectorAll('.item span') // defines item variable as all span elements with the .item class
const itemCompleted = document.querySelectorAll('.item span.completed') //defines item completed variable ass all spans with .item and .completed classes

Array.from(deleteBtn).forEach((element)=>{ // creates an array from all elements assigned to the deleteBtn variable, then for each of those elements adds an event listener with an on click event to run the deleteItem function
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // creates an array from all elements assigned to the item variable, then for each of those elements adds an event listener with an on click event to run the markComplete function
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ // creates an array from all elements assigned to the itemCompleted variable, then for each of those elements adds an event listener with an on click event to run the markUnComplete function
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ // async function deleteItem...
    const itemText = this.parentNode.childNodes[1].innerText // grabs the innertext from the item that was clicked and assigns to itemText variable
    try{
        const response = await fetch('deleteItem', { // sends delete request to the server at path /deleteItem
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText // itemText is sent as JSON to the server to be used to take delete action in the database and send back
            })
          })
        const data = await response.json() // receive confirmation from the server that the request was completed
        console.log(data)
        location.reload() //reload the page

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}