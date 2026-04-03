const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

const mapComment = (comment) => ({
  id: comment._id,
  user: comment.user,
  userName: comment.userName,
  text: comment.text,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});

const mapPost = (post) => ({
  id: post._id,
  user: post.user,
  userName: post.userName,
  text: post.text,
  comments: (post.comments || []).map(mapComment),
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

exports.getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: posts.length,
      posts: posts.map(mapPost),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Post text is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await CommunityPost.create({
      user: user._id,
      userName: user.name,
      text: text.trim(),
    });

    res.status(201).json({
      success: true,
      post: mapPost(post),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await CommunityPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: user._id,
      userName: user.name,
      text: text.trim(),
    });

    await post.save();

    res.status(200).json({
      success: true,
      post: mapPost(post),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

