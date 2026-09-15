import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const AllAppointments = () => {
    const { aToken, backendUrl } = useContext(AdminContext)
    const [appointments, setAppointments] = useState([])
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const { toast, showToast, hideToast } = useToast()

    const getAppointments = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/appointments`, {
                headers: { atoken: aToken }
            })
            const data = await res.json()
            if (data.success) setAppointments(data.appointments.reverse())
            else showToast(data.message, 'error')
        } catch (error) {
            showToast('Failed to load appointments', 'error')
        }
    }

    const handleCancelClick = (id) => {
        setSelectedId(id)
        setShowConfirm(true)
    }

    const confirmCancel = async () => {
        setShowConfirm(false)
        try {
            const res = await fetch(`${backendUrl}/api/admin/cancel-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', atoken: aToken },
                body: JSON.stringify({ appointmentId: selectedId })
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
        if (aToken) getAppointments()
    }, [aToken])

    return (
        <div className='p-6'>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            {/* Confirm Modal */}
            {showConfirm && (
                <div className='fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center'>
                    <div className='bg-white rounded-xl p-8 shadow-xl max-w-sm w-full mx-4'>
                        <p className='text-lg font-semibold text-gray-800 mb-2'>Cancel Appointment?</p>
                        <p className='text-gray-500 text-sm mb-6'>This action cannot be undone.</p>
                        <div className='flex gap-3'>
                            <button onClick={confirmCancel} className='flex-1 bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition-all'>Yes, Cancel</button>
                            <button onClick={() => setShowConfirm(false)} className='flex-1 border border-gray-300 text-gray-600 py-2 rounded-full hover:bg-gray-50 transition-all'>Keep It</button>
                        </div>
                    </div>
                </div>
            )}

            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>All Appointments</h2>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                {/* Table Header */}
                <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1.5fr_1.5fr_1.5fr_1fr_1fr] gap-2 px-6 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Doctor</p>
                    <p>Speciality</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Status</p>
                </div>

                <div className='divide-y divide-gray-50'>
                    {appointments.map((item, index) => (
                        <div key={index} className='flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_1.5fr_1.5fr_1.5fr_1fr_1fr] gap-2 items-start sm:items-center px-6 py-4 hover:bg-gray-50 transition-all'>
                            <p className='text-gray-400 text-sm hidden sm:block'>{index + 1}</p>

                            <div className='flex items-center gap-3'>
                                <img src={item.userData.image} className='w-8 h-8 rounded-full object-cover bg-gray-100' alt="" />
                                <p className='text-sm font-medium text-gray-800'>{item.userData.name}</p>
                            </div>

                            <div className='flex items-center gap-2'>
                                <img src={item.docData.image} className='w-8 h-8 rounded-full object-cover bg-gray-100 hidden sm:block' alt="" />
                                <p className='text-sm text-gray-600'>{item.docData.name}</p>
                            </div>

                            <p className='text-sm text-gray-500'>{item.docData.speciality}</p>

                            <p className='text-sm text-gray-600'>
                                {item.slotDate.split('_').join('/')} | {item.slotTime}
                            </p>

                            <p className='text-sm font-medium text-gray-700'>₹{item.amount}</p>

                            <div>
                                {item.cancelled
                                    ? <span className='text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-medium'>Cancelled</span>
                                    : item.isCompleted
                                    ? <span className='text-green-500 bg-green-50 px-3 py-1 rounded-full text-xs font-medium'>Completed</span>
                                    : item.payment
                                    ? <div className='flex flex-col gap-1'>
                                        <span className='text-blue-500 bg-blue-50 px-3 py-1 rounded-full text-xs font-medium'>Paid</span>
                                        <button onClick={() => handleCancelClick(item._id)} className='text-red-400 text-xs hover:text-red-600'>Cancel</button>
                                      </div>
                                    : <button
                                        onClick={() => handleCancelClick(item._id)}
                                        className='text-xs border border-red-200 text-red-400 px-3 py-1 rounded-full hover:bg-red-50 hover:text-red-600 transition-all'
                                    >
                                        Cancel
                                    </button>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {appointments.length === 0 && (
                    <p className='text-center text-gray-400 py-16'>No appointments found</p>
                )}
            </div>
        </div>
    )
}

export default AllAppointments
