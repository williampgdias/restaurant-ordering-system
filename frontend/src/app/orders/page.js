export const dynamic = 'force-dynamic';

async function getOrders() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/orders`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const orders = await response.json();
        return orders;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }
}

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
            <h1 className="text-4xl font-bold ext-gray-800 mb-8">All Orders</h1>

            {orders.length === 0 ? (
                <p>No orders placed yet. Start ordering!</p>
            ) : (
                <div className="w-full max-w-4xl space-y-8">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-4f pb-2 border-b">
                                <h2 className="text-2xl font-semibold">
                                    Order ID: {order._id.substring(0, 8)}
                                </h2>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        order.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : order.status === 'preparing'
                                            ? 'bg-blue-100 text-blue-800'
                                            : order.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {order.status.charAt(0).toUpperCase() +
                                        order.status.slice(1)}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-2">
                                <span className="font-medium">Customer:</span>{' '}
                                {order.customerName || 'N/A'}
                            </p>

                            <h3 className="text-xl font-bold mb-3 mt-4">
                                Items:
                            </h3>
                            <ul className="list-disc pl-5 mb-4">
                                {order.items.map((item, index) => {
                                    return (
                                        <li
                                            key={item._id || index}
                                            className="mb-1 text-gray-800"
                                        >
                                            {item.quantity} x{' '}
                                            {item.dish
                                                ? item.dish.name
                                                : 'Unknown Dish'}
                                            ($
                                            {(
                                                item.quantity * item.price
                                            ).toFixed(2)}
                                            )
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="text-right border-t pt-4 mt-4">
                                <p className="text-2xl font-bold text-blue-700">
                                    Total: ${order.totalAmount.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Placed on:{' '}
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}{' '}
                                    at{' '}
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
