import React, {useEffect, useState} from 'react'
import {Link} from "react-router"
import '../stylesheets/Navbar.css'
import {ReactComponent as Logo} from "../assets/logo1.svg"
import {ReactComponent as Cart} from "../assets/shopping-cart.svg"

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
    return (
        <div className={'container'}>
            <div className={'navbar'}>
                <ul className={'navbar-items'}>
                    <Logo className={'logo'}/>
                    <AnimatedHover link={'/'} linkText={'HOME'} text={'HOME       '}/>
                    <AnimatedHover link={'/drop'} linkText={'DROP'} text={'DROP          '}/>
                    <AnimatedHover link={'/store'} linkText={'STORE'} text={'STORE       '}/>
                    <AnimatedHover link={'/account'} linkText={'ACCOUNT'} text={'ACCOUNT       '}/>
                    <Cart className={'cart'}/>
                </ul>
            </div>
        </div>

    )
}

export default Navbar