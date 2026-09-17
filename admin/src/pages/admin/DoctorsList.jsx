import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import {
    Box, Typography, Card, CardContent, CardMedia,
    Chip, Button, Skeleton, Switch, FormControlLabel
} from '@mui/material'
import { GroupsOutlined } from '@mui/icons-material'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const DoctorsList = () => {
    const { aToken, backendUrl } = useContext(AdminContext)
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const { toast, showToast, hideToast } = useToast()

    const getDoctors = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${backendUrl}/api/admin/all-doctors`, {
                headers: { atoken: aToken }
            })
            const data = await res.json()
            if (data.success) setDoctors(data.doctors)
            else showToast(data.message, 'error')
        } catch (err) { showToast('Failed to load', 'error') }
        setLoading(false)
    }

    const toggleAvailability = async (docId) => {
        try {
            const res = await fetch(`${backendUrl}/api/admin/change-availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', atoken: aToken },
                body: JSON.stringify({ docId })
            })
            const data = await res.json()
            if (data.success) { showToast('Availability updated', 'success'); getDoctors() }
            else showToast(data.message, 'error')
        } catch (err) { showToast('Something went wrong', 'error') }
    }

    useEffect(() => { if (aToken) getDoctors() }, [aToken])

    return (
        <Box sx={{ p: 4 }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <GroupsOutlined sx={{ color: '#7c3aed', fontSize: 28 }} />
                <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b' }}>
                    Doctors List
                </Typography>
                <Chip label={`${doctors.length} doctors`} size='small' sx={{ background: '#ede9fe', color: '#7c3aed', fontWeight: 700 }} />
            </Box>
            <Typography variant='body2' sx={{ color: '#9ca3af', mb: 4 }}>
                Manage doctor availability and view their profiles.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 3 }}>
                {loading
                    ? [1,2,3,4,5,6].map(i => <Skeleton key={i} variant='rounded' height={320} sx={{ borderRadius: 3 }} />)
                    : doctors.map((doc, i) => (
                        <Card key={i} elevation={0} sx={{
                            border: '1px solid #f3f0ff', borderRadius: 3,
                            overflow: 'hidden', transition: 'all 0.2s',
                            '&:hover': { boxShadow: '0 4px 24px #ede9fe', transform: 'translateY(-2px)' }
                        }}>
                            <Box sx={{ background: '#faf5ff', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <CardMedia component='img' image={doc.image} alt={doc.name}
                                    sx={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                            </Box>
                            <CardContent sx={{ p: 2.5 }}>
                                <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#1e1b4b' }}>{doc.name}</Typography>
                                <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>{doc.speciality}</Typography>
                                <Typography variant='caption' color='text.secondary'>{doc.degree} · {doc.experience}</Typography>
                                <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant='body2' sx={{ fontWeight: 700, color: '#7c3aed' }}>₹{doc.fees}/visit</Typography>
                                    <Chip
                                        label={doc.available ? 'Available' : 'Unavailable'}
                                        size='small'
                                        sx={{
                                            fontSize: '0.65rem', fontWeight: 600,
                                            background: doc.available ? '#d1fae5' : '#f3f4f6',
                                            color: doc.available ? '#059669' : '#9ca3af'
                                        }}
                                    />
                                </Box>
                                <Button
                                    fullWidth
                                    variant='outlined'
                                    onClick={() => toggleAvailability(doc._id)}
                                    sx={{
                                        mt: 2, borderRadius: 50, textTransform: 'none',
                                        fontSize: '0.75rem', fontWeight: 600,
                                        borderColor: doc.available ? '#fca5a5' : '#a78bfa',
                                        color: doc.available ? '#ef4444' : '#7c3aed',
                                        '&:hover': {
                                            background: doc.available ? '#fee2e2' : '#ede9fe',
                                            borderColor: doc.available ? '#ef4444' : '#7c3aed'
                                        }
                                    }}
                                >
                                    {doc.available ? 'Disable' : 'Enable'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                }
            </Box>
        </Box>
    )
}

export default DoctorsList
