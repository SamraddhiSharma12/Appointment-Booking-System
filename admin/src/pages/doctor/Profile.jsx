import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import {
    Box, Typography, Card, CardContent, Avatar,
    Chip, TextField, Button, Switch, FormControlLabel,
    Divider, Skeleton, Grid
} from '@mui/material'
import { EditOutlined, SaveOutlined, CloseOutlined, AccountCircleOutlined } from '@mui/icons-material'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover fieldset': { borderColor: '#7c3aed' },
        '&.Mui-focused fieldset': { borderColor: '#7c3aed' }
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7c3aed' }
}

const Profile = () => {
    const { dToken, backendUrl } = useContext(DoctorContext)
    const { toast, showToast, hideToast } = useToast()
    const [profileData, setProfileData] = useState(null)
    const [isEdit, setIsEdit] = useState(false)

    const getProfile = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/profile`, { headers: { dtoken: dToken } })
            const data = await res.json()
            if (data.success) setProfileData(data.profileData)
        } catch (err) { console.log(err) }
    }

    const updateProfile = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/doctor/update-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', dtoken: dToken },
                body: JSON.stringify({ fees: profileData.fees, address: profileData.address, available: profileData.available })
            })
            const data = await res.json()
            if (data.success) { showToast('Profile updated!', 'success'); setIsEdit(false); getProfile() }
            else showToast(data.message, 'error')
        } catch (err) { showToast('Something went wrong', 'error') }
    }

    useEffect(() => { if (dToken) getProfile() }, [dToken])

    if (!profileData) return (
        <Box sx={{ p: 4 }}>
            <Skeleton variant='rounded' height={200} sx={{ borderRadius: 3, mb: 3 }} />
            <Skeleton variant='rounded' height={300} sx={{ borderRadius: 3 }} />
        </Box>
    )

    return (
        <Box sx={{ p: 4, maxWidth: 800 }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <AccountCircleOutlined sx={{ color: '#7c3aed', fontSize: 28 }} />
                <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b' }}>My Profile</Typography>
            </Box>
            <Typography variant='body2' sx={{ color: '#9ca3af', mb: 4 }}>View and update your profile information.</Typography>

            {/* Top Card */}
            <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar src={profileData.image} sx={{ width: 88, height: 88, border: '3px solid #ede9fe' }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b' }}>{profileData.name}</Typography>
                            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                                {profileData.degree} — {profileData.speciality}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                <Chip label={profileData.experience} size='small' sx={{ background: '#ede9fe', color: '#7c3aed', fontWeight: 600 }} />
                                <Chip
                                    label={profileData.available ? 'Available' : 'Unavailable'}
                                    size='small'
                                    sx={{
                                        background: profileData.available ? '#d1fae5' : '#f3f4f6',
                                        color: profileData.available ? '#059669' : '#9ca3af',
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                        </Box>
                        <Button
                            onClick={() => isEdit ? (setIsEdit(false), getProfile()) : setIsEdit(true)}
                            variant={isEdit ? 'outlined' : 'contained'}
                            startIcon={isEdit ? <CloseOutlined /> : <EditOutlined />}
                            sx={{
                                borderRadius: 50, textTransform: 'none', fontWeight: 600,
                                boxShadow: 'none',
                                ...(isEdit ? {
                                    borderColor: '#e5e7eb', color: '#6b7280',
                                    '&:hover': { background: '#f9fafb', borderColor: '#d1d5db' }
                                } : {
                                    background: '#7c3aed',
                                    '&:hover': { background: '#6d28d9', boxShadow: 'none' }
                                })
                            }}
                        >
                            {isEdit ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* About */}
            <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', mb: 1.5 }}>About</Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.8 }}>{profileData.about}</Typography>
                </CardContent>
            </Card>

            {/* Editable Fields */}
            <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', mb: 3 }}>Practice Details</Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant='caption' sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consultation Fees</Typography>
                            {isEdit
                                ? <TextField fullWidth type='number' value={profileData.fees}
                                    onChange={e => setProfileData(p => ({ ...p, fees: e.target.value }))}
                                    sx={{ ...inputSx, mt: 1 }} size='small' />
                                : <Typography variant='h6' sx={{ fontWeight: 800, color: '#7c3aed', mt: 0.5 }}>₹{profileData.fees}</Typography>
                            }
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant='caption' sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Availability</Typography>
                            <Box sx={{ mt: 0.5 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={profileData.available}
                                            onChange={e => isEdit && setProfileData(p => ({ ...p, available: e.target.checked }))}
                                            disabled={!isEdit}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c3aed' },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: '#7c3aed' }
                                            }}
                                        />
                                    }
                                    label={<Typography variant='body2' sx={{ fontWeight: 500 }}>{profileData.available ? 'Available' : 'Not Available'}</Typography>}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant='caption' sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address Line 1</Typography>
                            {isEdit
                                ? <TextField fullWidth value={profileData.address.line1}
                                    onChange={e => setProfileData(p => ({ ...p, address: { ...p.address, line1: e.target.value } }))}
                                    sx={{ ...inputSx, mt: 1 }} size='small' />
                                : <Typography variant='body2' sx={{ color: '#374151', mt: 0.5 }}>{profileData.address.line1}</Typography>
                            }
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant='caption' sx={{ fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address Line 2</Typography>
                            {isEdit
                                ? <TextField fullWidth value={profileData.address.line2}
                                    onChange={e => setProfileData(p => ({ ...p, address: { ...p.address, line2: e.target.value } }))}
                                    sx={{ ...inputSx, mt: 1 }} size='small' />
                                : <Typography variant='body2' sx={{ color: '#374151', mt: 0.5 }}>{profileData.address.line2}</Typography>
                            }
                        </Grid>
                    </Grid>

                    {isEdit && (
                        <Box sx={{ mt: 3 }}>
                            <Button
                                onClick={updateProfile}
                                variant='contained'
                                startIcon={<SaveOutlined />}
                                sx={{
                                    borderRadius: 50, textTransform: 'none', fontWeight: 700,
                                    px: 5, background: '#7c3aed', boxShadow: 'none',
                                    '&:hover': { background: '#6d28d9', boxShadow: 'none' }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}

export default Profile
