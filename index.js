const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const errors = require('./middlewares/errors');

const db = knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3',
  }
})

const error500 = {
  status: 500,
  message: 'Something went wrong',
}

const error404 = {
  status: 404,
  message: "Spcified Id doesn't exists"
}

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/api/zoos', async (req, res, next) => {
  try {
    const animals = await db('zoos');
    res.json(animals);
  } catch (error) {
    next(error500);
  }
})

server.get('/api/zoos/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const animalArr = await db('zoos').where({ id });
    animalArr 
      ? res.json(animalArr[0]) 
      : next(error404);
  } catch (error) {
      next(error500);
  }
})

server.post('/api/zoos', async (req, res, body) => {
  try {
    const idArr = await db('zoos').insert(req.body);
    const animalArr = await db('zoos').where({ id: idArr[0] });
    res.json(animalArr[0]);
  } catch (error) {
    next(error500)
  }
})

server.put('/api/zoos/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const isUpdated = await db('zoos').where({ id }).update(req.body);
    const animalArr = await db('zoos').where({ id });
    isUpdated
      ? res.json(animalArr[0])
      : next(error404);
  } catch (error) {
    next(error500);
  }
})

server.delete('/api/zoos/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const isDeleted = await db('zoos').where({ id }).del();
    isDeleted
      ? res.json({ message: "Animal Succesfully Deleted"})
      : next(error404);
  } catch (error) {
    next(error500);
  }
})

server.use(errors.error);

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
