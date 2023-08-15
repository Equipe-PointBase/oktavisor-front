import { create } from 'zustand'

const useTokenStore = create((set) => ({
  tokens: {},
  setToken: (id, token) => set((state) => ({
    tokens: {
      ...state.tokens,
      [id]: token,
    },
  })),
  getToken: (id) => (state) => state.tokens[id],  // Change made here
}))

export default useTokenStore