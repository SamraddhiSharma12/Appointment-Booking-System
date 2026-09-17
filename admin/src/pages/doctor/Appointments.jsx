import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import {
    Box, Typography, Card, Avatar, Chip,
    IconButton, Skeleton, Tooltip
} from '@mui/material'
import { CheckCircleOutlined, CancelOutlined, EventNoteOutlined } from '@mui/icons-material'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const Appointments = () => {
    const { dToken, backendUrl } = useContext(DoctorContext)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const { toast, showToast, hideToast } = useToast()

    const getAppointments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${backendUrl}/api/doctor/appointments`, { headers: { dtoken: dToken } })
            const data = await res.json()
            if (data.success) setAppointments(data.appointments.reverse())
            else showToast(data.message, 'error')
        } catch (err) { showToast('Failed to load', 'error') }
        setLoading(false)
    }

    const complete = async (id) => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/complete-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', dtoken: dToken },
                body: JSON.stringify({ appointmentId: id })
            })
            const data = await res.json()
            if (data.success) { showToast('Marked as completed', 'success'); getAppointments() }
        } catch (err) { showToast('Something went wrong', 'error') }
    }

    const cancel = async (id) => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/cancel-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', dtoken: dToken },
                body: JSON.stringify({ appointmentId: id })
            })
            const data = await res.json()
            if (data.success) { showToast('Appointment cancelled', 'success'); getAppointments() }
        } catch (err) { showToast('Something went wrong', 'error') }
    }

    useEffect(() => { if (dToken) getAppointments() }, [dToken])

    const headers = ['#', 'Patient', 'Date & Time', 'Payment', 'Fees', 'Actions']

    return (
        <Box sx={{ p: 4 }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <EventNoteOutlined sx={{ color: '#7c3aed', fontSize: 28 }} />
                <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b' }}>My Appointments</Typography>
            </Box>
            <Typography variant='body2' sx={{ color: '#9ca3af', mb: 4 }}>Manage your upcoming and past appointments.</Typography>

            <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '0.3fr 2fr 1.5fr 0.8fr 0.8fr 1.2fr', gap: 2, px: 3, py: 2, background: '#faf5ff' }}>
                    {headers.map(h => (
                        <Typography key={h} variant='caption' sx={{ fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</Typography>
                    ))}
                </Box>

                {loading ? (
                    <Box sx={{ p: 3 }}>
                        {[1,2,3,4].map(i => <Skeleton key={i} variant='rounded' height={64} sx={{ mb: 1, borderRadius: 2 }} />)}
                    </Box>
                ) : appointments.length === 0 ? (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography color='text.secondary'>No appointments yet</Typography>
                    </Box>
                ) : appointments.map((item, i) => (
                    <Box key={i} sx={{
                        display: 'grid',
                        gridTemplateColumns: '0.3fr 2fr 1.5fr 0.8fr 0.8fr 1.2fr',
                        gap: 2, px: 3, py: 2, alignItems: 'center',
                        borderTop: '1px solid #faf5ff',
                        '&:hover': { background: '#fdfcff' },
                        transition: 'background 0.2s'
                    }}>
                        <Typography variant='body2' color='text.secondary'>{i + 1}</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={item.userData.image} sx={{ width: 36, height: 36 }} />
                            <Box>
                                <Typography variant='body2' sx={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.82rem' }}>{item.userData.name}</Typography>
                                <Typography variant='caption' color='text.secondary'>{item.userData.phone}</Typography>
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant='body2' sx={{ fontWeight: 500, color: '#374151', fontSize: '0.82rem' }}>{item.slotDate.split('_').join('/')}</Typography>
                            <Typography variant='caption' color='text.secondary'>{item.slotTime}</Typography>
                        </Box>

                        <Chip
                            label={item.payment ? 'Online' : 'Cash'}
                            size='small'
                            sx={{
                                fontSize: '0.65rem', fontWeight: 600, width: 'fit-content',
                                background: item.payment ? '#dbeafe' : '#f3f4f6',
                                color: item.payment ? '#2563eb' : '#6b7280'
                            }}
                        />

                        <Typography variant='body2' sx={{ fontWeight: 700, color: '#7c3aed' }}>₹{item.amount}</Typography>

                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            {item.cancelled
                                ? <Chip label='Cancelled' size='small' sx={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', fontWeight: 600 }} />
                                : item.isCompleted
                                ? <Chip label='Completed' size='small' sx={{ fontSize: '0.65rem', background: '#d1fae5', color: '#059669', fontWeight: 600 }} />
                                : <>
                                    <Tooltip title='Mark as complete'>
                                        <IconButton size='small' onClick={() => complete(item._id)} sx={{ color: '#059669', '&:hover': { background: '#d1fae5' } }}>
                                            <CheckCircleOutlined sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Cancel appointment'>
                                        <IconButton size='small' onClick={() => cancel(item._id)} sx={{ color: '#ef4444', '&:hover': { background: '#fee2e2' } }}>
                                            <CancelOutlined sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            }
                        </Box>
                    </Box>
                ))}
            </Card>
        </Box>
    )
}

export default Appointments
