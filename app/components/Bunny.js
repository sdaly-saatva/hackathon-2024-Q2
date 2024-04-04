'use client'
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import styles from  "../page.module.css";

import Model from './Model'

const Scene = ({onClick}) => {
    return (
        <div onClick={() => onClick()} className={styles.bunnyContainer}>
            <Canvas className={styles.canvas}>
            <pointLight position={[5, 20, 30]} />
            {/* <directionalLight color="red" position={[0, 0, 5]} /> */}
            <ambientLight intensity={1} />
                <Suspense fallback={null}>
                    <Model />
                </Suspense>
                {/* <OrbitControls /> */}
            </Canvas>
        </div>
    );
};

export default Scene;