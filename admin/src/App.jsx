import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

import Login from './pages/Login'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'

// Doctor pages
import DoctorDashboard from './pages/Doctor/Dashboard'
import DoctorAppointments from './pages/Doctor/Appointments'
import DoctorProfile from './pages/Doctor/Profile'

const App = () => {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    const isLoggedIn = aToken || dToken

    if (!isLoggedIn) {
        return <Login />
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='flex'>
                <Sidebar />
                <div className='flex-1 overflow-auto'>
                    <Routes>
                        {/* Admin routes */}
                        {aToken && <>
                            <Route path='/admin/dashboard' element={<AdminDashboard />} />
                            <Route path='/admin/appointments' element={<AllAppointments />} />
                            <Route path='/admin/add-doctor' element={<AddDoctor />} />
                            <Route path='/admin/doctors-list' element={<DoctorsList />} />
                            <Route path='*' element={<Navigate to='/admin/dashboard' />} />
                        </>}

                        {/* Doctor routes */}
                        {dToken && <>
                            <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
                            <Route path='/doctor/appointments' element={<DoctorAppointments />} />
                            <Route path='/doctor/profile' element={<DoctorProfile />} />
                            <Route path='*' element={<Navigate to='/doctor/dashboard' />} />
                        </>}
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default App
