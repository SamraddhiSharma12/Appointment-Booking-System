import React, { useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const AddDoctor = () => {
    const { aToken, backendUrl } = useContext(AdminContext)
    const { toast, showToast, hideToast } = useToast()

    const [image, setImage] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [about, setAbout] = useState('')
    const [fees, setFees] = useState('')
    const [addressLine1, setAddressLine1] = useState('')
    const [addressLine2, setAddressLine2] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!image) return showToast('Please upload a doctor image', 'warning')

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('image', image)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('experience', experience)
            formData.append('about', about)
            formData.append('fees', fees)
            formData.append('address', JSON.stringify({ line1: addressLine1, line2: addressLine2 }))

            const res = await fetch(`${backendUrl}/api/admin/add-doctor`, {
                method: 'POST',
                headers: { atoken: aToken },
                body: formData
            })
            const data = await res.json()

            if (data.success) {
                showToast('Doctor added successfully!', 'success')
                // reset form
                setName(''); setEmail(''); setPassword('')
                setDegree(''); setAbout(''); setFees('')
                setAddressLine1(''); setAddressLine2('')
                setImage(null)
            } else {
                showToast(data.message, 'error')
            }
        } catch (error) {
            showToast('Something went wrong', 'error')
        }
        setLoading(false)
    }

    return (
        <div className='p-6'>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Add New Doctor</h2>

            <form onSubmit={onSubmitHandler} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>

                {/* Image Upload */}
                <div className='mb-6 flex items-center gap-6'>
                    <label htmlFor='doc-img' className='cursor-pointer'>
                        <div className='w-24 h-24 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center overflow-hidden bg-purple-50 hover:bg-purple-100 transition-all'>
                            {image
                                ? <img src={URL.createObjectURL(image)} className='w-full h-full object-cover' alt="" />
                                : <div className='text-center'>
                                    <p className='text-2xl'>📷</p>
                                    <p className='text-xs text-purple-400 mt-1'>Upload</p>
                                </div>
                            }
                        </div>
                    </label>
                    <input onChange={e => setImage(e.target.files[0])} type='file' id='doc-img' accept='image/*' hidden />
                    <div>
                        <p className='font-medium text-gray-700'>Doctor Photo</p>
                        <p className='text-sm text-gray-400 mt-1'>Click to upload a profile photo</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Full Name</label>
                        <input className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' type='text' placeholder='Dr. John Smith' value={name} onChange={e => setName(e.target.value)} required />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Email</label>
                        <input className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' type='email' placeholder='doctor@email.com' value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Password</label>
                        <input className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' type='password' placeholder='Min 8 characters' value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Speciality</label>
                        <select className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' value={speciality} onChange={e => setSpeciality(e.target.value)}>
                            <option value='General physician'>General Physician</option>
                            <option value='Gynecologist'>Gynecologist</option>
                            <option value='Dermatologist'>Dermatologist</option>
                            <option value='Pediatricians'>Pediatrician</option>
                            <option value='Neurologist'>Neurologist</option>
                            <option value='Gastroenterologist'>Gastroenterologist</option>
                        </select>
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Degree</label>
                        <input className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' type='text' placeholder='MBBS, MD' value={degree} onChange={e => setDegree(e.target.value)} required />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Experience</label>
                        <select className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' value={experience} onChange={e => setExperience(e.target.value)}>
                            {['1 Year','2 Years','3 Years','4 Years','5 Years','6 Years','7 Years','8 Years','9 Years','10+ Years'].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Consultation Fees (₹)</label>
                        <input className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' type='number' placeholder='500' value={fees} onChange={e => setFees(e.target.value)} required />
                    </div>

                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Address Line 1</label>
                        <input className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' type='text' placeholder='Clinic address' value={addressLine1} onChange={e => setAddressLine1(e.target.value)} required />
                    </div>

                    <div className='md:col-span-2'>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Address Line 2</label>
                        <input className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400' type='text' placeholder='City, State' value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
                    </div>

                    <div className='md:col-span-2'>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>About Doctor</label>
                        <textarea className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400 resize-none' rows={4} placeholder='Brief description about the doctor...' value={about} onChange={e => setAbout(e.target.value)} required />
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='mt-6 bg-purple-600 text-white px-10 py-3 rounded-full font-medium hover:bg-purple-700 transition-all disabled:opacity-60'
                >
                    {loading ? 'Adding Doctor...' : 'Add Doctor'}
                </button>
            </form>
        </div>
    )
}

export default AddDoctor
