import React, { useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import {
    Box, Typography, Card, CardContent, TextField,
    Button, Select, MenuItem, FormControl, InputLabel,
    Avatar, CircularProgress, Grid
} from '@mui/material'
import { AddAPhotoOutlined, PersonAddOutlined } from '@mui/icons-material'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const specialities = ['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist']
const experiences = ['1 Year','2 Years','3 Years','4 Years','5 Years','6 Years','7 Years','8 Years','9 Years','10+ Years']

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&:hover fieldset': { borderColor: '#7c3aed' },
        '&.Mui-focused fieldset': { borderColor: '#7c3aed' }
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7c3aed' }
}

const AddDoctor = () => {
    const { aToken, backendUrl } = useContext(AdminContext)
    const { toast, showToast, hideToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [form, setForm] = useState({
        name: '', email: '', password: '',
        speciality: 'General physician', degree: '',
        experience: '1 Year', about: '', fees: '',
        addressLine1: '', addressLine2: ''
    })

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!image) return showToast('Please upload a doctor image', 'warning')
        setLoading(true)
        try {
            const fd = new FormData()
            fd.append('image', image)
            Object.entries(form).forEach(([k, v]) => {
                if (k === 'addressLine1' || k === 'addressLine2') return
                fd.append(k, v)
            })
            fd.append('address', JSON.stringify({ line1: form.addressLine1, line2: form.addressLine2 }))

            const res = await fetch(`${backendUrl}/api/admin/add-doctor`, {
                method: 'POST',
                headers: { atoken: aToken },
                body: fd
            })
            const data = await res.json()
            if (data.success) {
                showToast('Doctor added successfully!', 'success')
                setForm({ name:'',email:'',password:'',speciality:'General physician',degree:'',experience:'1 Year',about:'',fees:'',addressLine1:'',addressLine2:'' })
                setImage(null)
            } else showToast(data.message, 'error')
        } catch (err) { showToast('Something went wrong', 'error') }
        setLoading(false)
    }

    return (
        <Box sx={{ p: 4, maxWidth: 900 }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <PersonAddOutlined sx={{ color: '#7c3aed', fontSize: 28 }} />
                <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e1b4b' }}>Add New Doctor</Typography>
            </Box>
            <Typography variant='body2' sx={{ color: '#9ca3af', mb: 4 }}>Fill in the details to onboard a new doctor.</Typography>

            <Card elevation={0} sx={{ border: '1px solid #f3f0ff', borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={onSubmit}>

                        {/* Image Upload */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                            <label htmlFor='doc-img' style={{ cursor: 'pointer' }}>
                                <Box sx={{ position: 'relative', width: 96, height: 96 }}>
                                    <Avatar
                                        src={image ? URL.createObjectURL(image) : ''}
                                        sx={{ width: 96, height: 96, background: '#ede9fe', border: '2px dashed #a78bfa' }}
                                    >
                                        <AddAPhotoOutlined sx={{ color: '#7c3aed', fontSize: 32 }} />
                                    </Avatar>
                                </Box>
                            </label>
                            <input onChange={e => setImage(e.target.files[0])} type='file' id='doc-img' accept='image/*' hidden />
                            <Box>
                                <Typography variant='body1' sx={{ fontWeight: 600, color: '#1e1b4b' }}>Doctor Photo</Typography>
                                <Typography variant='body2' color='text.secondary'>Click the avatar to upload a profile photo</Typography>
                                {image && <Typography variant='caption' sx={{ color: '#7c3aed' }}>{image.name}</Typography>}
                            </Box>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Full Name' placeholder='Dr. John Smith' value={form.name} onChange={set('name')} required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Email' type='email' placeholder='doctor@email.com' value={form.email} onChange={set('email')} required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Password' type='password' placeholder='Min 8 characters' value={form.password} onChange={set('password')} required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={inputSx}>
                                    <InputLabel>Speciality</InputLabel>
                                    <Select value={form.speciality} onChange={set('speciality')} label='Speciality' sx={{ borderRadius: 2 }}>
                                        {specialities.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Degree' placeholder='MBBS, MD' value={form.degree} onChange={set('degree')} required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={inputSx}>
                                    <InputLabel>Experience</InputLabel>
                                    <Select value={form.experience} onChange={set('experience')} label='Experience' sx={{ borderRadius: 2 }}>
                                        {experiences.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Consultation Fees (₹)' type='number' placeholder='500' value={form.fees} onChange={set('fees')} required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Address Line 1' placeholder='Clinic address' value={form.addressLine1} onChange={set('addressLine1')} required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Address Line 2' placeholder='City, State' value={form.addressLine2} onChange={set('addressLine2')} sx={inputSx} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={4} label='About Doctor' placeholder='Brief description about the doctor...' value={form.about} onChange={set('about')} required sx={inputSx} />
                            </Grid>
                        </Grid>

                        <Button
                            type='submit'
                            variant='contained'
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} color='inherit' /> : <PersonAddOutlined />}
                            sx={{
                                mt: 4, borderRadius: 50, textTransform: 'none', fontWeight: 700,
                                px: 5, py: 1.5, background: '#7c3aed', boxShadow: 'none',
                                '&:hover': { background: '#6d28d9', boxShadow: 'none' },
                                '&:disabled': { background: '#c4b5fd', color: '#fff' }
                            }}
                        >
                            {loading ? 'Adding Doctor...' : 'Add Doctor'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}

export default AddDoctor
