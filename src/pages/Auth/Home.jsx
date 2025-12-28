import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button
        variant="contained" startIcon={<LoginIcon />}
        onClick={() => navigate('/login')}
      >
        Login
      </Button>
      <Button variant="outlined" endIcon={<PersonAddIcon />}>
        Register
      </Button>
    </Stack>
  )
}

export default Home