import React from 'react';
import { FaTimes, FaBell, FaThumbsUp, FaComment, FaReply } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ notifications, markAsRead, markAllAsRead, onClose }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'POST_LIKE':
        return <FaThumbsUp className="text-blue-500" />;
      case 'POST_COMMENT':
        return <FaComment className="text-green-500" />;
      case 'COMMENT_REPLY':
        return <FaReply className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'POST_LIKE':
        return `${notification.senderUser} liked your post`;
      case 'POST_COMMENT':
        return `${notification.senderUser} commented on your post`;
      case 'COMMENT_REPLY':
        return `${notification.senderUser} replied to your comment`;
      default:
        return 'New notification';
    }
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3 className="notification-title">
          <FaBell className="mr-2" />
          Notifications
        </h3>
        <div className="notification-actions">
          <button 
            className="btn-link"
            onClick={markAllAsRead}
            disabled={notifications.every(n => n.read)}
          >
            Mark all as read
          </button>
          <button className="btn-icon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
      </div>
      
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <p className="notification-message">
                  {getNotificationMessage(notification)}
                </p>
                <span className="notification-time">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;