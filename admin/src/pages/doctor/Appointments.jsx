import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const Appointments = () => {
    const { dToken, backendUrl } = useContext(DoctorContext)
    const [appointments, setAppointments] = useState([])
    const { toast, showToast, hideToast } = useToast()

    const getAppointments = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/appointments`, {
                headers: { dtoken: dToken }
            })
            const data = await res.json()
            if (data.success) setAppointments(data.appointments.reverse())
            else showToast(data.message, 'error')
        } catch (error) {
            showToast('Failed to load appointments', 'error')
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
            if (data.success) {
                showToast('Appointment marked complete', 'success')
                getAppointments()
            } else showToast(data.message, 'error')
        } catch (error) {
            showToast('Something went wrong', 'error')
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
            if (data.success) {
                showToast('Appointment cancelled', 'success')
                getAppointments()
            } else showToast(data.message, 'error')
        } catch (error) {
            showToast('Something went wrong', 'error')
        }
    }

    useEffect(() => {
        if (dToken) getAppointments()
    }, [dToken])

    return (
        <div className='p-6'>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>My Appointments</h2>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1.5fr_1.5fr_1fr_1.5fr] gap-2 px-6 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Date & Time</p>
                    <p>Payment</p>
                    <p>Fees</p>
                    <p>Actions</p>
                </div>

                <div className='divide-y divide-gray-50'>
                    {appointments.map((item, index) => (
                        <div key={index} className='flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_1.5fr_1.5fr_1fr_1.5fr] gap-2 items-start sm:items-center px-6 py-4 hover:bg-gray-50 transition-all'>
                            <p className='text-gray-400 text-sm hidden sm:block'>{index + 1}</p>

                            <div className='flex items-center gap-3'>
                                <img src={item.userData.image} className='w-9 h-9 rounded-full object-cover bg-gray-100' alt="" />
                                <div>
                                    <p className='text-sm font-medium text-gray-800'>{item.userData.name}</p>
                                    <p className='text-xs text-gray-400'>{item.userData.phone}</p>
                                </div>
                            </div>

                            <p className='text-sm text-gray-600'>
                                {item.slotDate.split('_').join('/')} <br />
                                <span className='text-xs text-gray-400'>{item.slotTime}</span>
                            </p>

                            <div>
                                {item.payment
                                    ? <span className='text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-xs font-medium'>Online</span>
                                    : <span className='text-gray-400 bg-gray-50 px-3 py-1 rounded-full text-xs font-medium'>Cash</span>
                                }
                            </div>

                            <p className='text-sm font-medium text-gray-700'>₹{item.amount}</p>

                            <div className='flex gap-2 flex-wrap'>
                                {item.cancelled
                                    ? <span className='text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-medium'>Cancelled</span>
                                    : item.isCompleted
                                    ? <span className='text-green-500 bg-green-50 px-3 py-1 rounded-full text-xs font-medium'>Completed</span>
                                    : <>
                                        <button
                                            onClick={() => completeAppointment(item._id)}
                                            className='text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-all'
                                        >
                                            Complete
                                        </button>
                                        <button
                                            onClick={() => cancelAppointment(item._id)}
                                            className='text-xs border border-red-200 text-red-400 px-3 py-1 rounded-full hover:bg-red-50 transition-all'
                                        >
                                            Cancel
                                        </button>
                                    </>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {appointments.length === 0 && (
                    <p className='text-center text-gray-400 py-16'>No appointments yet</p>
                )}
            </div>
        </div>
    )
}

export default Appointments
