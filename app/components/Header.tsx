import React from 'react';
import { useCart } from '~/context/CartContext';
import {Link} from "react-router";

const Header: React.FC = () => {
    const { cartItems } = useCart();
    let itemCount = 0;
    if(cartItems === undefined){

    }
    else{
        itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    return (
        <header className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold hover:text-gray-300">My Shop</Link>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li>
                            <Link to="/" className="hover:text-gray-300">Product List</Link>
                        </li>
                        <li>
                            <Link to="/cart" className="relative hover:text-gray-300">
                                Shopping Cart
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
