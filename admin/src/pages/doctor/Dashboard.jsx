import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {
    const { dToken, backendUrl } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)
    const [dashData, setDashData] = useState(null)

    const getDashData = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/dashboard`, {
                headers: { dtoken: dToken }
            })
            const data = await res.json()
            if (data.success) setDashData(data.dashData)
        } catch (error) {
            console.log(error)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/cancel-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', dtoken: dToken },
                body: JSON.stringify({ appointmentId })
            })
            const data = await res.json()
            if (data.success) getDashData()
        } catch (error) {
            console.log(error)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/complete-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', dtoken: dToken },
                body: JSON.stringify({ appointmentId })
            })
            const data = await res.json()
            if (data.success) getDashData()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (dToken) getDashData()
    }, [dToken])

    if (!dashData) return (
        <div className='flex items-center justify-center h-64'>
            <p className='text-gray-400'>Loading dashboard...</p>
        </div>
    )

    const stats = [
        { label: 'Total Earnings', value: `₹${dashData.earnings}`, icon: '💰', color: 'bg-green-50 text-green-600' },
        { label: 'Appointments', value: dashData.appointments, icon: '📅', color: 'bg-purple-50 text-purple-600' },
        { label: 'Patients', value: dashData.patients, icon: '🧑‍🤝‍🧑', color: 'bg-blue-50 text-blue-600' },
    ]

    return (
        <div className='p-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Doctor Dashboard</h2>

            {/* Stats */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8'>
                {stats.map((stat, i) => (
                    <div key={i} className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4'>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className='text-2xl font-bold text-gray-800'>{stat.value}</p>
                            <p className='text-sm text-gray-500'>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Latest Appointments */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
                <div className='px-6 py-4 border-b border-gray-100'>
                    <h3 className='font-semibold text-gray-800'>Latest Appointments</h3>
                </div>
                <div className='divide-y divide-gray-50'>
                    {dashData.latestAppointments.map((item, index) => (
                        <div key={index} className='flex items-center gap-4 px-6 py-4'>
                            <img src={item.userData.image} className='w-10 h-10 rounded-full object-cover bg-gray-100' alt="" />
                            <div className='flex-1 min-w-0'>
                                <p className='font-medium text-gray-800 text-sm'>{item.userData.name}</p>
                                <p className='text-xs text-gray-500'>{item.slotDate.split('_').join('/')} | {item.slotTime}</p>
                            </div>
                            <div className='flex gap-2'>
                                {item.cancelled
                                    ? <span className='text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs'>Cancelled</span>
                                    : item.isCompleted
                                    ? <span className='text-green-500 bg-green-50 px-3 py-1 rounded-full text-xs'>Completed</span>
                                    : <>
                                        <button onClick={() => completeAppointment(item._id)} className='text-green-500 text-xs border border-green-200 px-3 py-1 rounded-full hover:bg-green-50 transition-all'>Complete</button>
                                        <button onClick={() => cancelAppointment(item._id)} className='text-red-400 text-xs border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-all'>Cancel</button>
                                    </>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard
