const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');
const { json, urlencoded } = express;

const posts = {};

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  const post = {
    id,
    title,
  };

  posts[id] = post;

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: { ...post },
  });

  res.status(201).send({
    success: true,
    post,
  });
});

app.post('/events', (req, res) => {
  res.status(200).json({});
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
