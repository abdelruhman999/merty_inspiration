import Load_search from '@/component/Load_search';
import Loaderimg from '@/component/Loaderimg';
import type { FC } from 'react';

interface AboutusProps {}

const Aboutus: FC<AboutusProps> = () => {
    return (
        <div className="font-sans bg-gray-50 min-h-screen" dir="rtl">
            <div className="max-w-4xl mx-auto py-12 px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
                    ميرتي إنسبيريشن
                </h1>
                
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                    ملابس قطنية فاخرة للراحة والأناقة
                </h2>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    مرحبًا بكم في <span className="font-semibold">ميرتي إنسبيريشن</span>، علامة تجارية مميزة تقدم ملابس قطنية عالية الجودة تجمع بين الراحة، الأناقة، والاستدامة. نحن نؤمن بقوة البساطة والرقي، ونقدم قطعًا خالدة مصنوعة من أجود أنواع القطن لمنحك شعورًا بالنعومة والتهوية والرفاهية.
                </p>
                
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        فلسفتنا
                    </h3>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li><span className="font-medium">صناعة بجودة عالية:</span> كل قطعة ملابس مصممة بعناية فائقة لضمان المتانة والراحة.</li>
                        <li><span className="font-medium">موضة مستدامة:</span> نستخدم أفضل أنواع القطن الصديق للبيئة لتقليل التأثير البيئي.</li>
                        <li><span className="font-medium">أناقة سهلة:</span> مجموعاتنا مصممة للارتداء اليومي، لتظهري بأفضل إطلالة وتشعري بالراحة.</li>
                    </ul>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        زورونا
                    </h3>
                    <p className="text-gray-700">
                        📍 <span className="font-medium">
                        ٣٦ المحور المركزي، الحي الأول، السادس من أكتوبر، محافظة الجيزة ١٢٥٧٣، مصر
                        </span>
                    </p>
                </div>
                
                <p className="mt-8 text-center text-gray-600 italic">
                    اكتشف التوازن المثالي بين الراحة والأناقة مع <span className="font-semibold">ميرتي إنسبيريشن</span> – حيث تلتقي الموضة بالاستدامة.
                </p>
            </div>
        </div>
    );
}

export default Aboutus;
