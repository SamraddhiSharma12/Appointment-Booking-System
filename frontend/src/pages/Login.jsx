import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Toast from '../components/Toast'
import useToast from '../assets/hooks/useToast'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const navigate = useNavigate()
  const { setToken } = useContext(AppContext)
  const { toast, showToast, hideToast } = useToast()

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    // password check FIRST before any fetch
    if (state === 'Sign Up' && password.length < 8) {
      return showToast('Password must be at least 8 characters', 'warning')
    }

    try {
      if (state === 'Sign Up') {
        const response = await fetch('/api/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })
        const data = await response.json()

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          navigate('/')
        } else {
          showToast(data.message, 'error')
        }

      } else {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await response.json()

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          navigate('/')
        } else {
          showToast(data.message, 'error')
        }
      }
    } catch (error) {
      console.log(error)
      showToast('Something went wrong. Please try again.', 'error')
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
          <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
          <p>Please {state === 'Sign Up' ? "sign up" : "login"} to book appointment</p>

          {state === "Sign Up" &&
            <div className='w-full'>
              <p>Full Name</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
            </div>
          }

          <div className='w-full'>
            <p>Email</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
          </div>

          <div className='w-full'>
            <p>Password</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
            {state === 'Sign Up' && <p className='text-xs text-gray-400 mt-1'>Must be at least 8 characters</p>}
          </div>

          <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>
            {state === 'Sign Up' ? "Create Account" : "Login"}
          </button>
          
          {state === "Sign Up"
            ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
            : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
          }
        </div>
      </form>
    </div>
  )
}

export default Login