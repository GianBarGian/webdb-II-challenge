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

// ERROR OBJECTS DECLARATION

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

//ZOOS ENDPOINTS

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

// BEARS ENDPOINTS

server.get('/api/bears', async (req, res, next) => {
  try {
    const bears = await db('bears');
    res.json(bears);
  } catch (error) {
    next(error500);
  }
})

server.get('/api/bears/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const bearsArr = await db('bears').where({ id });
    bearsArr 
      ? res.json(bearsArr[0]) 
      : next(error404);
  } catch (error) {
      next(error500);
  }
})

server.post('/api/bears', async (req, res, body) => {
  try {
    const idArr = await db('bears').insert(req.body);
    const bearsArr = await db('bears').where({ id: idArr[0] });
    res.json(bearsArr[0]);
  } catch (error) {
    next(error500)
  }
})

server.put('/api/bears/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const isUpdated = await db('bears').where({ id }).update(req.body);
    const bearsArr = await db('bears').where({ id });
    isUpdated
      ? res.json(bearsArr[0])
      : next(error404);
  } catch (error) {
    next(error500);
  }
})

server.delete('/api/bears/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const isDeleted = await db('bears').where({ id }).del();
    isDeleted
      ? res.json({ message: "Bear Succesfully Deleted"})
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
