import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

const BoardContent = () => {


  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1560c0'),
      width: '100%',
      height: (theme) => theme.trello.boardContentHeight,
      p: '10px 0'
    }}>
      <ListColumns />
    </Box >
  )
}

export default BoardContent