import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyProfile = () => {
  const { userData, setUserData, token, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateProfile = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      if (image) formData.append('image', image)

      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { token },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
        alert('Profile updated successfully!')
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.log(error)
      alert('Something went wrong. Please try again.')
    }
  }

  return userData && (
    <div className='max-w-2xl mx-auto flex flex-col gap-4 text-base px-4 py-8'>

      {/* Profile Image */}
      <div className='flex flex-col items-center gap-2'>
        <label htmlFor='image' className={`cursor-pointer relative group`}>
          <img
            className='w-36 h-36 rounded-full object-cover border-4 border-primary'
            src={image ? URL.createObjectURL(image) : userData.image}
            alt="profile"
          />
          {isEdit && (
            <div className='absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center'>
              <p className='text-white text-xs text-center px-2'>Click to upload photo</p>
            </div>
          )}
        </label>
        {isEdit && (
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
        )}
      </div>

      {/* Name */}
      {isEdit
        ? <input
            className='bg-gray-50 text-3xl font-medium w-full border border-gray-300 rounded px-3 py-2 mt-2'
            type='text'
            value={userData.name}
            onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
          />
        : <p className='font-semibold text-3xl text-neutral-800 mt-2 text-center'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none mt-2' />

      {/* Contact Info */}
      <div className='mt-2'>
        <p className='text-neutral-500 font-semibold uppercase tracking-wide mb-3'>Contact Information</p>
        <div className='grid grid-cols-[160px_1fr] gap-y-4 text-neutral-700'>

          <p className='font-medium'>Email:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit
            ? <input
                className='bg-gray-100 border border-gray-300 rounded px-2 py-1 w-full max-w-xs'
                type='text'
                value={userData.phone}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            : <p className='text-blue-400'>{userData.phone}</p>
          }

          <p className='font-medium'>Address:</p>
          {isEdit
            ? <div className='flex flex-col gap-2'>
                <input
                  className='bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full'
                  onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                  value={userData.address.line1}
                  type="text"
                  placeholder="Address line 1"
                />
                <input
                  className='bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full'
                  onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                  value={userData.address.line2}
                  type="text"
                  placeholder="Address line 2"
                />
              </div>
            : <p className='text-gray-500'>{userData.address.line1}<br />{userData.address.line2}</p>
          }
        </div>
      </div>

      {/* Basic Info */}
      <div className='mt-2'>
        <p className='text-neutral-500 font-semibold uppercase tracking-wide mb-3'>Basic Information</p>
        <div className='grid grid-cols-[160px_1fr] gap-y-4 text-neutral-700'>

          <p className='font-medium'>Gender:</p>
          {isEdit
            ? <select
                className='bg-gray-100 border border-gray-300 rounded px-2 py-1 max-w-xs'
                onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Not Selected">Prefer not to say</option>
              </select>
            : <p className='text-gray-400'>{userData.gender}</p>
          }

          <p className='font-medium'>Date of Birth:</p>
          {isEdit
            ? <input
                className='bg-gray-100 border border-gray-300 rounded px-2 py-1 max-w-xs'
                type='date'
                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                value={userData.dob}
              />
            : <p className='text-gray-400'>{userData.dob}</p>
          }
        </div>
      </div>

      {/* Buttons */}
      <div className='mt-6 flex gap-4'>
        {isEdit
          ? <>
              <button
                onClick={updateProfile}
                className='bg-primary text-white px-8 py-2 rounded-full hover:opacity-90 transition-all'
              >
                Save Information
              </button>
              <button
                onClick={() => { setIsEdit(false); setImage(false) }}
                className='border border-gray-400 text-gray-600 px-8 py-2 rounded-full hover:bg-gray-100 transition-all'
              >
                Cancel
              </button>
            </>
          : <button
              onClick={() => setIsEdit(true)}
              className='border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
            >
              Edit Profile
            </button>
        }
      </div>

    </div>
  )
}

export default MyProfile