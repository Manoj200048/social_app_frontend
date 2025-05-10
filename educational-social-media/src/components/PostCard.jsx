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
  
  const validateContent = (text) => {
    if (!text.trim()) return "Content cannot be empty";
    if (/^[0-9\s]+$/.test(text)) return "Post content cannot be only numbers";
    if (!/[a-zA-Z]{3,}/.test(text)) return "Content must contain meaningful words";
    if (text.length < 10) return "Content must be at least 10 characters long";
    return '';
  };

  const handleLike = async () => {
    try {
      await api.likePost(post.id, post.like);
      refreshPosts?.();
    } catch (err) {
      alert(err.message || 'Failed to like post');
    }
  };
  
  const handleUnlike = async () => {
    try {
      await api.unlikePost(post.id, post.unlike);
      refreshPosts?.();
    } catch (err) {
      alert(err.message || 'Failed to unlike post');
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.deletePost(post.id);
      refreshPosts?.();
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    }
  };
  
  const handleEdit = async () => {
    if (editing) {
      const error = validateContent(editContent);
      if (error) {
        alert(error);
        return;
      }
      
      try {
        const updatedPost = { ...post, content: editContent };
        await api.updatePost(post.id, updatedPost);
        refreshPosts?.();
        setEditing(false);
      } catch (err) {
        alert(err.message || 'Failed to update post');
      }
    } else {
      setEditing(true);
    }
  };
  
  const formatContent = (content) => {
    if (!containsCode) return content;
    const parts = content.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 0) return <div key={index}>{part}</div>;
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
    });
  };

  const renderMediaContent = () => {
    if (!post.contentUrl) return null;
    return post.postType === 'PHOTO' ? (
      <div className="media-content">
        <img src={post.contentUrl} alt="Post" className="post-media" />
      </div>
    ) : (
      <div className="media-content">
        <video controls className="post-media">
          <source src={post.contentUrl} type="video/mp4" />
        </video>
      </div>
    );
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
              <button className="btn-link" onClick={() => setExpanded(true)}>
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
            <FaComment /> <span>{post.comments?.length || 0}</span>
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