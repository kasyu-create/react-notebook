import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useError } from '../hooks/useError'

type Genre = {
  id: number
  name: string
}

export const useQueryGenres = () => {
  const { switchErrorHandling } = useError()
  const getGenres = async () => {
    const { data } = await axios.get<Genre[]>(
      `${process.env.REACT_APP_API_URL}/genres`,
      { withCredentials: true }
    )
    return data
  }
  return useQuery<Genre[], Error>({
    queryKey: ['genres'],
    queryFn: getGenres,
    staleTime: Infinity,
    onError: (err: any) => {
      if (err.response.data.message) {
        switchErrorHandling(err.response.data.message)
      } else {
        switchErrorHandling(err.response.data)
      }
    },
  })
}
