import { FormEvent, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid'
import useStore from '../store'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { useQueryGenres } from '../hooks/useQueryGenres'
import { useMutateTask } from '../hooks/useMutateTask'
import { useMutateAuth } from '../hooks/useMutateAuth'
import { TaskItem } from './TaskItem'

export const Todo = () => {
  const queryClient = useQueryClient()
  const { editedTask } = useStore()
  const updateTask = useStore((state) => state.updateEditedTask)
  const { data: tasks, isLoading: isTasksLoading } = useQueryTasks()
  const { data: genres, isLoading: isGenresLoading } = useQueryGenres()
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  const { logoutMutation } = useMutateAuth()
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const submitTaskHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTask.id === 0)
      createTaskMutation.mutate({
        title: editedTask.title,
        genreId: selectedGenre,
      })
    else {
      updateTaskMutation.mutate({ ...editedTask, genreId: selectedGenre })
    }
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['tasks'])
  }

  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center my-3">
        <ShieldCheckIcon className="h-8 w-8 mr-3 text-indigo-500 cursor-pointer" />
        <span className="text-center text-3xl font-extrabold">
          学びの記録
        </span>
        <ArrowRightOnRectangleIcon
          onClick={logout}
          className="h-6 w-6 my-6 text-blue-500 cursor-pointer ml-5"
        />
      </div>

      {/* ジャンル選択 (横並び & ドロップダウン幅調整) */}
      <div className="my-2 flex items-center space-x-2">
        <label htmlFor="genre-select" className="text-sm font-medium text-gray-700">
          ジャンル:
        </label>
        {isGenresLoading ? (
          <p>ジャンルをロード中...</p>
        ) : (
          <select
            id="genre-select"
            value={selectedGenre ?? ''}
            onChange={(e) => setSelectedGenre(Number(e.target.value))}
            className="w-40 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              ジャンルを選択
            </option>
            {genres?.map((genre: { id: number; name: string }) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* タスクフォーム (中央配置) */}
      <form onSubmit={submitTaskHandler} className="w-full max-w-md flex flex-col items-center">
        <input
          className="mb-3 px-3 py-2 border border-gray-300 w-2/3"
          placeholder="タイトル"
          type="text"
          onChange={(e) => updateTask({ ...editedTask, title: e.target.value })}
          value={editedTask.title || ''}
        />
        <button
          className="disabled:opacity-40 py-2 px-3 text-white bg-indigo-600 rounded w-2/3"
          disabled={!editedTask.title || !selectedGenre}
        >
          {editedTask.id === 0 ? '登録' : '更新'}
        </button>
      </form>

      {/* タスク一覧 (従来通りの幅) */}
      {isTasksLoading ? (
        <p>タスクをロード中...</p>
      ) : (
        <ul className="my-5 w-full max-w-md px-5">
          {tasks?.map((task: { id: number; title: string }) => (
            <TaskItem key={task.id} id={task.id} title={task.title} />
          ))}
        </ul>
      )}
    </div>
  )
}