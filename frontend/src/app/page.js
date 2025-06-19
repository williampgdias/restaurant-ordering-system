export const dynamic = 'force-dynamic';

async function getDishes() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/dishes`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dishes = await response.json();
        return dishes;
    } catch (error) {
        console.error('Error fetching dishes:', error);
        return [];
    }
}

export default async function Home() {
    const dishes = await getDishes();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-4xl font-bold mb-8">Our Delicious Menu</h1>

            {dishes.length === 0 ? (
                <p>
                    No dishes available at the moment. Please check back later!
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dishes.map((dish) => (
                        <div
                            key={dish._id}
                            className="border p-4 rounded-lg shadow-md"
                        >
                            <h2 className="text-2xl font-semibold">
                                {dish.name}
                            </h2>
                            <p className="text-gray-600 mb-2">
                                {dish.description}
                            </p>
                            <p className="text-xl font-bold text-green-600">
                                ${dish.price.toFixed()}
                            </p>
                            <p className="text-sm text-gray-500">
                                Category: {dish.category}
                            </p>
                            {dish.isAvailable ? (
                                <span className="text-green-500 font-medium">
                                    Available
                                </span>
                            ) : (
                                <span className="text-red-500 font-medium">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
