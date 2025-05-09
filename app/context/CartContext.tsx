import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import type {Product, CartItemType, CartContextType} from '../types';
import { getPriceAsNumber } from '../utils/priceUtils';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
        if (typeof window !== 'undefined') {
            const localData = localStorage.getItem('shoppingCart');
            return localData ? JSON.parse(localData) : [];
        }
        else{
            return
        }


    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCartItems(prevItems =>
            prevItems
                .map(item => (item.id === productId ? { ...item, quantity } : item))
                .filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('shoppingCart');
        }

    };

    const getTotalCost = (): number => { // Ensure this returns a number
        return cartItems?.reduce((total, item) => {
            const itemPriceAsNumber = getPriceAsNumber(item.price);
            return total + itemPriceAsNumber * item.quantity;
        }, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalCost }}>
            {children}
        </CartContext.Provider>
    );
};
