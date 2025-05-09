import React, { createContext, useState, useContext, type ReactNode, useCallback } from 'react';
import type {NotificationMessage, NotificationContextType} from '../types';
import {v4 as uuidv4} from 'uuid';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

    const addNotification = useCallback((message: string, type: NotificationMessage['type'] = 'info') => {
        const id = uuidv4();
        setNotifications(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeNotification(id);
        }, 3000); // 3 seconds
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
