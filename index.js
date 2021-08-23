const express = require('express')
const app = express()
const port = 4000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://duck:9698@boilerplate.lheu2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true
    }).then(() => console.log('MongoDB connected success'))
    .catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})