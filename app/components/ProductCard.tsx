import React from 'react';
import type {Product} from '../types';
import { useCart } from '../context/CartContext';
import { formatPriceDisplay } from '../utils/priceUtils';
import {useNotification} from "~/context/NotificationContext";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { addNotification } = useNotification();

    const handleAddToCart = () => {
        addNotification(`${product.name} added to cart!`, 'success');
        addToCart(product);
    };

    return (
        <div className="border rounded-lg p-4 shadow-lg bg-white flex flex-col">
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-700 text-lg mb-4">${formatPriceDisplay(product.price)}</p>
            <button
                onClick={() => handleAddToCart()}
                className="mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
