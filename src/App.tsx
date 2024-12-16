import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Auth } from './components/Auth'
import { Todo } from './components/Todo'
import { ProtectedRoute } from './components/ProtectedRoute' // 追加
import useStore from './store'
import axios from 'axios'
import { CsrfToken } from './types'

function App() {
  const setAuth = useStore((state) => state.setAuth)

  useEffect(() => {
    axios.defaults.withCredentials = true
    const getCsrfToken = async () => {
      const { data } = await axios.get<CsrfToken>(
        `${process.env.REACT_APP_API_URL}/csrf`
      )
      axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token
    }
    const checkAuth = async () => {
      try {
        console.log('Sending /me request...');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`, {
          withCredentials: true, // クッキーでJWTトークンを送信
        });
        console.log('Auth response:', response.data);
        setAuth(true);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Auth check failed:', error.response?.data || error.message);
        } else {
          console.error('Auth check failed: Unknown error', error);
        }
        setAuth(false);
      }
    };
    getCsrfToken()
    checkAuth()
  }, [setAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        {/* ProtectedRoute を適用 */}
        <Route
          path="/todo"
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App