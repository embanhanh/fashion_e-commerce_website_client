import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const { shopInfo } = useSelector((state) => state.shop);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const docs = doc(db, 'notifications', user.role === 'admin' ? 'admin' : user._id);
            const unsubscribe = onSnapshot(docs, (doc) => {
                if (doc.exists()) {
                    const allNotifs = doc.data().notifications || [];
                    const recentNotifs = Array.from(allNotifs).sort(
                        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
                    );
                    setNotifications(recentNotifs);
                }
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleReadNotification = async (notification) => {
        try {
            if (!notification.read) {
                const notificationRef = doc(db, 'notifications', user.role === 'admin' ? 'admin' : user._id);

                const updatedNotifications = notifications.map((notif) => {
                    if (notif.createdAt.toMillis() === notification.createdAt.toMillis()) {
                        return { ...notif, read: true };
                    }
                    return notif;
                });

                await updateDoc(notificationRef, {
                    notifications: updatedNotifications,
                });
            }

            if (notification.link) {
                navigate(notification.link);
            }
        } catch (error) {
            console.error('Lỗi khi đánh dấu đã đọc:', error);
        }
    };

    return (
        <div className="container mt-5 bg-white p-4 rounded-3">
            <h4 className="mb-4 fs-3">Thông báo của bạn</h4>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p className="fs-4 text-center">Không có thông báo nào</p>
                ) : (
                    notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="d-flex align-items-center p-3 border-bottom hover-icon"
                            style={{
                                cursor: 'pointer',
                                backgroundColor: notification.read ? 'transparent' : '#f0f0f0',
                            }}
                            onClick={() => handleReadNotification(notification)}
                        >
                            <img
                                src={shopInfo?.logo}
                                alt=""
                                height={80}
                                width={80}
                                className="me-3"
                            />
                            <div className="flex-grow-1 fs-4">
                                <p className="fs-4 mb-1">{notification.message}</p>
                                <small className="text-muted">
                                    {notification.createdAt.toDate().toLocaleString('vi-VN')}
                                </small>
                            </div>
                            {!notification.read && (
                                <span className="badge bg-primary rounded-pill">Mới</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;