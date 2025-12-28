import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LoginIcon from '@mui/icons-material/Login'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'

const Login = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'url("https://imgv3.fotor.com/images/videoImage/wonderland-girl-generated-by-Fotor-ai-art-generator.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: '6px 16px',
          borderRadius: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#172b4d' }}>
          Bạn chưa có tài khoản?
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate('/register')}
          sx={{ borderRadius: '20px', textTransform: 'none', bgcolor: '#0055CC' }}
        >
          Đăng ký ngay
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 450,
            p: 5,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(222, 203, 203, 0.42)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Login Now
          </Typography>
          <Typography variant="body2" sx={{ mb: 5, color: 'rgba(255,255,255,0.7)' }}>
            Chào mừng bạn quay trở lại với Trello Web
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Username"
              variant="filled"
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle sx={{ color: 'white' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiFilledInput-root': { bgcolor: 'rgba(245, 254, 248, 0.1)', borderRadius: 1 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiFilledInput-root:hover': { bgcolor: 'rgba(248, 236, 236, 0.15)' }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="filled"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiFilledInput-root': { bgcolor: 'rgba(245, 254, 248, 0.1)', borderRadius: 1 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiFilledInput-root:hover': { bgcolor: 'rgba(248, 236, 236, 0.15)' }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                bgcolor: '#0055CC',
                '&:hover': { bgcolor: '#0747a6' }
              }}
            >
              Đăng nhập tài khoản
            </Button>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', '&:hover': { color: 'white' } }}>
              Quên mật khẩu?
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Login