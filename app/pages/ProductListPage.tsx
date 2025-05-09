import React from 'react';
import ProductCard from '../components/ProductCard';
import productsData from '../products.json';
import type {Product} from '../types';

const ProductListPage: React.FC = () => {
    const products: Product[] = productsData;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;
