import Board from './pages/Boards/_id'
import { Suspense } from 'react'
import {
  Routes
  , Route
} from 'react-router-dom'
import App from './App'
import Login from './pages/Auth/login'
import HomePage from './pages/HomePage'
import Home from './pages/Auth/Home'


function Layout() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        <Route element={<HomePage />}>
          <Route index element={<Home />} />
          <Route path="register" element={<div>Register</div>} />
        </Route>
        <Route path="/Board" element={< App />}>

        </Route>

        <Route path="login" element={<Login />} />
      </Routes>
    </Suspense >
  )
}

export default Layout
