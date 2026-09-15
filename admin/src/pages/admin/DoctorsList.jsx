import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const DoctorsList = () => {
    const { aToken, backendUrl } = useContext(AdminContext)
    const [doctors, setDoctors] = useState([])
    const { toast, showToast, hideToast } = useToast()

    const getDoctors = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/all-doctors`, {
                headers: { atoken: aToken }
            })
            const data = await res.json()
            if (data.success) setDoctors(data.doctors)
            else showToast(data.message, 'error')
        } catch (error) {
            showToast('Failed to load doctors', 'error')
        }
    }

    const toggleAvailability = async (docId) => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/change-availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', atoken: aToken },
                body: JSON.stringify({ docId })
            })
            const data = await res.json()
            if (data.success) {
                showToast('Availability updated', 'success')
                getDoctors()
            } else showToast(data.message, 'error')
        } catch (error) {
            showToast('Something went wrong', 'error')
        }
    }

    useEffect(() => {
        if (aToken) getDoctors()
    }, [aToken])

    return (
        <div className='p-6'>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>All Doctors ({doctors.length})</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {doctors.map((doc, index) => (
                    <div key={index} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all'>
                        <div className='bg-indigo-50 h-48 flex items-center justify-center'>
                            <img src={doc.image} className='h-full w-full object-cover' alt="" />
                        </div>
                        <div className='p-4'>
                            <p className='font-semibold text-gray-800'>{doc.name}</p>
                            <p className='text-sm text-gray-500 mt-1'>{doc.speciality}</p>
                            <p className='text-sm text-gray-400'>{doc.degree} · {doc.experience}</p>
                            <p className='text-sm font-medium text-purple-600 mt-1'>₹{doc.fees} / visit</p>

                            <div className='flex items-center justify-between mt-4'>
                                <div className='flex items-center gap-2'>
                                    <div className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <span className={`text-xs font-medium ${doc.available ? 'text-green-600' : 'text-gray-400'}`}>
                                        {doc.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleAvailability(doc._id)}
                                    className={`text-xs px-3 py-1 rounded-full border transition-all ${doc.available
                                        ? 'border-red-200 text-red-400 hover:bg-red-50'
                                        : 'border-green-200 text-green-500 hover:bg-green-50'
                                    }`}
                                >
                                    {doc.available ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {doctors.length === 0 && (
                <p className='text-center text-gray-400 py-16'>No doctors found</p>
            )}
        </div>
    )
}

export default DoctorsList
