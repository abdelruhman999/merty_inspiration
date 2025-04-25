import type { FC } from 'react';

interface LoaderimgProps {}

const Loaderimg: FC<LoaderimgProps> = () => {
    return (
     
        <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </div>
    );
}

export default Loaderimg;
