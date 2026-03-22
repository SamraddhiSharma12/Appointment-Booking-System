import React from 'react'
import { specialityData } from '../assets/pictures/assets_frontend/assets'
import { Link } from 'react-router-dom'
const Speciality = () => {
  return (
    //when clicked on book appointment button it should scroll us to speciality section
    //this id we have already assigned to the button in header.jsx
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id="speciality"> 
        <h1 className='text-3xl font-medium'>Find by Speciality</h1>
        <p className='sm:w-1/3 text-center text-sm'>Simply browse through are expensive list of trusted doctors, schedule your appointment hassle-free.</p>
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'> {/*need to hide this scroll bar */}
            
            {/* when scrolling over speciality section this js  (scrollTo) fn will take us to all doctors sect upwards */}
            
            {specialityData.map((item, index)=>
            
            <Link onClick={()=>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${item.speciality}`}>
                <img className='w-16 sm:w-24 mb-2' src={item.image} alt=""/>
                <p>{item.speciality}</p>

            </Link>
            )}

        </div>
    </div>
  )
}

export default Speciality