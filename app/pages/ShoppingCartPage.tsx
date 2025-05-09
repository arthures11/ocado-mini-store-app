import React from 'react';
import { useCart } from '../context/CartContext';
import type {CartItemType} from '../types';
import { formatPriceDisplay, getPriceAsNumber } from '../utils/priceUtils';
import {Link} from "react-router";
import {useNotification} from "~/context/NotificationContext";

const ShoppingCartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalCost } = useCart();
    const { addNotification } = useNotification();


        if (!(cartItems && cartItems.length > 0)) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
                <p className="text-xl mb-4">Your cart is empty.</p>
                <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const handleQuantityChange = (item: CartItemType, newQuantity: number) => {
        const quantity = Math.max(0, newQuantity);
        if (quantity === 0) {
            removeFromCart(item.id);
            addNotification(`successfully removed ${item.name}!`, 'success');
        } else {
            if(quantity > item.quantity)
                addNotification(`added +1 ${item.name} successfully!`, 'success');
            else
                addNotification(`lowered the amount of ${item.name}`, 'success');

            updateQuantity(item.id, quantity);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                {cartItems?.map(item => {
                    const itemPriceAsNumber = getPriceAsNumber(item.price);
                    const subtotal = itemPriceAsNumber * item.quantity;
                    return (
                        <div key={item.id} className="flex items-center justify-between border-b py-4">
                            <div className="flex items-center w-2/5">
                                <div>
                                    <h2 className="text-lg font-semibold">{item.name}</h2>
                                    <p className="text-sm text-gray-600">${formatPriceDisplay(item.price)} each</p>
                                </div>
                            </div>
                            <div className="flex items-center w-1/5 justify-center">
                                <button
                                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold p-2 rounded-l h-10 w-10"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value, 10))}
                                    className="w-12 text-center border-t border-b h-10"
                                    min="0"
                                />
                                <button
                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold p-2 rounded-r h-10 w-10"
                                >
                                    +
                                </button>
                            </div>
                            <div className="w-1/5 text-right">
                                <p className="text-lg font-semibold">${subtotal.toFixed(2)}</p>
                            </div>
                            <div className="w-1/5 text-right">
                                <button
                                    onClick={() => handleQuantityChange(item, 0)}
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
                <div className="mt-6 pt-4">
                    <div className="flex justify-end items-center">
                        <span className="text-xl font-bold">Total:</span>
                        <span className="text-2xl font-bold ml-4">${getTotalCost()?.toFixed(2)}</span>
                    </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                    <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
                        ← Back to Product List
                    </Link>
                    <Link
                        to="/order-summary"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150"
                    >
                        Proceed to Order Summary
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCartPage;
