import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import '../stylesheets/Home.css'

function Home() {
    const navigate = useNavigate()

    return (
        <motion.div 
            className={'home-container'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className={'hero-section'}>
                <motion.h1 
                    className={'hero-title'}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    DEFY THE ORDINARY.
                </motion.h1>
                <motion.p 
                    className={'hero-subtitle'}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Premium streetwear essentials crafted for the modern edge.
                </motion.p>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <button className={'hero-btn'} onClick={() => navigate('/shop')}>
                        SHOP THE COLLECTION
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Home