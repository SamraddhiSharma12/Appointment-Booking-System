import { useContext, useState } from 'react';
import dna from '../assets/stethescope.png'
import { pictures } from '../assets/pictures/assets_frontend/assets.js';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/login')
    setShowMenu(false)
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 relative'>
      
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img onClick={() => navigate('/')} className="w-10 h-10 object-cover cursor-pointer" src={dna} alt="Logo" />
        <h1 className="text-purple-600 text-xl md:text-3xl font-bold">NOVINA MEDCARE</h1>
      </div>

      {/* Desktop Nav */}
      <ul className='hidden md:flex items-center gap-5 font-medium'>
        <NavLink to='/' className={({isActive}) => isActive ? 'text-primary' : ''}><li className='py-1'>HOME</li></NavLink>
        <NavLink to='/doctors' className={({isActive}) => isActive ? 'text-primary' : ''}><li className='py-1'>ALL DOCTORS</li></NavLink>
        <NavLink to='/about' className={({isActive}) => isActive ? 'text-primary' : ''}><li className='py-1'>ABOUT</li></NavLink>
        <NavLink to='/contact' className={({isActive}) => isActive ? 'text-primary' : ''}><li className='py-1'>CONTACT</li></NavLink>
      </ul>

      {/* Right side */}
      <div className='flex items-center gap-4'>
        {token
          ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 h-8 rounded-full object-cover' src={userData ? userData.image : pictures.profile_pic} alt="profile" />
              <img className='w-2.5' src={pictures.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                  {location.pathname !== '/my-profile' && (
                    <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  )}
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
          : <button onClick={() => navigate('/login')} className='bg-primary text-white px-6 py-2 rounded-full font-light hidden md:block text-sm'>Create Account</button>
        }

        {/* Hamburger */}
        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={pictures.menu_icon}
          alt="menu"
        />
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 bg-white transition-all duration-300 ${showMenu ? 'w-72 shadow-2xl' : 'w-0 overflow-hidden'}`}>
        <div className='flex items-center justify-between px-5 py-5 border-b'>
          <div className="flex items-center space-x-2">
            <img className="w-8 h-8 object-cover" src={dna} alt="Logo" />
            <h1 className="text-purple-600 text-lg font-bold">NOVINA MEDCARE</h1>
          </div>
          <img className='w-6 cursor-pointer' onClick={() => setShowMenu(false)} src={pictures.cross_icon} alt="close" />
        </div>

        <ul className='flex flex-col gap-2 mt-4 px-5 text-base font-medium text-gray-700'>
          <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-3 rounded hover:bg-gray-50'>HOME</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-3 rounded hover:bg-gray-50'>ALL DOCTORS</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-3 rounded hover:bg-gray-50'>ABOUT</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-3 rounded hover:bg-gray-50'>CONTACT</p></NavLink>
        </ul>

        <div className='px-5 mt-6'>
          {token
            ? <div className='flex flex-col gap-3'>
                {location.pathname !== '/my-profile' && (
                  <p onClick={() => { navigate('/my-profile'); setShowMenu(false) }} className='px-4 py-3 rounded hover:bg-gray-50 cursor-pointer text-gray-700'>My Profile</p>
                )}
                <p onClick={() => { navigate('/my-appointments'); setShowMenu(false) }} className='px-4 py-3 rounded hover:bg-gray-50 cursor-pointer text-gray-700'>My Appointments</p>
                <p onClick={logout} className='px-4 py-3 rounded hover:bg-gray-50 cursor-pointer text-red-500'>Logout</p>
              </div>
            : <button onClick={() => { navigate('/login'); setShowMenu(false) }} className='w-full bg-primary text-white py-3 rounded-full font-light'>Create Account</button>
          }
        </div>
      </div>

      {/* Overlay */}
      {showMenu && <div onClick={() => setShowMenu(false)} className='fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden' />}
    </div>
  )
}

export default Navbar