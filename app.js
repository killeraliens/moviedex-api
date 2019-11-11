require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const movies = require('./movies')

const app = express()
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(function validateAuthToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  const bearerToken = authToken ? authToken.split(' ')[1] : null;
  if(!bearerToken || apiToken !== bearerToken) {
    return res.status(401).json({error: 'Unauthorized Request'});
  }

  next()
})
app.get('/movies', handleGetMovies)


function handleGetMovies(req, res) {
  res.json(movies)
}

module.exports = app

