import React, { useState, useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import Toast from '../components/Toast'
import useToast from '../hooks/useToast'

const Login = () => {
    const [role, setRole] = useState('admin') // 'admin' or 'doctor'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { toast, showToast, hideToast } = useToast()

    const { setAToken, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            if (role === 'admin') {
                const res = await fetch(`${backendUrl}/api/admin/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })
                const data = await res.json()
                if (data.success) {
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token)
                    showToast('Welcome, Admin!', 'success')
                } else {
                    showToast(data.message, 'error')
                }
            } else {
                const res = await fetch(`${backendUrl}/api/doctor/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })
                const data = await res.json()
                if (data.success) {
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    showToast('Welcome, Doctor!', 'success')
                } else {
                    showToast(data.message, 'error')
                }
            }
        } catch (error) {
            showToast('Something went wrong. Please try again.', 'error')
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-purple-600 text-2xl font-bold'>NOVINA MEDCARE</h1>
                    <p className='text-gray-500 text-sm mt-1'>Admin & Doctor Portal</p>
                </div>

                {/* Role Selector */}
                <div className='flex bg-gray-100 rounded-xl p-1 mb-6'>
                    <button
                        type='button'
                        onClick={() => setRole('admin')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'admin' ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Admin Login
                    </button>
                    <button
                        type='button'
                        onClick={() => setRole('doctor')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'doctor' ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Doctor Login
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Email</label>
                        <input
                            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400'
                            type='email'
                            placeholder={role === 'admin' ? 'admin@novinamedcare.com' : 'doctor@novinamedcare.com'}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium text-gray-700 block mb-1'>Password</label>
                        <input
                            className='w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-400'
                            type='password'
                            placeholder='Enter your password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 mt-2'
                    >
                        Login as {role === 'admin' ? 'Admin' : 'Doctor'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
