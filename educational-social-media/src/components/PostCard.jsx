import React from 'react';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaComment, FaCode, FaTrash, FaEdit, FaImage, FaVideo } from 'react-icons/fa';
import api from '../services/api';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const PostCard = ({ post, refreshPosts }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(post.content);
  
  const containsCode = post.content.includes('```');
  
  const handleLike = async () => {
    try {
      await api.likePost(post.id, post.like);
      if (refreshPosts) refreshPosts();
    } catch (err) {
      console.error('Error liking post', err);
    }
  };
  
  const handleUnlike = async () => {
    try {
      await api.unlikePost(post.id, post.unlike);
      if (refreshPosts) refreshPosts();
    } catch (err) {
      console.error('Error unliking post', err);
    }
  };
  
  const handleDelete = async () => {
    try {
      await api.deletePost(post.id);
      if (refreshPosts) refreshPosts();
    } catch (err) {
      console.error('Error deleting post', err);
    }
  };
  
  const handleEdit = async () => {
    if (editing) {
      try {
        const updatedPost = { ...post, content: editContent };
        await api.updatePost(post.id, updatedPost);
        if (refreshPosts) refreshPosts();
        setEditing(false);
      } catch (err) {
        console.error('Error updating post', err);
      }
    } else {
      setEditing(true);
    }
  };
  
  const formatContent = (content) => {
    if (!containsCode) return content;
    
    const parts = content.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        return <div key={index}>{part}</div>;
      } else {
        const language = part.split('\n')[0];
        const code = part.substring(language.length + 1);
        return (
          <SyntaxHighlighter 
            key={index}
            language={language || 'javascript'} 
            style={atomOneDark}
            className="code-block"
          >
            {code}
          </SyntaxHighlighter>
        );
      }
    });
  };

  const renderMediaContent = () => {
    if (!post.contentUrl) return null;
    
    if (post.postType === 'PHOTO') {
      return (
        <div className="media-content">
          <img 
            src={post.contentUrl} 
            alt="Post" 
            className="post-media"
          />
        </div>
      );
    } else if (post.postType === 'VIDEO') {
      return (
        <div className="media-content">
          <video 
            controls 
            className="post-media"
          >
            <source src={post.contentUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="card post-card">
      <div className="post-header">
        <div className="flex items-center gap-2">
          <div className="avatar">
            {post.user ? post.user.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="post-author">{post.user || 'Unknown User'}</h3>
            <span className="text-xs text-muted">Education Enthusiast</span>
          </div>
        </div>
        <div className="post-actions">
          <button className="btn-icon" onClick={handleEdit}>
            <FaEdit />
          </button>
          <button className="btn-icon btn-danger" onClick={handleDelete}>
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="post-content">
        {editing ? (
          <div className="form-group">
            <textarea 
              className="form-control textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary" onClick={handleEdit}>Save</button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {renderMediaContent()}
            <div className={`content ${expanded ? 'expanded' : ''}`}>
              {formatContent(post.content)}
            </div>
            {post.content.length > 300 && !expanded && (
              <button 
                className="btn-link"
                onClick={() => setExpanded(true)}
              >
                Read more
              </button>
            )}
          </>
        )}
      </div>
      
      <div className="post-footer">
        <div className="post-stats">
          <button className="btn-stat" onClick={handleLike}>
            <FaThumbsUp /> <span>{post.like}</span>
          </button>
          <button className="btn-stat" onClick={handleUnlike}>
            <FaThumbsDown /> <span>{post.unlike}</span>
          </button>
          <Link to={`/post/${post.id}`} className="btn-stat">
            <FaComment /> <span>{post.comments ? post.comments.length : 0}</span>
          </Link>
        </div>
        
        <div className="post-badges">
          {containsCode && (
            <span className="badge mr-2">
              <FaCode /> Code Snippet
            </span>
          )}
          {post.postType === 'PHOTO' && (
            <span className="badge badge-photo">
              <FaImage /> Photo
            </span>
          )}
          {post.postType === 'VIDEO' && (
            <span className="badge badge-video">
              <FaVideo /> Video
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;