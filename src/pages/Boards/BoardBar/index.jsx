import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterIcon from '@mui/icons-material/Filter'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'

const MenuStyle = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4x',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

const BoardBar = () => {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      borderBottom: '1px solid white',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MenuStyle}
          icon={<DashboardIcon />}
          label="Tuyen Quang "
          clickable />
        <Chip
          sx={MenuStyle}
          icon={<VpnLockIcon />}
          label="Public/private "
          clickable />
        <Chip
          sx={MenuStyle}
          icon={<AddToDriveIcon />}
          label="AddToDriver "
          clickable />
        <Chip
          sx={MenuStyle}
          icon={<BoltIcon />}
          label="Automation "
          clickable />
        <Chip
          sx={MenuStyle}
          icon={<FilterIcon />}
          label="Filter "
          clickable />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >Invite</Button>
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: '34px',
              height: '34px',
              fontSize: '16px'
            }
          }}
        >
          <Tooltip title="avatar">
            <Avatar alt="Remy Sharp" src='https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg' />
          </Tooltip>
          <Tooltip title="avatar">
            <Avatar alt="Remy Sharp" src='https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg' />
          </Tooltip>
          <Tooltip title="avatar">
            <Avatar alt="Remy Sharp" src='https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg' />
          </Tooltip>
          <Tooltip title="avatar">
            <Avatar alt="Remy Sharp" src='https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg' />
          </Tooltip>
          <Tooltip title="avatar">
            <Avatar alt="Remy Sharp" src='https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg' />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box >
  )
}

export default BoardBar