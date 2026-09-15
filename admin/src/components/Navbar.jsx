import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const { dToken, setDToken } = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = () => {
        if (aToken) {
            setAToken('')
            localStorage.removeItem('aToken')
        }
        if (dToken) {
            setDToken('')
            localStorage.removeItem('dToken')
        }
        navigate('/login')
    }

    return (
        <div className='flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm'>
            <div className='flex items-center gap-3'>
                <h1 className='text-purple-600 text-xl font-bold'>NOVINA MEDCARE</h1>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${aToken ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    {aToken ? 'Admin' : 'Doctor'}
                </span>
            </div>
            <button
                onClick={logout}
                className='bg-purple-600 text-white text-sm px-6 py-2 rounded-full hover:bg-purple-700 transition-all'
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar
