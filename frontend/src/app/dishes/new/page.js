'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddDishPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImage] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const dishData = {
            name,
            description,
            price: parseFloat(price),
            category,
            imageUrl,
            isAvailable,
        };

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiUrl}/dishes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dishData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add dish');
            }

            const newDish = await response.json();
            console.log('New dish added:', newDish);
            setSuccess(true);

            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage('');
            setIsAvailable(true);

            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
            console.error('Error adding dish:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Add New Dish
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                {/* Name field */}
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Dish Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* Description Field */}
                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                {/* Price Field */}
                <div className="mb-4">
                    <label
                        htmlFor="price"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Price ($)
                    </label>
                    <input
                        type="number"
                        id="price"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        step="0.01"
                        required
                    />
                </div>

                {/* Category Field */}
                <div className="mb-4">
                    <label
                        htmlFor="category"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Category
                    </label>
                    <input
                        type="text"
                        id="category"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>

                {/* Image URL field */}
                <div className="mb-6">
                    <label
                        htmlFor="imageUrl"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Image URL (Optional)
                    </label>
                    <input
                        type="url"
                        id="imageUrl"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>

                {/* Checkbox Is Available */}
                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        id="isAvailable"
                        className="mr-2 leading-tight"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                    />
                    <label
                        htmlFor="isAvailable"
                        className="text-gray-700 text-sm font-bold"
                    >
                        Available on Menu
                    </label>
                </div>

                {/* Feedback message */}
                {loading && (
                    <p className="text-blue-500 mb-4">Adding dish...</p>
                )}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && (
                    <p className="text-green-500 mb-4">
                        Dish added successfully! Redirecting...
                    </p>
                )}

                {/* Submit button */}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Dish'}
                    </button>
                </div>
            </form>
        </main>
    );
}
