import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-bold hover-text-gray-300 transition-colors duration-200"
                >
                    My restaurant
                </Link>

                {/* Nav links */}
                <div className="space-x-4">
                    <Link
                        href="/"
                        className="hover:text-gray-300 transition-colors duration-200"
                    >
                        Menu
                    </Link>
                    <Link
                        href="/orders"
                        className="hover:text-gray-300 transition-colors duration-200"
                    >
                        Orders
                    </Link>
                    <Link
                        href="/dishes/new"
                        className="hover:text-gray-300 transition-colors duration-200"
                    >
                        Add Dish
                    </Link>
                </div>
            </div>
        </nav>
    );
}
