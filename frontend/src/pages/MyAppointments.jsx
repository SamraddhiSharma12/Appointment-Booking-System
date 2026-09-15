import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import Toast from '../components/Toast'
import useToast from '../assets/hooks/useToast'

const MyAppointments = () => {
  const { token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const { toast, showToast, hideToast } = useToast()

  const getAppointments = async () => {
    try {
      const response = await fetch('/api/user/appointments', {
        headers: { token }
      })
      const data = await response.json()
      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        showToast(data.message, 'error')
      }
    } catch (error) {
      showToast('Failed to load appointments', 'error')
    }
  }

  const handleCancelClick = (appointmentId) => {
    setSelectedId(appointmentId)
    setShowConfirm(true)
  }

  const confirmCancel = async () => {
    setShowConfirm(false)
    try {
      const response = await fetch('/api/user/cancel-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ appointmentId: selectedId })
      })
      const data = await response.json()
      if (data.success) {
        showToast('Appointment cancelled successfully', 'success')
        getAppointments()
      } else {
        showToast(data.message, 'error')
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error')
    }
  }

  useEffect(() => {
    if (token) getAppointments()
  }, [token])

  //payments
  const initPay = (order, appointmentId) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Novina Medcare',
    description: 'Appointment Payment',
    order_id: order.id,
    receipt: order.receipt,
    handler: async (response) => {
      try {
        const verifyRes = await fetch('/api/user/verify-razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', token },
          body: JSON.stringify(response)
        })
        const verifyData = await verifyRes.json()
        if (verifyData.success) {
          showToast('Payment successful!', 'success')
          getAppointments()
        } else {
          showToast('Payment verification failed', 'error')
        }
      } catch (error) {
        showToast('Something went wrong', 'error')
      }
    }
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}

const handlePayment = async (appointmentId, amount) => {
  try {
    const response = await fetch('/api/user/pay-razorpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token },
      body: JSON.stringify({ appointmentId })
    })
    const data = await response.json()
    if (data.success) {
      initPay(data.order, appointmentId)
    } else {
      showToast(data.message, 'error')
    }
  } catch (error) {
    showToast('Payment initiation failed', 'error')
  }
}
  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Confirm Cancel Modal */}
      {showConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center'>
          <div className='bg-white rounded-xl p-8 shadow-xl max-w-sm w-full mx-4'>
            <p className='text-lg font-semibold text-gray-800 mb-2'>Cancel Appointment?</p>
            <p className='text-gray-500 text-sm mb-6'>Are you sure you want to cancel this appointment? This action cannot be undone.</p>
            <div className='flex gap-3'>
              <button
                onClick={confirmCancel}
                className='flex-1 bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition-all'
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className='flex-1 border border-gray-300 text-gray-600 py-2 rounded-full hover:bg-gray-50 transition-all'
              >
                Keep It
              </button>
            </div>
          </div>
        </div>
      )}

      <p className='pb-3 mt-4 font-semibold text-xl text-zinc-700 border-b'>My Appointments</p>

      {appointments.length === 0
        ? <p className='text-center text-gray-400 mt-16 text-lg'>No appointments found</p>
        : <div className='mt-4'>
            {appointments.map((item, index) => (
              <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b' key={index}>

                <div>
                  <img className='w-32 h-32 object-cover bg-indigo-50 rounded-lg' src={item.docData.image} alt="" />
                </div>

                <div className='flex-1 text-sm text-zinc-600'>
                  <p className='text-neutral-800 font-semibold text-base'>{item.docData.name}</p>
                  <p className='text-primary'>{item.docData.speciality}</p>
                  <p className='text-zinc-700 font-medium mt-1'>Address</p>
                  <p className='text-xs'>{item.docData.address.line1}</p>
                  <p className='text-xs'>{item.docData.address.line2}</p>
                  <p className='text-xs mt-2'>
                    <span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>
                    {item.slotDate.split('_').join(' / ')} | {item.slotTime}
                  </p>
                </div>

                <div className='flex flex-col gap-2 justify-end'>
                  {item.cancelled
                    ? <p className='text-red-500 text-sm text-center border border-red-300 rounded py-2 sm:min-w-48'>Appointment Cancelled</p>
                    : item.isCompleted
                    ? <p className='text-green-500 text-sm text-center border border-green-300 rounded py-2 sm:min-w-48'>Completed</p>
                    : <>
  {item.payment
  ? <p className='text-green-500 text-sm text-center border border-green-300 rounded py-2 sm:min-w-48'>Payment Done</p>
  : <button
      onClick={() => handlePayment(item._id, item.amount)}                        className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                          Pay Online
                        </button>
                        }                      <button
                          onClick={() => handleCancelClick(item._id)}
                          className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300'
                        >
                          Cancel Appointment
                        </button>
                      </>
                  }
                </div>

              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default MyAppointments