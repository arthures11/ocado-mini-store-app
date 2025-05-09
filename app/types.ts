export interface PriceFormat {
    main: number;
    fractional: number;
}

export interface Product {
    id: number;
    name: string;
    price: PriceFormat;
}

export interface CartItemType extends Product {
    quantity: number;
}

export interface CartContextType {
    cartItems: CartItemType[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotalCost: () => number;
}


export interface NotificationMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface NotificationContextType {
    notifications: NotificationMessage[];
    addNotification: (message: string, type?: NotificationMessage['type']) => void;
    removeNotification: (id: string) => void;
}
