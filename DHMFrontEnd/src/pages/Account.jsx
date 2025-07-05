import React, {useContext, useEffect, useState} from 'react'
import '../stylesheets/Account.css'
import {Link} from "react-router"
import AuthContext from "../components/AuthContext.jsx"
import {FaEdit, FaTrash} from "react-icons/fa"


function Account() {
    const [isEditing, setIsEditing] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [active, setActive] = useState(true)
    const [info, setInfo] = useState(false)
    const [orders, setOrders] = useState(false)
    const [shipping, setShipping] = useState(false)
    const [shippingAddress, setShippingAddress] = useState([{
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: ''}])
    const [shippingAddressNew, setShippingAddressNew] = useState([{
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: ''}])
    const [contact, setContact] = useState(false)
    const {logoutUser} = useContext(AuthContext)
    const [error, setError] = useState('')
    const [credentials, setCredentials] = useState({
        email: '',
        first_name: '',
        last_name: ''})

    const handleSubmitAddress = async (e) => {
        e.preventDefault()
        const token = JSON.parse(localStorage.getItem('authTokens'))
        if (!token) return
        const method = isEditing ? 'PUT' : 'POST'
        const url = isEditing ? `http://localhost:8000/api/shipping/${editAddressId}/` : 'http://localhost:8000/api/shipping/'
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`,
            },
            body: JSON.stringify(shippingAddressNew)
        })
            .then((res) => res.json())
            .then(() => {
                setIsEditing(false)
                setEditAddressId(null)
                setShippingAddressNew(([{
                    address_line1: '',
                    address_line2: '',
                    city: '',
                    postal_code: '',
                    country: ''}]))
                fetchShipping()
                setActive(true)
            })
            .catch((err) => console.error('Error submitting shipping addresses:', err))
    }

    const handleDeleteAddress = async (id) => {
        const token = JSON.parse(localStorage.getItem('authTokens'));
        if (!token) return;

        if (!window.confirm("Are you sure you want to delete this address?")) return;

        fetch(`http://localhost:8000/api/shipping/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token.access}`,
            },
        })
            .then((res) => {
                if (res.ok) {
                    fetchShipping();
                    setActive(true);
                } else {
                    throw new Error("Failed to delete address");
                }
            })
            .catch((err) => {
                console.error("Delete failed:", err);
                alert("Failed to delete address.");
            });
    }

    const handleSubmitLogout = async (e) => {
        e.preventDefault()
        const success = await logoutUser()
        if (!success) {
            setError('Failed to logout')
            console.log(error)
        }
    }

    const fetchCredentials = () => {
        const token = JSON.parse(localStorage.getItem('authTokens'))
        if (!token) return

        fetch('http://localhost:8000/api/credentials/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCredentials(data)
            })
            .catch((err) => console.error('Error fetching credentials:', err))
    }

    const fetchShipping = () => {
        const token = JSON.parse(localStorage.getItem('authTokens'))
        if (!token) return

        fetch('http://localhost:8000/api/shipping/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setShippingAddress(data)
            })
            .catch((err) => console.error('Error fetching shipping addresses:', err))
    }

    useEffect(() => {
        fetchCredentials()
        fetchShipping()
    }, [])

    return (
        <div className={'account'}>
            <div className={'barAccount'}>
                <ul className={'barAccount-items'}>
                    <li>
                        <Link to={'#'} onClick={() => {setInfo(true)
                            setOrders(false)
                            setShipping(false)
                            setContact(false)}}>
                            INFO
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} onClick={() => {setOrders(true)
                            setInfo(false)
                            setShipping(false)
                            setContact(false)}}>
                            ORDERS
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} onClick={() => {setShipping(true)
                            setInfo(false)
                            setOrders(false)
                            setContact(false)}}>
                            SHIPPING
                        </Link>
                    </li>
                    <li>
                        <Link to={'#'} onClick={() => {setContact(true)
                            setInfo(false)
                            setOrders(false)
                            setShipping(false)}}>
                            CONTACT
                        </Link>
                    </li>
                </ul>
            </div>
            <div className={'contentContainerAccount'}>
                <div className={'heading'}> ACCOUNT </div>
                {JSON.parse(localStorage.getItem("authTokens")) ?
                    <>
                    <div className={'contentAccount'}>
                        {info && <div>
                            <div>EMAIL: {credentials.email}</div>
                            <div>FULL NAME: {credentials.first_name + ' ' + credentials.last_name}</div>
                        </div>}
                        {orders && <div>ORDERS</div>}
                        {shipping &&
                            <div className={'shippingAddress'}>
                                {active &&
                                <ul className={'shippingAddressItems'}>
                                    {shippingAddress.map((address, index) => (

                                        <li key={index}>
                                            <p>SHIPPING ADDRESS {index + 1}
                                                <FaEdit onClick={() => {
                                                    const selected = shippingAddress[index]
                                                    setShippingAddressNew(selected)
                                                    setEditAddressId(selected.id)
                                                    setIsEditing(true)
                                                    setActive(false)
                                                }}/>
                                                <FaTrash onClick={() => handleDeleteAddress(shippingAddress[index].id)}
                                                         style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}/>
                                            </p>
                                            {address.address_line1}, {address.postal_code}, {address.city}, {address.country}
                                        </li>
                                    ))}
                                </ul>}
                                {!active &&
                                <form className={'shippingAddressForm'} onSubmit={handleSubmitAddress}>
                                    <input
                                        id="address_line1"
                                        type="text"
                                        placeholder="Address Line 1"
                                        value={shippingAddressNew.address_line1}
                                        onChange={e => {setShippingAddressNew({
                                            ...shippingAddressNew,
                                            address_line1: e.target.value
                                        })}}
                                        required
                                    />
                                    <input
                                        id="address_line2"
                                        type="text"
                                        placeholder="Address Line 2"
                                        value={shippingAddressNew.address_line2}
                                        onChange={e => {setShippingAddressNew({
                                            ...shippingAddressNew,
                                            address_line2: e.target.value
                                        })}}
                                    />
                                    <input
                                    id="postal_code"
                                    type="text"
                                    placeholder="Postal Code"
                                    value={shippingAddressNew.postal_code}
                                    onChange={e => {setShippingAddressNew({
                                        ...shippingAddressNew,
                                        postal_code: e.target.value
                                    })}}
                                    required
                                    />
                                    <input
                                        id="city"
                                        type="text"
                                        placeholder="City"
                                        value={shippingAddressNew.city}
                                        onChange={e => {setShippingAddressNew({
                                            ...shippingAddressNew,
                                            city: e.target.value
                                        })}}
                                        required
                                    />
                                    <input
                                        id="country"
                                        type="text"
                                        placeholder="Country"
                                        value={shippingAddressNew.country}
                                        onChange={e => {setShippingAddressNew({
                                            ...shippingAddressNew,
                                            country: e.target.value
                                        })}}
                                        required
                                    />
                                    <button type="submit">SUBMIT</button>
                                    {isEditing && (
                                        <button type="button" onClick={() => {
                                            setIsEditing(false);
                                            setEditAddressId(null);
                                            setShippingAddressNew({
                                                address_line1: '',
                                                address_line2: '',
                                                city: '',
                                                postal_code: '',
                                                country: ''
                                            });
                                            setActive(true);
                                        }}>
                                            CANCEL EDIT
                                        </button>
                                    )}
                                </form>}
                                {shippingAddress.length < 5 && !isEditing && (
                                    <button onClick={() => {setActive(!active)}}>
                                        {active ? 'ADD SHIPPING ADDRESS' : 'BACK'}
                                    </button>
                                )}
                            </div>}
                        {contact && <div>FOR ANY PROBLEMS OR INQUIRIES EMAIL dhm.clothing.official@gmail.com</div>}
                    </div>
                    <div  className={'logoutButton'} ><button onClick={handleSubmitLogout}>LOGOUT</button></div>
                    </> :
                    <div className={'loginLink'}>You are currently not logged in:<Link to={'/login'}>LOGIN</Link></div>}
            </div>
        </div>
    )
}

export default Account