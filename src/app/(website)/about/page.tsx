import Load_search from '@/component/Load_search';
import Loaderimg from '@/component/Loaderimg';
import type { FC } from 'react';

interface AboutusProps {}

const Aboutus: FC<AboutusProps> = () => {
    return (
        <div className="font-sans bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Mirty Inspiration</h1>
                
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Premium Cotton Apparel for Comfort & Style</h2>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    Welcome to <span className="font-semibold">Mirty Inspiration</span>, a premium clothing brand dedicated to crafting high-quality cotton apparel that blends comfort, style, and sustainability. We believe in the power of simplicity and elegance, offering timeless pieces made from the finest cotton materials for a soft, breathable, and luxurious feel.
                </p>
                
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Philosophy</h3>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li><span className="font-medium">Quality Craftsmanship:</span> Every garment is meticulously designed for durability and comfort.</li>
                        <li><span className="font-medium">Sustainable Fashion:</span> We use premium, eco-friendly cotton to minimize environmental impact.</li>
                        <li><span className="font-medium">Effortless Style:</span> Our collections are made for everyday wear, ensuring you look and feel your best.</li>
                    </ul>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Visit Us</h3>
                    <p className="text-gray-700">📍 <span className="font-medium">36 Al Mehwar Al Markazi, First 6th of October, Giza Governorate 12573, Egypt</span></p>
                </div>
                
                <p className="mt-8 text-center text-gray-600 italic">
                    Discover the perfect balance of comfort and sophistication with <span className="font-semibold">Mirty Inspiration</span> – where fashion meets sustainability.
                </p>
            </div>
        </div>
    );
}

export default Aboutus;
