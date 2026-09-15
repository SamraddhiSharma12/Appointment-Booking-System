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

  return (
    <div className={`fixed top-5 right-5 z-50 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in`}>
      <span>{message}</span>
      <button onClick={onClose} className='text-white font-bold text-lg leading-none'>×</button>
    </div>
  )
}

export default Toast