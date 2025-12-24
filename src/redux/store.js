import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './slices/boardSlice.js'

export const store = configureStore({
  reducer: {
    board: boardReducer
  }
})
