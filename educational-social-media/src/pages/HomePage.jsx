import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { FaGraduationCap, FaBook, FaCode, FaLaptopCode } from 'react-icons/fa';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: <FaGraduationCap /> },
    { id: 'tutorials', name: 'Tutorials', icon: <FaBook /> },
    { id: 'code', name: 'Code Snippets', icon: <FaCode /> },
    { id: 'projects', name: 'Projects', icon: <FaLaptopCode /> }
  ];

  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'code') return post.content.includes('```');
    
    // For demo purposes new
    if (activeCategory === 'tutorials') {
      return post.content.toLowerCase().includes('tutorial') || 
             post.content.toLowerCase().includes('guide') ||
             post.content.toLowerCase().includes('how to');
    }
    
    if (activeCategory === 'projects') {
      return post.content.toLowerCase().includes('project') || 
             post.content.toLowerCase().includes('challenge');
    }
    
    return true;
  });

  return (
    <div className="home-page">
      <Navbar />
      
      <div className="container">
        <div className="main-content">
          <aside className="sidebar">
            <div className="card categories">
              <h3 className="section-title">Categories</h3>
              <ul className="category-list">
                {categories.map(category => (
                  <li 
                    key={category.id}
                    className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card trending">
              <h3 className="section-title">Trending Topics</h3>
              <ul className="trending-list">
                <li className="trending-item">
                  <span className="badge">React</span>
                </li>
                <li className="trending-item">
                  <span className="badge">Spring Boot</span>
                </li>
                <li className="trending-item">
                  <span className="badge">Machine Learning</span>
                </li>
                <li className="trending-item">
                  <span className="badge">Data Science</span>
                </li>
              </ul>
            </div>
          </aside>
          
          <div className="feed">
            <CreatePost refreshPosts={fetchPosts} />
            
            {isLoading ? (
              <div className="loading">Loading posts...</div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  refreshPosts={fetchPosts} 
                />
              ))
            ) : (
              <div className="no-posts">
                <h3>No posts found</h3>
                <p>Be the first to share educational content in this category!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;