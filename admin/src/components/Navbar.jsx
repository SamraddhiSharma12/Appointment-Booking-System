import React, { useContext } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material'
import { LogoutOutlined } from '@mui/icons-material'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const { dToken, setDToken } = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = () => {
        if (aToken) { setAToken(''); localStorage.removeItem('aToken') }
        if (dToken) { setDToken(''); localStorage.removeItem('dToken') }
        navigate('/login')
    }

    return (
        <AppBar position='sticky' elevation={0} sx={{
            background: '#fff',
            borderBottom: '1px solid #ede9fe',
            zIndex: 1200
        }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant='h6' sx={{ fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.5px' }}>
                        NOVINA MEDCARE
                    </Typography>
                    <Chip
                        label={aToken ? 'Admin' : 'Doctor'}
                        size='small'
                        sx={{
                            background: aToken ? '#ede9fe' : '#dbeafe',
                            color: aToken ? '#7c3aed' : '#2563eb',
                            fontWeight: 700,
                            fontSize: '0.7rem'
                        }}
                    />
                </Box>
                <Button
                    onClick={logout}
                    variant='contained'
                    startIcon={<LogoutOutlined sx={{ fontSize: 16 }} />}
                    sx={{
                        background: '#7c3aed',
                        borderRadius: '50px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        boxShadow: 'none',
                        '&:hover': { background: '#6d28d9', boxShadow: 'none' }
                    }}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
