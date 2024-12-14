import { create } from 'zustand'

type EditedTask = {
  id: number
  title: string
  genre_id?: number | null // 追加
}

type State = {
  editedTask: EditedTask
  updateEditedTask: (payload: EditedTask) => void
  resetEditedTask: () => void
}

const useStore = create<State>((set) => ({
  editedTask: { id: 0, title: '', genre_id: null }, // 初期値に genre_id を追加
  updateEditedTask: (payload) =>
    set({
      editedTask: payload,
    }),
  resetEditedTask: () => set({ editedTask: { id: 0, title: '', genre_id: null } }), // リセット時も genre_id をリセット
}))

export default useStore