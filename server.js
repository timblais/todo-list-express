const express = require('express') // requires install of express package
const app = express() // sets app variable to express for use of express features
const MongoClient = require('mongodb').MongoClient // requires install of mongodb package
const PORT = 2121 // sets port constant to 2121 for running the server
require('dotenv').config()


let db, // declaring db variable but not assigning it
    dbConnectionStr = process.env.DB_STRING, // declaring dbConnectionStr and assigning to environment variable for database string
    dbName = 'todo' // declaring database name as todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongodb using the connection string from environment variable
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // then console log the name of the database
        db = client.db(dbName) // assign db variable to name of the database
    })
    
app.set('view engine', 'ejs') // tell the app to use ejs as the view engine
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{ // when making a call to the root directory, respond with...
    const todoItems = await db.collection('todos').find().toArray() // create variable, pull collection from mongodb, create array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // create variable, grab collection of todos, count items with completed property value of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // respond by rendering index.ejs file, items is the todoItems array, left is the itemsLeft value (number)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // when receiving post request at the /addTodo directory...
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // access the todos collection of the database and add the item
    .then(result => {
        console.log('Todo Added') // then console log the item
        response.redirect('/') // then redirect to the root directory
    })
    .catch(error => console.error(error)) // if there is an error, display in the console
})

app.put('/markComplete', (request, response) => { //when receiving put request at the /markComplete directory...
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the object in the database...
        $set: {
            completed: true //set completed property to true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //when receiving put request at the .markUnComplete path...
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //find the object in the database
        $set: {
            completed: false //mark completed property as false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //when receiving a delete request from /deleteItem...
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //find item in db and delete it
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //listen on port defined in environment variable, or default to port defined in PORT variable
    console.log(`Server running on port ${PORT}`)
})