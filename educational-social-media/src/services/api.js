import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/social/api';

const api = {
  // Posts
  getAllPosts: () => axios.get(`${API_BASE_URL}/posts`),
  getPostById: (id) => axios.get(`${API_BASE_URL}/post/${id}`),
  createPost: (post) => axios.post(`${API_BASE_URL}/add-post`, post),
  updatePost: (id, post) => axios.put(`${API_BASE_URL}/update-post/${id}`, post),
  deletePost: (id) => axios.delete(`${API_BASE_URL}/delete-post/${id}`),
  
  // Likes/Unlikes
  likePost: (id, likeCount) => axios.put(`${API_BASE_URL}/likes/${id}/${likeCount}`),
  unlikePost: (id, unlikeCount) => axios.put(`${API_BASE_URL}/unlikes/${id}/${unlikeCount}`),
  
  // Comments
  addComment: (postId, comment) => axios.put(`${API_BASE_URL}/comment/${postId}`, comment),
  updateComment: (postId, commentId, comment) => 
    axios.put(`${API_BASE_URL}/update-comment/${postId}/${commentId}`, comment),
  deleteComment: (postId, commentId) => 
    axios.delete(`${API_BASE_URL}/delete-comment/${postId}/${commentId}`)
};

export default api;