import { create } from 'zustand'

type EditedTask = {
  id: number
  title: string
  genre_id?: number | null
}

type State = {
  editedTask: EditedTask
  isAuthenticated: boolean // 認証状態を追加
  updateEditedTask: (payload: EditedTask) => void
  resetEditedTask: () => void
  setAuth: (isAuthenticated: boolean) => void // 認証状態を更新する関数を追加
}

const useStore = create<State>((set) => ({
  editedTask: { id: 0, title: '', genre_id: null },
  isAuthenticated: false, // 初期状態は未認証
  updateEditedTask: (payload) =>
    set({
      editedTask: payload,
    }),
  resetEditedTask: () => set({ editedTask: { id: 0, title: '', genre_id: null } }),
  setAuth: (isAuthenticated) => set({ isAuthenticated }), // 認証状態を更新
}))

export default useStore