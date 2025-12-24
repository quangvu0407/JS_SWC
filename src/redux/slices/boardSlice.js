import { createSlice } from '@reduxjs/toolkit'

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    board: null
  },
  reducers: {
    setBoard: (state, action) => {
      state.board = action.payload
    },
    updateBoard: (state, action) => {
      state.board = action.payload
    }
  }
})

export const { setBoard, updateBoard } = boardSlice.actions
export default boardSlice.reducer
