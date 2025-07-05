import React, {useEffect, useState} from 'react'
import '../stylesheets/Home.css'

function getTimeRemaining(targetDate) {
    const total = Date.parse(targetDate) - Date.now()
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))
    return { total, days, hours, minutes, seconds }
}

const Countdown = ({targetDate}) => {
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate))
    useEffect(() => {
        const Interval = setInterval(() => {
            const remaining = getTimeRemaining(targetDate)
            setTimeLeft(remaining)
            if( remaining.total <= 0 ) {
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


function Home() {
    return (
        <div className={'home'}>
            <div className={'mainHome'}>Welcome to the home of DHM</div>
            <div className={'time'}>Time left until the next drop...</div>
            <Countdown targetDate={'2025-08-29T00:00:00.000+03:00'}/>
        </div>
    )
}

export default Home