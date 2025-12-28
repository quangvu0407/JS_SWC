import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, CssBaseline, Grid, Card, CardContent } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';

function HomePage() {
  const features = [
    { title: 'Bảng trực quan', desc: 'Quản lý công việc qua các thẻ kéo thả thông minh.', icon: <ViewWeekIcon color="primary" fontSize="large" /> },
    { title: 'Làm việc nhóm', desc: 'Chia sẻ bảng công việc và cộng tác cùng đồng đội.', icon: <GroupIcon color="primary" fontSize="large" /> },
    { title: 'Tiến độ nhanh', desc: 'Theo dõi deadline và hoàn thành mục tiêu đúng hạn.', icon: <SpeedIcon color="primary" fontSize="large" /> }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f5f7' }}>
      <CssBaseline />

      {/* 1. Header giữ nguyên màu của bạn */}
      <AppBar position="static" sx={{ backgroundColor: '#a3bde2ff' }} elevation={1}>
        <Toolbar variant="dense">
          <DashboardIcon sx={{ mr: 2, color: 'blue' }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', flexGrow: 1, color: 'blue' }}>
            Trello Web
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 2. Nội dung chính */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4, flexGrow: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#172b4d' }}>
            Welcome to Trello Clone
          </Typography>
          <Typography variant="h6" sx={{ color: '#5e6c84', maxWidth: '600px', mx: 'auto' }}>
            Giúp đội nhóm của bạn tiến xa hơn với các bảng công việc sắp xếp khoa học.
          </Typography>

          {/* Outlet này sẽ chứa các nút Đăng nhập/Đăng ký từ Home.jsx */}
          <Box sx={{ mt: 4 }}>
            <Outlet />
          </Box>
        </Box>

        {/* 3. Phần Features (Lấp đầy khoảng trống) */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 4. Footer đơn giản */}
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#ebecf0', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Trello Clone - Dự án học tập React & MUI
        </Typography>
      </Box>
    </Box>
  );
}

export default HomePage