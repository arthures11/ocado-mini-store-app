import React from 'react';
import { useNotification } from '~/context/NotificationContext';
import type {NotificationMessage} from '~/types';

const NotificationItem: React.FC<{ notification: NotificationMessage; onDismiss: () => void }> = ({
                                                                                                      notification,
                                                                                                      onDismiss,
                                                                                                  }) => {
    let bgColor = 'bg-blue-500';
    if (notification.type === 'success') bgColor = 'bg-green-500';
    else if (notification.type === 'error') bgColor = 'bg-red-500';

    return (
        <div
            className={`relative ${bgColor} text-white p-3 rounded-md shadow-lg mb-2 transition-all duration-300 ease-in-out transform opacity-100 translate-y-0`}
            role="alert"
        >
            <p>{notification.message}</p>
            <button
                onClick={onDismiss}
                className="absolute top-1 right-1 text-white hover:text-gray-200"
                aria-label="Dismiss notification"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};


const NotificationDisplay: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 left-4 z-50 w-64 sm:w-80">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

export default NotificationDisplay;
