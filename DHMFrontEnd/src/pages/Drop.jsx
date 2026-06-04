import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import '../stylesheets/Drop.css'

function getTimeRemaining(targetDate) {
    const total = Date.parse(targetDate) - Date.now()
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))
    return {total, days, hours, minutes, seconds}
}

const Countdown = ({targetDate}) => {
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate))
    useEffect(() => {
        const Interval = setInterval(() => {
            const remaining = getTimeRemaining(targetDate)
            setTimeLeft(remaining)
            if (remaining.total <= 0) {
                clearInterval(Interval)
            }
        }, 1000)
        return () => clearInterval(Interval)
    }, [targetDate]);
    return (
        <div className={'countdown'}>
            {timeLeft.days}:{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
        </div>
    )
}

function Drop() {
    const { products, loading, error } = useProducts('', null, true, 1, 50)
    const navigate = useNavigate()

    const validProducts = products?.filter(p => p.releaseDate) || []
    
    // Find the earliest release date
    let earliestDate = null;
    if (validProducts.length > 0) {
        earliestDate = validProducts.reduce((min, p) => p.releaseDate < min ? p.releaseDate : min, validProducts[0].releaseDate);
    }

    // Filter products to only show the ones matching the earliest drop
    const dropProducts = earliestDate 
        ? validProducts.filter(p => new Date(p.releaseDate).getTime() === new Date(earliestDate).getTime())
        : [];

    return (
        <motion.div 
            className={'drop-page'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={'drop-header'}>
                {earliestDate ? (
                    <>
                        <h1 className={'time'}>Time left until the next drop...</h1>
                        <Countdown targetDate={earliestDate}/>
                    </>
                ) : (
                    <h1 className={'time'}>NO UPCOMING DROPS SCHEDULED</h1>
                )}
            </div>

            <div className={'drop-products'}>
                <h2 className={'drop-subtitle'}>Upcoming Pieces</h2>
                
                {loading && <div className="loading">Loading drop items...</div>}
                {error && <div className="error">{error}</div>}

                <div className="product-grid">
                    {dropProducts.map((product) => (
                        <motion.div 
                            key={product.id} 
                            className="product-card drop-card"
                            whileHover={{ y: -5 }}
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <div className="imageContainer">
                                {product.imageUrl ? (
                                    <img 
                                        src={`${product.imageUrl}`} 
                                        alt={product.name} 
                                        className="productImage" 
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300?text=No+Image"; }}
                                    />
                                ) : (
                                    <img src="https://via.placeholder.com/300?text=No+Image" alt="Placeholder" className="productImage" />
                                )}
                            </div>
                            <div className="productInfo">
                                <h3>{product.name}</h3>
                                <p className="price">${product.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default Drop
