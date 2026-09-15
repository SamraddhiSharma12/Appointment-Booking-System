import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import { AppContext } from '../context/AppContext'
import { pictures } from '../assets/pictures/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import Toast from '../components/Toast';
import useToast from '../assets/hooks/useToast';
const Appointments = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const { toast, showToast, hideToast } = useToast()
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo)
    console.log(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({ dateTime: new Date(currentDate), time: formattedTime })
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      return navigate('/login');
    }

    if (!slotTime) {
      return showToast('Please select a time slot','warning');
    }


    try {
      const date = docSlots[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const response = await fetch('/api/user/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({ docId, slotDate, slotTime })
      });

      const data = await response.json();

      if (data.success) {
         setBookingSuccess(true)
      } else {
        showToast(data.message);
      }
    } catch (error) {
      console.log(error);
      showToast('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])

  if (bookingSuccess) {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center text-center px-4'>
      <div className='bg-white rounded-2xl shadow-xl p-10 max-w-md w-full'>
        <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <svg className='w-10 h-10 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Appointment Booked!</h2>
        <p className='text-gray-500 mb-2'>Your appointment with</p>
        <p className='text-primary font-semibold text-lg mb-1'>{docInfo.name}</p>
        <p className='text-gray-500 text-sm mb-6'>has been successfully scheduled.</p>
        <div className='bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600'>
          <p><span className='font-medium'>Speciality:</span> {docInfo.speciality}</p>
          <p className='mt-1'><span className='font-medium'>Fee:</span> {currencySymbol}{docInfo.fees}</p>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={() => navigate('/my-appointments')}
            className='flex-1 bg-primary text-white py-3 rounded-full hover:opacity-90 transition-all font-medium'
          >
            View Appointments
          </button>
          <button
            onClick={() => navigate('/')}
            className='flex-1 border border-gray-300 text-gray-600 py-3 rounded-full hover:bg-gray-50 transition-all'
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}

  return docInfo && (
    <div>
       {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80p] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={pictures.verified_icon} alt="" /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900'>About <img src={pictures.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots.map((item, index) => (
            <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
              <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
              <p>{item[0] && item[0].dateTime.getDate()}</p>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer 
            ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
          Book an appointment
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
};

export default Appointments;