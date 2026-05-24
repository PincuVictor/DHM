import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            overflow: 'hidden'
            // removed solid background so the body gradient shows through
        }}>
            {/* Glowing Orb 1 */}
            <motion.div
                animate={{
                    x: [0, 300, 0, -300, 0],
                    y: [0, 150, -150, 100, 0],
                    scale: [1, 1.3, 0.9, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '30%',
                    width: '50vw',
                    height: '50vw',
                    background: 'radial-gradient(circle, rgba(100, 108, 255, 0.6) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    transform: 'translate(-50%, -50%)'
                }}
            />

            {/* Glowing Orb 2 */}
            <motion.div
                animate={{
                    x: [0, -400, 200, -200, 0],
                    y: [0, -300, 300, -150, 0],
                    scale: [1, 1.6, 0.8, 1.4, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    position: 'absolute',
                    top: '70%',
                    left: '70%',
                    width: '45vw',
                    height: '45vw',
                    background: 'radial-gradient(circle, rgba(255, 68, 68, 0.4) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    transform: 'translate(-50%, -50%)'
                }}
            />

            {/* Glowing Orb 3 */}
            <motion.div
                animate={{
                    x: [0, 200, -300, 250, 0],
                    y: [0, -250, 200, -100, 0],
                    scale: [1, 1.2, 1.5, 0.9, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '55vw',
                    height: '55vw',
                    background: 'radial-gradient(circle, rgba(83, 91, 242, 0.5) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(90px)',
                    transform: 'translate(-50%, -50%)'
                }}
            />
        </div>
    );
};

export default BackgroundAnimation;
