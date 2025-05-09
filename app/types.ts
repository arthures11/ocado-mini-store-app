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
