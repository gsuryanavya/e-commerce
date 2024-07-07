import React, { useState, useEffect } from 'react';
import Products from '../Products.jsx';
import SearchBar from './Search.js';
import Cart from './Cart.js';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    // Define a conversion rate from USD to INR
    const conversionRate = 75; // 1 USD = 75 INR

    useEffect(() => {
        // Function to fetch products from Fake Store API using fetch
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products');
                const data = await response.json();
                const apiProducts = data.map(product => ({
                    id: product.id + Products.length, // Adjust id to avoid conflict with static products
                    name: product.title,
                    price: (product.price * conversionRate).toFixed(2), // Convert price to INR
                    image: product.image,
                    description: product.description,
                    slug: product.title.toLowerCase().replace(/\s+/g, '-')
                }));
                const allProducts = [...Products, ...apiProducts];
                setProducts(allProducts);
                setFilteredProducts(allProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        // Fetch products when component mounts
        fetchProducts();
    }, []);

    const handleSearch = (query) => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const increaseQuantity = (productId) => {
        setCartItems(cartItems.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const decreaseQuantity = (productId) => {
        setCartItems(cartItems.map(item =>
            item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold my-8">Product Catalog</h1>
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <div key={product.id} className="border rounded-lg p-4 shadow-lg">
                        <img src={product.image} alt={product.name} className="h-40 w-full object-cover mb-4"/>
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p className="text-gray-700">₹{product.price}</p> {/* Display price in INR */}
                        <p className="text-gray-500 mt-2">{product.description}</p>
                        <button
                            onClick={() => addToCart(product)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
            <Cart cartItems={cartItems} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} />
        </div>
    );
};

export default ProductList;
