import React from 'react'
import dna from '../assets/stethescope.png'
const Footer = () => {
  return (
    
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*--Left section--*/}
             <div className='flex items-center justify-between text-sm py-4 mb-5'> 
                    
                    <div className="flex items-center space-x-2">
                    <img className="w-12 h-12 object-cover" src={dna} alt="DNA Logo" />
                    <h1 className="text-purple-600 text-3xl font-bold">NOVINA MEDCARE</h1>
                    </div>
              </div>      
            {/*--center section--*/}
            <div>
              <p className='text-xl font-medium mb-5'>COMPANY</p>
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy policy</li>
              </ul>

            </div>
            {/*--right section--*/}
            <div>
              <p className='text-xl font-medium mb-5'>Get in touch</p>
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91-247-7772772</li>
                <li>novina@medcare.com</li>
              </ul>

            </div>
        </div>
        {/*-copyright text-*/}
        <div>
          <hr/>
          <p  className='py-5 text-sm text-center'>Cpyright 2025@ NOVINA MEDCARE - All Right Reserved.</p>

        </div>
    </div>
  )
}

export default Footer