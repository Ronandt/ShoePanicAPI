require('dotenv').config()
const express = require('express')
const display = require("./misc/display")
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(port, () => {
    display(port)
});