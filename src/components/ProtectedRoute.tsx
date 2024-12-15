import { FC, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import useStore from '../store'

type Props = {
  children: ReactNode
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
