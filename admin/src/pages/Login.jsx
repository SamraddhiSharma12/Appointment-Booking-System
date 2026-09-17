import React, { useState, useContext } from 'react'
import {
    Box, Typography, TextField, Button, Card,
    CardContent, ToggleButton, ToggleButtonGroup,
    CircularProgress, InputAdornment, IconButton
} from '@mui/material'
import { EmailOutlined, LockOutlined, Visibility, VisibilityOff, LocalHospitalOutlined } from '@mui/icons-material'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import Toast from '../components/Toast'
import useToast from '../hooks/useToast'

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover fieldset': { borderColor: '#7c3aed' },
        '&.Mui-focused fieldset': { borderColor: '#7c3aed' }
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7c3aed' }
}

const Login = () => {
    const [role, setRole] = useState('admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast, showToast, hideToast } = useToast()
    const { setAToken, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const endpoint = role === 'admin' ? '/api/admin/login' : '/api/doctor/login'
            const res = await fetch(`${backendUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (data.success) {
                if (role === 'admin') { localStorage.setItem('aToken', data.token); setAToken(data.token) }
                else { localStorage.setItem('dToken', data.token); setDToken(data.token) }
                showToast(`Welcome${role === 'admin' ? ', Admin!' : ', Doctor!'}`, 'success')
            } else showToast(data.message, 'error')
        } catch (err) { showToast('Something went wrong', 'error') }
        setLoading(false)
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2
        }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <Card elevation={0} sx={{
                borderRadius: 4, width: '100%', maxWidth: 440,
                border: '1px solid #ede9fe',
                boxShadow: '0 20px 60px rgba(124,58,237,0.1)'
            }}>
                <CardContent sx={{ p: 5 }}>
                    {/* Logo */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: 3,
                            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 2, boxShadow: '0 8px 24px rgba(124,58,237,0.3)'
                        }}>
                            <LocalHospitalOutlined sx={{ color: '#fff', fontSize: 32 }} />
                        </Box>
                        <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b' }}>
                            NOVINA MEDCARE
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                            Admin & Doctor Portal
                        </Typography>
                    </Box>

                    {/* Role Toggle */}
                    <Box sx={{ display: 'flex', background: '#f5f3ff', borderRadius: 2, p: 0.5, mb: 4 }}>
                        {['admin', 'doctor'].map(r => (
                            <Box
                                key={r}
                                onClick={() => setRole(r)}
                                sx={{
                                    flex: 1, py: 1.2, textAlign: 'center', borderRadius: 1.5,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    background: role === r ? '#7c3aed' : 'transparent',
                                    color: role === r ? '#fff' : '#9ca3af',
                                    fontWeight: 700, fontSize: '0.85rem',
                                    userSelect: 'none'
                                }}
                            >
                                {r === 'admin' ? 'Admin Login' : 'Doctor Login'}
                            </Box>
                        ))}
                    </Box>

                    {/* Form */}
                    <form onSubmit={onSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                fullWidth label='Email Address' type='email'
                                placeholder={role === 'admin' ? 'admin@novinamedcare.com' : 'doctor@novinamedcare.com'}
                                value={email} onChange={e => setEmail(e.target.value)}
                                required sx={inputSx}
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'><EmailOutlined sx={{ color: '#a78bfa', fontSize: 20 }} /></InputAdornment>
                                }}
                            />
                            <TextField
                                fullWidth label='Password' type={showPassword ? 'text' : 'password'}
                                placeholder='Enter your password'
                                value={password} onChange={e => setPassword(e.target.value)}
                                required sx={inputSx}
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'><LockOutlined sx={{ color: '#a78bfa', fontSize: 20 }} /></InputAdornment>,
                                    endAdornment: <InputAdornment position='end'>
                                        <IconButton size='small' onClick={() => setShowPassword(p => !p)} edge='end'>
                                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                }}
                            />
                            <Button
                                type='submit' variant='contained' fullWidth
                                disabled={loading}
                                sx={{
                                    py: 1.5, borderRadius: 2, textTransform: 'none',
                                    fontWeight: 700, fontSize: '0.95rem',
                                    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                                    boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                                    '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #7c3aed)', boxShadow: '0 6px 20px rgba(124,58,237,0.4)' },
                                    '&:disabled': { background: '#ddd6fe', color: '#fff', boxShadow: 'none' }
                                }}
                            >
                                {loading ? <CircularProgress size={20} color='inherit' /> : `Login as ${role === 'admin' ? 'Admin' : 'Doctor'}`}
                            </Button>
                        </Box>
                    </form>

                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
                        Novina Medcare © 2026 · All rights reserved
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}

export default Login
