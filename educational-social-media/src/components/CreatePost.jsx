import React, { useState } from 'react';
import { FaCode, FaTimes, FaImage, FaVideo } from 'react-icons/fa';
import api from '../services/api';

const CreatePost = ({ refreshPosts }) => {
  const [content, setContent] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [postType, setPostType] = useState('TEXT');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let finalContent = content;
      let contentUrl = '';
      
      // Handle media upload if present
      if (mediaFile && (postType === 'PHOTO' || postType === 'VIDEO')) {
        // In a real app, you would upload to a storage service and get back a URL
        // For now, we'll use object URLs for demo purposes only
        contentUrl = URL.createObjectURL(mediaFile);
      }
      
      // Handle code if present
      if (showCodeEditor && code.trim()) {
        finalContent += `\n\n\`\`\`${language}\n${code}\n\`\`\``;
      }
      
      const post = {
        user: 'Guest',
        content: finalContent,
        contentUrl: contentUrl,
        postType: postType,
        like: 0,
        unlike: 0,
        comments: []
      };
      
      await api.createPost(post);
      setContent('');
      setCode('');
      setShowCodeEditor(false);
      setShowMediaUpload(false);
      setMediaFile(null);
      setMediaPreview('');
      setPostType('TEXT');
      
      if (refreshPosts) {
        refreshPosts();
      }
    } catch (err) {
      console.error('Error creating post', err);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setMediaPreview(objectUrl);
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  
  const clearMediaSelection = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview('');
    setShowMediaUpload(false);
  };
  
  const languages = [
    'javascript', 'python', 'java', 'cpp', 'csharp', 
    'html', 'css', 'php', 'ruby', 'go', 'typescript'
  ];

  return (
    <div className="card create-post">
      <h3 className="section-title">Create a Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea 
            className="form-control textarea"
            placeholder="Share educational content, ask questions, or post code snippets..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required={!mediaFile} // Either content or media should be present
          />
        </div>
        
        {showMediaUpload && (
          <div className="media-upload-container">
            <div className="media-upload-header">
              <div className="flex items-center gap-2">
                {postType === 'PHOTO' ? <FaImage /> : <FaVideo />}
                <span>Upload {postType.toLowerCase()}</span>
              </div>
              <button 
                type="button" 
                className="btn-icon"
                onClick={clearMediaSelection}
              >
                <FaTimes />
              </button>
            </div>
            <input 
              type="file" 
              accept={postType === 'PHOTO' ? 'image/*' : 'video/*'}
              onChange={handleFileChange}
              className="form-control"
            />
            {mediaPreview && (
              <div className="media-preview">
                {postType === 'PHOTO' ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="media-preview-image"
                  />
                ) : (
                  <video controls className="media-preview-video">
                    <source src={mediaPreview} type={mediaFile?.type} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>
        )}
        
        {showCodeEditor && (
          <div className="code-editor-container">
            <div className="code-editor-header">
              <div className="flex items-center gap-2">
                <FaCode />
                <select 
                  className="form-control"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                type="button" 
                className="btn-icon"
                onClick={() => setShowCodeEditor(false)}
              >
                <FaTimes />
              </button>
            </div>
            <textarea 
              className="form-control textarea code-textarea"
              placeholder="// Paste your code here"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        )}
        
        <div className="create-post-actions">
          <div className="post-type-actions">
            <button 
              type="button"
              className={`btn ${postType === 'PHOTO' && showMediaUpload ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setPostType('PHOTO');
                setShowMediaUpload(true);
                setShowCodeEditor(false);
              }}
            >
              <FaImage /> Photo
            </button>
            <button 
              type="button"
              className={`btn ${postType === 'VIDEO' && showMediaUpload ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setPostType('VIDEO');
                setShowMediaUpload(true);
                setShowCodeEditor(false);
              }}
            >
              <FaVideo /> Video
            </button>
            <button 
              type="button"
              className={`btn ${showCodeEditor ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setPostType('TEXT');
                setShowCodeEditor(!showCodeEditor);
                setShowMediaUpload(false);
              }}
            >
              <FaCode /> {showCodeEditor ? 'Hide Code' : 'Add Code'}
            </button>
          </div>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={(!content.trim() && !code.trim() && !mediaFile)}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;