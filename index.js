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

// @route GET /posts
// @desc get all posts
// @access Public

app.post('/posts/create', async (req, res) => {
  try {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
  
    const post = {
      id,
      title,
    };
  
    posts[id] = post;
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: { ...post },
    });

    res.status(201).send({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 'FAIL' });
  }
});

app.post('/events', (req, res) => {
  res.status(200).json({});
});

app.listen(4000, () => {
  console.log('v55');
  console.log('Listening on port 4000');
});

// query-depl client-depl comments-depl event-bus-depl moderation-depl posts-depl
// client-srv comments-srv moderation-srv query-srv posts-srv event-bus-srv