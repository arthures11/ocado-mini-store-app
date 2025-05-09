import React from 'react';
import { useCart } from '../context/CartContext';
import { formatPriceDisplay, getPriceAsNumber } from '../utils/priceUtils';
import {Link, useNavigate} from "react-router";

const OrderSummaryPage: React.FC = () => {
    const { cartItems, getTotalCost, clearCart } = useCart();
     const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-3xl font-bold mb-6">Order Summary</h1>
                <p className="text-xl mb-4">Your cart is empty. Cannot proceed to summary.</p>
                <Link to="/ocado-mini-store-app/cart" className="text-blue-500 hover:text-blue-700 underline">
                    Go to Cart
                </Link>
            </div>
        );
    }

    const handlePlaceOrder = () => {
        const orderDetails = {
            items: cartItems,
            total: getTotalCost(),
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem('finalizedOrder', JSON.stringify(orderDetails));
        clearCart();
        window.location.href = '/ocado-mini-store-app/order-confirmation';
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Order Summary</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Items in your order:</h2>
                {cartItems.map(item => {
                    const itemPriceAsNumber = getPriceAsNumber(item.price);
                    const subtotal = itemPriceAsNumber * item.quantity;
                    return (
                        <div key={item.id} className="flex justify-between items-center border-b py-3">
                            <div>
                                <h3 className="text-lg">{item.name} (x{item.quantity})</h3>
                                <p className="text-sm text-gray-600">${formatPriceDisplay(item.price)} each</p>
                            </div>
                            <p className="text-lg font-semibold">${subtotal.toFixed(2)}</p>
                        </div>
                    );
                })}
                <div className="mt-6 pt-4">
                    <div className="flex justify-end items-center">
                        <span className="text-xl font-bold">Final Total:</span>
                        <span className="text-2xl font-bold ml-4">${getTotalCost().toFixed(2)}</span>
                    </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                    <Link to="/ocado-mini-store-app/cart" className="text-blue-500 hover:text-blue-700 underline">
                        ← Back to Cart
                    </Link>
                    <button
                        onClick={handlePlaceOrder}
                        className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded text-lg transition duration-150"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummaryPage;
