import axios from '~/utils/axiosCustomize'

export const fetchBoardDetailsAPI = async(boardId) => {
  const response = await axios.get(`/v1/boards/${boardId}`)

  return response
}

export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post('/v1/columns', newColumnData)
  return response
}

export const createNewCardnAPI = async (newColumnData) => {
  const response = await axios.post('/v1/cards', newColumnData)
  return response
}