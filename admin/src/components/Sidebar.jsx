import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/appointments', label: 'Appointments', icon: '📅' },
        { path: '/admin/add-doctor', label: 'Add Doctor', icon: '➕' },
        { path: '/admin/doctors-list', label: 'Doctors List', icon: '👨‍⚕️' },
    ]

    const doctorLinks = [
        { path: '/doctor/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/doctor/appointments', label: 'Appointments', icon: '📅' },
        { path: '/doctor/profile', label: 'My Profile', icon: '👤' },
    ]

    const links = aToken ? adminLinks : doctorLinks

    return (
        <div className='min-h-screen w-60 bg-white border-r border-gray-200 flex flex-col'>
            <div className='mt-6 flex flex-col gap-1 px-3'>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                            ${isActive
                                ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <span className='text-lg'>{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
