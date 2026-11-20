import { useState, useEffect } from 'react';
import api from '../services/api';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        const list = res.data.notifications || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-read');
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  return { notifications, unreadCount, refetch: fetchNotifications, markAllRead };
}
