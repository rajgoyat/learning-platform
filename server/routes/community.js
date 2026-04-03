const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPosts,
  createPost,
  addComment,
} = require('../controllers/communityController');

router.get('/posts', protect, getPosts);
router.post('/posts', protect, createPost);
router.post('/posts/:id/comments', protect, addComment);

module.exports = router;

