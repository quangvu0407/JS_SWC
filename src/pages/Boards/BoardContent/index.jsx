import Box from '@mui/material/Box'

const BoardContent = () => {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1560c0'),
      width: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.boardBarHeight} - ${theme.trello.appBarHeight})`,
      display: 'flex',
      alignItems: 'center'
    }}>
      Board content
    </Box>
  )
}

export default BoardContent