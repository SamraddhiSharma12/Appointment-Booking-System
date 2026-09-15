import React, { useEffect } from 'react'

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    }

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }

    return (
        <div className={`fixed top-5 right-5 z-50 ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-64`}>
            <span className='text-lg font-bold'>{icons[type]}</span>
            <span className='flex-1 text-sm font-medium'>{message}</span>
            <button onClick={onClose} className='text-white font-bold text-lg leading-none hover:opacity-70'>×</button>
        </div>
    )
}

export default Toast
