import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from "react-router-dom"
import '../stylesheets/Navbar.css'
import {ReactComponent as Logo} from "../assets/logo1.svg"
import {ReactComponent as CartIcon} from "../assets/shopping-cart.svg"
import { useCart } from '../hooks/useCart'

const FillText = ({text, hovered}) => {
    const [fillText, setFillText] = useState("")

    useEffect(() => {
        const widthInPx = window.innerWidth * 2
        const temp = document.createElement('div')
        temp.textContent = text
        temp.style.visibility = 'hidden';
        temp.style.whiteSpace = 'pre';
        document.body.appendChild(temp);
        const textWidth = temp.offsetWidth
        document.body.removeChild(temp);
        const count = Math.floor(widthInPx / textWidth)
        console.log(textWidth)
        setFillText(text.repeat(count))
    }, [text])
    return (
        <>
            <p className={`fill-text rotate1 ${hovered ? "slide-in-left" : "slide-out-left"}`}>
                {fillText}
            </p>
            <p className={`fill-text rotate2 ${hovered ? "slide-in-top" : "slide-out-top"}`}>
                {fillText}
            </p>
            <p className={`fill-text rotate3 ${hovered ? "slide-in-right" : "slide-out-right"}`}>
                {fillText}
            </p>
        </>
    )
}

const AnimatedHover = ({link, linkText, text}) => {
    const [hovered, setHovered] = useState(false);
    return (
        <li onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            <Link to={link}>{linkText}</Link>
            <FillText text={text} hovered={hovered}/>
        </li>
    )
}

function Navbar() {
    const { cartCount } = useCart();
    const navigate = useNavigate();

    return (
        <div className={'container'}>
            <div className={'navbar'}>
                <ul className={'navbar-items'}>
                    <Logo className={'logo'} onClick={() => navigate('/')} style={{cursor: 'pointer'}}/>
                    <AnimatedHover link={'/'} linkText={'HOME'} text={'HOME       '}/>
                    <AnimatedHover link={'/drop'} linkText={'DROP'} text={'DROP          '}/>
                    <AnimatedHover link={'/shop'} linkText={'SHOP'} text={'SHOP       '}/>
                    <AnimatedHover link={'/account'} linkText={'ACCOUNT'} text={'ACCOUNT       '}/>
                    <li className="cart-container" onClick={() => navigate('/cart')} style={{cursor: 'pointer', position: 'relative'}}>
                        <CartIcon className={'cart'}/>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-10px',
                                background: '#646cff',
                                color: '#fff',
                                borderRadius: '50%',
                                padding: '2px 6px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </li>
                </ul>
            </div>
        </div>

    )
}

export default Navbar