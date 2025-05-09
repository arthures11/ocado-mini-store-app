import {CartProvider} from "~/context/CartContext";
import Header from "~/components/Header";
import {Outlet} from "react-router";


export default function Home() {
    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen bg-gray-100">
                <Header />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <footer className="bg-gray-700 text-white text-center p-4 mt-auto">
                    © {new Date().getFullYear()} My Awesome Shop
                </footer>
            </div>
        </CartProvider>
    );
}
