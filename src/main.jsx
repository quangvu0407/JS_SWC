import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store'

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme'

// Cấu hình react toastify hiển thị tb lỗi
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Cấu hình mui dialog xác nhận xóa/hành động trong web
import { ConfirmProvider } from 'material-ui-confirm'

//Router
import { BrowserRouter } from 'react-router-dom'
import Layout from './layout.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <ConfirmProvider defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
          cancellationButtonProps: { color: 'inherit' },
          buttonOrder: ['confirm', 'cancel']
        }}>
          <CssVarsProvider theme={theme}>
            <CssBaseline />
            <Layout/>
            <ToastContainer position='bottom-left' theme='colored' />
          </CssVarsProvider>
        </ConfirmProvider>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
)
