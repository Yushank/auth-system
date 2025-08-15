import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Dashboard } from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './protectedRoute'
import { Provider } from 'react-redux'
import { store } from './store'

function App() {


  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </>
  )
}

export default App
