import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import {
    Box, Typography, Card, CardContent, Avatar,
    Chip, IconButton, Divider, Skeleton
} from '@mui/material'
import {
    LocalHospitalOutlined, CalendarMonthOutlined,
    PeopleOutlined, CancelOutlined, CheckCircleOutlined,
    MoreHorizOutlined
} from '@mui/icons-material'

const StatCard = ({ label, value, icon, color, bg }) => (
    <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3, flex: 1 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
            <Box sx={{
                width: 56, height: 56, borderRadius: 2,
                background: bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
            }}>
                {React.cloneElement(icon, { sx: { color, fontSize: 26 } })}
            </Box>
            <Box>
                <Typography variant='h4' sx={{ fontWeight: 800, color: '#1e1b4b', lineHeight: 1 }}>
                    {value}
                </Typography>
                <Typography variant='body2' sx={{ color: '#6b7280', mt: 0.5, fontWeight: 500 }}>
                    {label}
                </Typography>
            </Box>
        </CardContent>
    </Card>
)

const Dashboard = () => {
    const { aToken, backendUrl } = useContext(AdminContext)
    const [dashData, setDashData] = useState(null)

    const getDashData = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/dashboard`, {
                headers: { atoken: aToken }
            })
            const data = await res.json()
            if (data.success) setDashData(data.dashData)
        } catch (err) { console.log(err) }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            await fetch(`${backendUrl}/api/admin/cancel-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', atoken: aToken },
                body: JSON.stringify({ appointmentId })
            })
            getDashData()
        } catch (err) { console.log(err) }
    }

    useEffect(() => { if (aToken) getDashData() }, [aToken])

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b', mb: 0.5 }}>
                Admin Dashboard
            </Typography>
            <Typography variant='body2' sx={{ color: '#9ca3af', mb: 4 }}>
                Welcome back! Here's what's happening today.
            </Typography>

            {/* Stat Cards */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                {!dashData ? (
                    [1, 2, 3].map(i => <Skeleton key={i} variant='rounded' height={100} sx={{ flex: 1, borderRadius: 3 }} />)
                ) : (
                    <>
                        <StatCard label='Total Doctors' value={dashData.doctors} icon={<LocalHospitalOutlined />} color='#7c3aed' bg='#ede9fe' />
                        <StatCard label='Total Appointments' value={dashData.appointments} icon={<CalendarMonthOutlined />} color='#2563eb' bg='#dbeafe' />
                        <StatCard label='Total Patients' value={dashData.patients} icon={<PeopleOutlined />} color='#059669' bg='#d1fae5' />
                    </>
                )}
            </Box>

            {/* Latest Appointments */}
            <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3 }}>
                <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                        Latest Appointments
                    </Typography>
                    <IconButton size='small'><MoreHorizOutlined /></IconButton>
                </Box>
                <Divider sx={{ borderColor: '#f3f0ff' }} />

                {!dashData ? (
                    <Box sx={{ p: 3 }}>
                        {[1, 2, 3].map(i => <Skeleton key={i} variant='rounded' height={60} sx={{ mb: 1, borderRadius: 2 }} />)}
                    </Box>
                ) : (
                    dashData.latestAppointments.map((item, i) => (
                        <Box key={i}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2 }}>
                                <Avatar src={item.docData.image} sx={{ width: 42, height: 42 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant='body2' sx={{ fontWeight: 600, color: '#1e1b4b' }}>
                                        {item.docData.name}
                                    </Typography>
                                    <Typography variant='caption' sx={{ color: '#9ca3af' }}>
                                        {item.slotDate.split('_').join('/')} · {item.slotTime}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                        label={item.payment ? 'Paid' : 'Unpaid'}
                                        size='small'
                                        sx={{
                                            fontSize: '0.65rem', fontWeight: 600,
                                            background: item.payment ? '#d1fae5' : '#f3f4f6',
                                            color: item.payment ? '#059669' : '#6b7280'
                                        }}
                                    />
                                    {item.cancelled
                                        ? <Chip label='Cancelled' size='small' sx={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', fontWeight: 600 }} />
                                        : item.isCompleted
                                        ? <Chip icon={<CheckCircleOutlined sx={{ fontSize: '14px !important' }} />} label='Completed' size='small' sx={{ fontSize: '0.65rem', background: '#d1fae5', color: '#059669', fontWeight: 600 }} />
                                        : <IconButton size='small' onClick={() => cancelAppointment(item._id)} sx={{ color: '#ef4444', '&:hover': { background: '#fee2e2' } }}>
                                            <CancelOutlined sx={{ fontSize: 18 }} />
                                          </IconButton>
                                    }
                                </Box>
                            </Box>
                            {i < dashData.latestAppointments.length - 1 && <Divider sx={{ borderColor: '#faf5ff', mx: 3 }} />}
                        </Box>
                    ))
                )}
            </Card>
        </Box>
    )
}

export default Dashboard
