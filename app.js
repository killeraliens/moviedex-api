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
app.use(validateAuthToken)
app.use(errorHandler)
app.get('/movies', handleGetMovies)
app.get('/movie', handleGetMovie)

function errorHandler(error, req, res, next) {
  let response;
  if ( process.env.NODE_ENV === 'production') {
    response = {error: {message: 'Server Error'}}
  } else {
    response = {error}
  }
  res.status(500).json(response)
}

function validateAuthToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  const bearerToken = authToken ? authToken.split(' ')[1] : null;
  if (!bearerToken || apiToken !== bearerToken) {
    return res.status(401).json({ error: 'Unauthorized Request' });
  }
  next()
}

function handleGetMovies(req, res) {
  res.json(movies)
}

function handleGetMovie(req, res) {
  const { genre = '', country = '', avg_vote } = req.query;
  let results = [...movies];

  if (genre) {
    results = results.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase())
    })
  }

  if (country) {
    results = results.filter(movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase())
    })
  }

  if (avg_vote) {
    let num = Number.parseFloat(avg_vote)
    Number.isNaN(num)
      ? res.status(400).json({error: "avg_vote Must Be A Number"})
      : results = results.filter(movie => movie.avg_vote >= num)
  }

  res.json(results)
}

module.exports = app

