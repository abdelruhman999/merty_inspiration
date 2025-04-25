import type { FC } from 'react';
import styles from './Robot.module.css';

interface RopotProps {}

const Ropot: FC<RopotProps> = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.modelViewPort}>
                <div className={styles.eva}>
                    <div className={styles.head}>
                        <div className={styles.eyeChamber}>
                            <div className={styles.eye}></div>
                            <div className={styles.eye}></div>
                        </div>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.hand}></div>
                        <div className={styles.hand}></div>
                        <div className={styles.scannerThing}></div>
                        <div className={styles.scannerOrigin}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ropot;