import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Typography, Divider } from '@mui/material'
import {
    DashboardOutlined,
    CalendarMonthOutlined,
    PersonAddOutlined,
    GroupsOutlined,
    EventNoteOutlined,
    AccountCircleOutlined
} from '@mui/icons-material'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardOutlined sx={{ fontSize: 20 }} /> },
        { path: '/admin/appointments', label: 'Appointments', icon: <CalendarMonthOutlined sx={{ fontSize: 20 }} /> },
        { path: '/admin/add-doctor', label: 'Add Doctor', icon: <PersonAddOutlined sx={{ fontSize: 20 }} /> },
        { path: '/admin/doctors-list', label: 'Doctors List', icon: <GroupsOutlined sx={{ fontSize: 20 }} /> },
    ]

    const doctorLinks = [
        { path: '/doctor/dashboard', label: 'Dashboard', icon: <DashboardOutlined sx={{ fontSize: 20 }} /> },
        { path: '/doctor/appointments', label: 'Appointments', icon: <EventNoteOutlined sx={{ fontSize: 20 }} /> },
        { path: '/doctor/profile', label: 'My Profile', icon: <AccountCircleOutlined sx={{ fontSize: 20 }} /> },
    ]

    const links = aToken ? adminLinks : doctorLinks
    const section = aToken ? 'ADMIN PANEL' : 'DOCTOR PANEL'

    return (
        <Box sx={{
            width: 240,
            minHeight: 'calc(100vh - 64px)',
            background: '#fff',
            borderRight: '1px solid #ede9fe',
            pt: 2,
            flexShrink: 0
        }}>
            <Typography sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#a78bfa',
                letterSpacing: '1.5px',
                px: 3,
                mb: 1
            }}>
                {section}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, px: 1.5 }}>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        style={{ textDecoration: 'none' }}
                    >
                        {({ isActive }) => (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1.5,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: isActive ? '#ede9fe' : 'transparent',
                                color: isActive ? '#7c3aed' : '#6b7280',
                                borderLeft: isActive ? '4px solid #7c3aed' : '4px solid transparent',
                                '&:hover': {
                                    background: '#f5f3ff',
                                    color: '#7c3aed'
                                }
                            }}>
                                {link.icon}
                                <Typography sx={{
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 700 : 500,
                                    color: 'inherit'
                                }}>
                                    {link.label}
                                </Typography>
                            </Box>
                        )}
                    </NavLink>
                ))}
            </Box>

            <Divider sx={{ mx: 2, mt: 3, borderColor: '#ede9fe' }} />

            <Box sx={{ px: 3, mt: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#c4b5fd', letterSpacing: '0.5px' }}>
                    Novina Medcare © 2026
                </Typography>
            </Box>
        </Box>
    )
}

export default Sidebar
