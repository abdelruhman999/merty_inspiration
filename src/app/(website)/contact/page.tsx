import Load_search from '@/component/Load_search';
import type { FC } from 'react';

interface ContuctUsProps {}

const ContuctUs: FC<ContuctUsProps> = () => {
    return (
        <div className='bg-blue-600 w-full p-[50px] text-center text-4xl'>
        <Load_search/>
    </div>
    );
}

export default ContuctUs;
