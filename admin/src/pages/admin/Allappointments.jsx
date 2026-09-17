import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import {
    Box, Typography, Card, Avatar, Chip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Skeleton, Tooltip
} from '@mui/material'
import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const AllAppointments = () => {
    const { aToken, backendUrl } = useContext(AdminContext)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const { toast, showToast, hideToast } = useToast()

    const getAppointments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${backendUrl}/api/admin/appointments`, {
                headers: { atoken: aToken }
            })
            const data = await res.json()
            if (data.success) setAppointments(data.appointments.reverse())
            else showToast(data.message, 'error')
        } catch (err) { showToast('Failed to load', 'error') }
        setLoading(false)
    }

    const confirmCancel = async () => {
        setShowConfirm(false)
        try {
            const res = await fetch(`${backendUrl}/api/admin/cancel-appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', atoken: aToken },
                body: JSON.stringify({ appointmentId: selectedId })
            })
            const data = await res.json()
            if (data.success) { showToast('Appointment cancelled', 'success'); getAppointments() }
            else showToast(data.message, 'error')
        } catch (err) { showToast('Something went wrong', 'error') }
    }

    useEffect(() => { if (aToken) getAppointments() }, [aToken])

    const headers = ['#', 'Patient', 'Doctor', 'Speciality', 'Date & Time', 'Fees', 'Payment', 'Status']

    return (
        <Box sx={{ p: 4 }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#1e1b4b' }}>Cancel Appointment?</DialogTitle>
                <DialogContent>
                    <Typography variant='body2' color='text.secondary'>
                        This action cannot be undone. The slot will be released for rebooking.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button onClick={() => setShowConfirm(false)} variant='outlined' sx={{ borderRadius: 50, textTransform: 'none', borderColor: '#e5e7eb', color: '#6b7280' }}>Keep It</Button>
                    <Button onClick={confirmCancel} variant='contained' color='error' sx={{ borderRadius: 50, textTransform: 'none', boxShadow: 'none' }}>Yes, Cancel</Button>
                </DialogActions>
            </Dialog>

            <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b', mb: 0.5 }}>All Appointments</Typography>
            <Typography variant='body2' sx={{ color: '#9ca3af', mb: 4 }}>Manage and monitor all patient appointments.</Typography>

            <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3, overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '0.3fr 1.5fr 1.5fr 1.2fr 1.2fr 0.8fr 0.8fr 1fr', gap: 2, px: 3, py: 2, background: '#faf5ff' }}>
                    {headers.map(h => (
                        <Typography key={h} variant='caption' sx={{ fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</Typography>
                    ))}
                </Box>

                {loading ? (
                    <Box sx={{ p: 3 }}>
                        {[1,2,3,4,5].map(i => <Skeleton key={i} variant='rounded' height={60} sx={{ mb: 1, borderRadius: 2 }} />)}
                    </Box>
                ) : appointments.length === 0 ? (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography color='text.secondary'>No appointments found</Typography>
                    </Box>
                ) : (
                    appointments.map((item, i) => (
                        <Box key={i} sx={{
                            display: 'grid',
                            gridTemplateColumns: '0.3fr 1.5fr 1.5fr 1.2fr 1.2fr 0.8fr 0.8fr 1fr',
                            gap: 2, px: 3, py: 2, alignItems: 'center',
                            borderTop: '1px solid #faf5ff',
                            '&:hover': { background: '#fdfcff' },
                            transition: 'background 0.2s'
                        }}>
                            <Typography variant='body2' color='text.secondary'>{i + 1}</Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar src={item.userData.image} sx={{ width: 34, height: 34 }} />
                                <Typography variant='body2' sx={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.8rem' }}>{item.userData.name}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar src={item.docData.image} sx={{ width: 28, height: 28 }} />
                                <Typography variant='body2' sx={{ color: '#374151', fontSize: '0.8rem' }}>{item.docData.name}</Typography>
                            </Box>

                            <Typography variant='body2' sx={{ color: '#6b7280', fontSize: '0.8rem' }}>{item.docData.speciality}</Typography>

                            <Box>
                                <Typography variant='body2' sx={{ fontWeight: 500, color: '#374151', fontSize: '0.8rem' }}>{item.slotDate.split('_').join('/')}</Typography>
                                <Typography variant='caption' color='text.secondary'>{item.slotTime}</Typography>
                            </Box>

                            <Typography variant='body2' sx={{ fontWeight: 600, color: '#7c3aed' }}>₹{item.amount}</Typography>

                            <Chip
                                label={item.payment ? 'Online' : 'Cash'}
                                size='small'
                                sx={{
                                    fontSize: '0.65rem', fontWeight: 600, width: 'fit-content',
                                    background: item.payment ? '#dbeafe' : '#f3f4f6',
                                    color: item.payment ? '#2563eb' : '#6b7280'
                                }}
                            />

                            <Box>
                                {item.cancelled
                                    ? <Chip label='Cancelled' size='small' sx={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', fontWeight: 600 }} />
                                    : item.isCompleted
                                    ? <Chip icon={<CheckCircleOutlined sx={{ fontSize: '14px !important' }} />} label='Completed' size='small' sx={{ fontSize: '0.65rem', background: '#d1fae5', color: '#059669', fontWeight: 600 }} />
                                    : <Tooltip title='Cancel appointment'>
                                        <IconButton size='small' onClick={() => { setSelectedId(item._id); setShowConfirm(true) }}
                                            sx={{ color: '#ef4444', '&:hover': { background: '#fee2e2' } }}>
                                            <CancelOutlined sx={{ fontSize: 18 }} />
                                        </IconButton>
                                      </Tooltip>
                                }
                            </Box>
                        </Box>
                    ))
                )}
            </Card>
        </Box>
    )
}

export default AllAppointments
