import axios from 'axios';

// Configure axios instance
const instance = axios.create({
  baseURL: 'http://localhost:8080/social/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Handle file uploads and URL creation for development
const handleMediaUpload = async (file) => {
  // In a real application, you would upload the file to a storage service
  // and get back a URL. For this demo, we're using object URLs.
  
  // TODO: Replace with actual file upload API when backend is ready
  
  // For demo purposes only - object URLs will only work in the current session
  const objectUrl = URL.createObjectURL(file);
  
  return {
    url: objectUrl,
    fileType: file.type
  };
};

const api = {
  // Posts
  getAllPosts: () => instance.get('/posts'),
  getPostsByType: (type) => instance.get(`/posts/type/${type}`),
  getPostById: (id) => instance.get(`/post/${id}`),
  
  createPost: async (post) => {
    // If post contains media file, handle upload first
    if (post.mediaFile) {
      const mediaData = await handleMediaUpload(post.mediaFile);
      post.contentUrl = mediaData.url;
      delete post.mediaFile; // Remove the file object before sending to API
    }
    
    return instance.post('/add-post', post);
  },
  
  updatePost: async (id, post) => {
    // Handle media updates if needed
    if (post.mediaFile) {
      const mediaData = await handleMediaUpload(post.mediaFile);
      post.contentUrl = mediaData.url;
      delete post.mediaFile;
    }
    
    return instance.put(`/update-post/${id}`, post);
  },
  
  deletePost: (id) => instance.delete(`/delete-post/${id}`),
  
  // Likes/Unlikes
  likePost: (id, username) => instance.put(`/likes/${id}?username=${username}`),
  unlikePost: (id) => instance.put(`/unlikes/${id}`),
  
  // Comments
  addComment: (postId, comment) => instance.put(`/comment/${postId}`, comment),
  updateComment: (postId, commentId, comment) => 
    instance.put(`/update-comment/${postId}/${commentId}`, comment),
  deleteComment: (postId, commentId) => 
    instance.delete(`/delete-comment/${postId}/${commentId}`),
  
  // Notifications
  getNotifications: (username) => instance.get(`/notifications/${username}`),
  getUnreadNotifications: (username) => instance.get(`/notifications/${username}/unread`),
  markNotificationAsRead: (notificationId) => instance.put(`/notifications/${notificationId}/mark-read`),
  markAllNotificationsAsRead: (username) => instance.put(`/notifications/${username}/mark-all-read`)
};

export default api;