import React, { useEffect, useState } from 'react';
import type {CartItemType, PriceFormat} from '../types';
import { formatPriceDisplay, getPriceAsNumber } from '../utils/priceUtils';
import {Link} from "react-router";

interface FinalizedOrder {
    items: CartItemType[];
    timestamp: string;
    total: number;
}

const OrderConfirmationPage: React.FC = () => {
    const [orderDetails, setOrderDetails] = useState<FinalizedOrder | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const rawOrderData = localStorage.getItem('finalizedOrder');
        if (rawOrderData) {
            try {
                const parsedOrder: FinalizedOrder = JSON.parse(rawOrderData);
                setOrderDetails(parsedOrder);
            } catch (e) {
                setError("There was an issue retrieving your order details.");
                localStorage.removeItem('finalizedOrder');
            }
        } else {
            setError("No order details found. Your order might have been processed, or you've navigated here directly.");
        }
    }, []);

    if (error) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Order Confirmation Issue</h1>
                <p className="text-xl text-white mb-6">{error}</p>
                <button onClick={() => window.location.href = '/ocado-mini-store-app/'}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150 inline-block"
                >
                    Back to Product List
                </button>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold mb-4">Loading Order Confirmation...</h1>
                <p>If this takes too long, please try returning to the product list.</p>
                <button onClick={() => window.location.href = '/ocado-mini-store-app/'}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150 inline-block"
                >
                    Back to Product List
                </button>
            </div>
        );
    }

    localStorage.removeItem('finalizedOrder');
    return (
        <div className="container mx-auto p-6 bg-white shadow-xl rounded-lg max-w-2xl text-center my-8">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>

            <div className="text-left my-6">
                <h2 className="text-xl font-semibold mb-3 border-b pb-2">Your Order Summary:</h2>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    {orderDetails.items.map(item => {
                        const itemPriceAsNum = getPriceAsNumber(item.price);
                        const subtotal = itemPriceAsNum * item.quantity;
                        return (
                            <li key={item.id} className="py-1">
                                {item.name} (x{item.quantity}) - ${formatPriceDisplay(item.price)} each = <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-4 pt-3 border-t">
                    <p className="text-xl font-bold text-right">
                        Total Cost: <span className="text-green-600">${orderDetails.total.toFixed(2)}</span>
                    </p>
                </div>
            </div>

            <p className="text-lg mb-6">Thank you for your purchase. Order placed at: {new Date(orderDetails.timestamp).toLocaleString()}</p>

            <button onClick={() => window.location.href = '/ocado-mini-store-app/'}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg transition duration-150 inline-block"
            >
                Back to Product List
            </button>
        </div>
    );
};

export default OrderConfirmationPage;
