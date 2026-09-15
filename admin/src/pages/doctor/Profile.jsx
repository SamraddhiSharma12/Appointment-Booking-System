import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const Profile = () => {
    const { dToken, backendUrl } = useContext(DoctorContext)
    const { toast, showToast, hideToast } = useToast()
    const [profileData, setProfileData] = useState(null)
    const [isEdit, setIsEdit] = useState(false)

    const getProfile = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/profile`, {
                headers: { dtoken: dToken }
            })
            const data = await res.json()
            if (data.success) setProfileData(data.profileData)
        } catch (error) {
            console.log(error)
        }
    }

    const updateProfile = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', dtoken: dToken },
                body: JSON.stringify({
                    fees: profileData.fees,
                    address: profileData.address,
                    available: profileData.available
                })
            })
            const data = await res.json()
            if (data.success) {
                showToast('Profile updated successfully!', 'success')
                setIsEdit(false)
                getProfile()
            } else showToast(data.message, 'error')
        } catch (error) {
            showToast('Something went wrong', 'error')
        }
    }

    useEffect(() => {
        if (dToken) getProfile()
    }, [dToken])

    if (!profileData) return (
        <div className='flex items-center justify-center h-64'>
            <p className='text-gray-400'>Loading profile...</p>
        </div>
    )

    return (
        <div className='p-6 max-w-3xl'>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>My Profile</h2>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>

                {/* Top section */}
                <div className='flex flex-col sm:flex-row gap-6 mb-8'>
                    <img src={profileData.image} className='w-32 h-32 rounded-2xl object-cover bg-indigo-50' alt="" />
                    <div>
                        <h3 className='text-2xl font-bold text-gray-800'>{profileData.name}</h3>
                        <p className='text-gray-500 mt-1'>{profileData.degree} — {profileData.speciality}</p>
                        <span className='inline-block mt-2 text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium'>{profileData.experience}</span>

                        {/* Availability toggle */}
                        <div className='flex items-center gap-3 mt-4'>
                            <div
                                onClick={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                                className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} ${profileData.available ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${profileData.available ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <span className={`text-sm font-medium ${profileData.available ? 'text-green-600' : 'text-gray-400'}`}>
                                {profileData.available ? 'Available for appointments' : 'Not available'}
                            </span>
                        </div>
                    </div>
                </div>

                <hr className='mb-6' />

                {/* About */}
                <div className='mb-6'>
                    <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2'>About</p>
                    <p className='text-gray-600 text-sm leading-relaxed'>{profileData.about}</p>
                </div>

                {/* Editable fields */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6'>
                    <div>
                        <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2'>Consultation Fees</p>
                        {isEdit
                            ? <input
                                className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400'
                                type='number'
                                value={profileData.fees}
                                onChange={e => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                            />
                            : <p className='text-gray-700 font-semibold text-lg'>₹{profileData.fees}</p>
                        }
                    </div>

                    <div>
                        <p className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2'>Address</p>
                        {isEdit
                            ? <div className='flex flex-col gap-2'>
                                <input
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-400'
                                    value={profileData.address.line1}
                                    onChange={e => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                    placeholder='Address line 1'
                                />
                                <input
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-400'
                                    value={profileData.address.line2}
                                    onChange={e => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                    placeholder='Address line 2'
                                />
                            </div>
                            : <div>
                                <p className='text-gray-600 text-sm'>{profileData.address.line1}</p>
                                <p className='text-gray-600 text-sm'>{profileData.address.line2}</p>
                            </div>
                        }
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex gap-3'>
                    {isEdit
                        ? <>
                            <button onClick={updateProfile} className='bg-purple-600 text-white px-8 py-2 rounded-full hover:bg-purple-700 transition-all font-medium'>Save Changes</button>
                            <button onClick={() => { setIsEdit(false); getProfile() }} className='border border-gray-300 text-gray-600 px-8 py-2 rounded-full hover:bg-gray-50 transition-all'>Cancel</button>
                        </>
                        : <button onClick={() => setIsEdit(true)} className='border border-purple-300 text-purple-600 px-8 py-2 rounded-full hover:bg-purple-50 transition-all'>Edit Profile</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile
