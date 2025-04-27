import React, { useState } from 'react';
import { FaCode, FaTimes } from 'react-icons/fa';
import api from '../services/api';

const CreatePost = ({ refreshPosts }) => {
  const [content, setContent] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let finalContent = content;
      
      if (showCodeEditor && code.trim()) {
        finalContent += `\n\n\`\`\`${language}\n${code}\n\`\`\``;
      }
      
      const post = {
        user: 'Guest',
        content: finalContent,
        like: 0,
        unlike: 0,
        comments: []
      };
      
      await api.createPost(post);
      setContent('');
      setCode('');
      setShowCodeEditor(false);
      
      if (refreshPosts) {
        refreshPosts();
      }
    } catch (err) {
      console.error('Error creating post', err);
    }
  };
  
  const toggleCodeEditor = () => {
    setShowCodeEditor(!showCodeEditor);
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
            required
          />
        </div>
        
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
                onClick={toggleCodeEditor}
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
          <button 
            type="button"
            className="btn btn-ghost"
            onClick={toggleCodeEditor}
          >
            <FaCode /> {showCodeEditor ? 'Hide Code Editor' : 'Add Code Snippet'}
          </button>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={!content.trim() && !code.trim()}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;