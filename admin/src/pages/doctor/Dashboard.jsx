import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import {
    Box, Typography, Card, CardContent, Avatar,
    Chip, IconButton, Divider, Skeleton, Button
} from '@mui/material'
import {
    AttachMoneyOutlined, CalendarMonthOutlined,
    PeopleOutlined, CheckCircleOutlined, CancelOutlined,
    MoreHorizOutlined, DoneAllOutlined
} from '@mui/icons-material'

const StatCard = ({ label, value, icon, color, bg }) => (
    <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3, flex: 1 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 2, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.cloneElement(icon, { sx: { color, fontSize: 26 } })}
            </Box>
            <Box>
                <Typography variant='h4' sx={{ fontWeight: 800, color: '#1e1b4b', lineHeight: 1 }}>{value}</Typography>
                <Typography variant='body2' sx={{ color: '#6b7280', mt: 0.5, fontWeight: 500 }}>{label}</Typography>
            </Box>
        </CardContent>
    </Card>
)

const Dashboard = () => {
    const { dToken, backendUrl } = useContext(DoctorContext)
    const [dashData, setDashData] = useState(null)

    const getDashData = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/dashboard`, { headers: { dtoken: dToken } })
            const data = await res.json()
            if (data.success) setDashData(data.dashData)
        } catch (err) { console.log(err) }
    }

    const markComplete = async (id) => {
        try {
            await fetch(`${backendUrl}/api/doctor/complete-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', dtoken: dToken },
                body: JSON.stringify({ appointmentId: id })
            })
            getDashData()
        } catch (err) { console.log(err) }
    }

    const cancelAppt = async (id) => {
        try {
            await fetch(`${backendUrl}/api/doctor/cancel-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', dtoken: dToken },
                body: JSON.stringify({ appointmentId: id })
            })
            getDashData()
        } catch (err) { console.log(err) }
    }

    useEffect(() => { if (dToken) getDashData() }, [dToken])

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b', mb: 0.5 }}>Doctor Dashboard</Typography>
            <Typography variant='body2' sx={{ color: '#9ca3af', mb: 4 }}>Your schedule and earnings at a glance.</Typography>

            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                {!dashData ? (
                    [1,2,3].map(i => <Skeleton key={i} variant='rounded' height={100} sx={{ flex: 1, borderRadius: 3 }} />)
                ) : (
                    <>
                        <StatCard label='Total Earnings' value={`₹${dashData.earnings}`} icon={<AttachMoneyOutlined />} color='#059669' bg='#d1fae5' />
                        <StatCard label='Appointments' value={dashData.appointments} icon={<CalendarMonthOutlined />} color='#7c3aed' bg='#ede9fe' />
                        <StatCard label='Patients' value={dashData.patients} icon={<PeopleOutlined />} color='#2563eb' bg='#dbeafe' />
                    </>
                )}
            </Box>

            <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3 }}>
                <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#1e1b4b' }}>Latest Appointments</Typography>
                    <IconButton size='small'><MoreHorizOutlined /></IconButton>
                </Box>
                <Divider sx={{ borderColor: '#f3f0ff' }} />

                {!dashData ? (
                    <Box sx={{ p: 3 }}>
                        {[1,2,3].map(i => <Skeleton key={i} variant='rounded' height={60} sx={{ mb: 1, borderRadius: 2 }} />)}
                    </Box>
                ) : dashData.latestAppointments.map((item, i) => (
                    <Box key={i}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2 }}>
                            <Avatar src={item.userData.image} sx={{ width: 42, height: 42 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant='body2' sx={{ fontWeight: 600, color: '#1e1b4b' }}>{item.userData.name}</Typography>
                                <Typography variant='caption' color='text.secondary'>
                                    {item.slotDate.split('_').join('/')} · {item.slotTime}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                {item.cancelled
                                    ? <Chip label='Cancelled' size='small' sx={{ background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: '0.65rem' }} />
                                    : item.isCompleted
                                    ? <Chip icon={<DoneAllOutlined sx={{ fontSize: '14px !important' }} />} label='Completed' size='small' sx={{ background: '#d1fae5', color: '#059669', fontWeight: 600, fontSize: '0.65rem' }} />
                                    : <>
                                        <IconButton size='small' onClick={() => markComplete(item._id)} sx={{ color: '#059669', '&:hover': { background: '#d1fae5' } }}>
                                            <CheckCircleOutlined sx={{ fontSize: 20 }} />
                                        </IconButton>
                                        <IconButton size='small' onClick={() => cancelAppt(item._id)} sx={{ color: '#ef4444', '&:hover': { background: '#fee2e2' } }}>
                                            <CancelOutlined sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </>
                                }
                            </Box>
                        </Box>
                        {i < dashData.latestAppointments.length - 1 && <Divider sx={{ borderColor: '#faf5ff', mx: 3 }} />}
                    </Box>
                ))}
            </Card>
        </Box>
    )
}

export default Dashboard
