'use client';

import { useState, useEffect } from 'react';

export default function Home() {
    const [dishes, setDishes] = useState([]);
    const [loadingDishes, setLoadingDishes] = useState(true);
    const [errorDishes, setErrorDishes] = useState(null);

    // State to manage selected items and order details
    const [selectedItems, setSelectedItems] = useState({});
    const [customerName, setCustomerName] = useState('');
    const [customerContact, setCustomerContact] = useState('');
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [errorOrder, setErrorOrder] = useState(null);
    const [successOrder, setSuccessOrder] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Effect to fetch dishes from the API
    useEffect(() => {
        async function fetchDishes() {
            try {
                const response = await fetch(`${apiUrl}/dishes`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDishes(data);
            } catch (error) {
                console.error('Failed to fetch dishes:', error);
                setErrorDishes('Failed to load menu. Please try again later.');
            } finally {
                setLoadingDishes(false);
            }
        }
        fetchDishes();
    }, [apiUrl]);

    // Function to handle quantity changes for each dish
    const handleQuantityChange = (dishId, quantity) => {
        setSelectedItems((prevItems) => {
            const newQuantity = Math.max(0, quantity);
            if (newQuantity === 0) {
                const newItems = { ...prevItems };
                delete newItems[dishId];
                return newItems;
            }
            return {
                ...prevItems,
                [dishId]: newQuantity,
            };
        });
    };

    // Function to handle order submission
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setLoadingOrder(true);
        setErrorOrder(null);
        setSuccessOrder(false);

        const orderItems = Object.keys(selectedItems).map((dishId) => ({
            dish: dishId,
            quantity: selectedItems[dishId],
        }));

        if (orderItems.length === 0) {
            setErrorOrder('Please select at least one dish for your order.');
            setLoadingOrder(false);
            return;
        }

        const orderData = {
            items: orderItems,
            customerName,
            customerContact,
        };

        try {
            const response = await fetch(`${apiUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order');
            }

            const newOrder = await response.json();
            console.log('Order placed successfully:', newOrder);
            setSuccessOrder(true);
            // Limpar formulário após sucesso
            setSelectedItems({});
            setCustomerName('');
            setCustomerContact('');

            // Opcional: Redirecionar para a página de pedidos ou mostrar mensagem
            // router.push('/orders'); // Se quiser redirecionar
        } catch (err) {
            setErrorOrder(err.message || 'An unexpected error occurred.');
            console.error('Error placing order:', err);
        } finally {
            setLoadingOrder(false);
        }
    };

    // Calcular total do pedido para exibição
    const calculateOrderTotal = () => {
        return Object.keys(selectedItems).reduce((total, dishId) => {
            const dish = dishes.find((d) => d._id === dishId);
            if (dish) {
                return total + dish.price * selectedItems[dishId];
            }
            return total;
        }, 0);
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-12">
                Our Delicious Menu
            </h1>

            {loadingDishes ? (
                <p className="text-xl text-blue-600">Loading menu...</p>
            ) : errorDishes ? (
                <p className="text-xl text-red-600">{errorDishes}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
                    {dishes.map((dish) => (
                        <div
                            key={dish._id}
                            className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 flex flex-col"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {dish.name}
                            </h2>
                            <p className="text-gray-600 mb-3 flex-grow">
                                {dish.description}
                            </p>
                            <p className="text-xl font-semibold text-green-600 mb-2">
                                ${dish.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Category: {dish.category}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-center mt-auto">
                                <button
                                    onClick={() =>
                                        handleQuantityChange(
                                            dish._id,
                                            (selectedItems[dish._id] || 0) - 1
                                        )
                                    }
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-lg disabled:opacity-50 mr-2"
                                    disabled={
                                        !selectedItems[dish._id] ||
                                        selectedItems[dish._id] === 0
                                    }
                                >
                                    -
                                </button>
                                <span className="text-xl font-bold mx-4">
                                    {selectedItems[dish._id] || 0}
                                </span>
                                <button
                                    onClick={() =>
                                        handleQuantityChange(
                                            dish._id,
                                            (selectedItems[dish._id] || 0) + 1
                                        )
                                    }
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full text-lg ml-2"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Formulário de Pedido */}
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Place Your Order
                </h2>
                <form onSubmit={handleSubmitOrder}>
                    <div className="mb-4">
                        <label
                            htmlFor="customerName"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="customerContact"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Your Contact (Email/Phone)
                        </label>
                        <input
                            type="text"
                            id="customerContact"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={customerContact}
                            onChange={(e) => setCustomerContact(e.target.value)}
                            required
                        />
                    </div>

                    {/* Itens selecionados no pedido */}
                    <div className="mb-6 border-t pt-4">
                        <h3 className="text-xl font-bold mb-3">
                            Order Summary:
                        </h3>
                        {Object.keys(selectedItems).length === 0 ? (
                            <p className="text-gray-600">
                                No items selected yet.
                            </p>
                        ) : (
                            <ul>
                                {Object.keys(selectedItems).map((dishId) => {
                                    const dish = dishes.find(
                                        (d) => d._id === dishId
                                    );
                                    if (!dish) return null; // Caso o prato não seja encontrado
                                    return (
                                        <li
                                            key={dishId}
                                            className="flex justify-between items-center mb-2"
                                        >
                                            <span className="text-gray-800">
                                                {selectedItems[dishId]} x{' '}
                                                {dish.name}
                                            </span>
                                            <span className="font-semibold">
                                                $
                                                {(
                                                    dish.price *
                                                    selectedItems[dishId]
                                                ).toFixed(2)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-2xl font-bold text-blue-700">
                                ${calculateOrderTotal().toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Mensagens de feedback */}
                    {loadingOrder && (
                        <p className="text-blue-500 mb-4 text-center">
                            Placing order...
                        </p>
                    )}
                    {errorOrder && (
                        <p className="text-red-500 mb-4 text-center">
                            {errorOrder}
                        </p>
                    )}
                    {successOrder && (
                        <p className="text-green-500 mb-4 text-center">
                            Order placed successfully! Thank you!
                        </p>
                    )}

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg w-full focus:outline-none focus:shadow-outline text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                            loadingOrder ||
                            Object.keys(selectedItems).length === 0
                        }
                    >
                        {loadingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </main>
    );
}
