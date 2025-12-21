import axios from '~/utils/axiosCustomize'

export const fetchBoardDetailsAPI = async(boardId) => {
  const response = await axios.get(`/v1/boards/${boardId}`)

  return response
}

export const updateBoardDetailsAPI = async(boardId, updateData) => {
  const response = await axios.put(`/v1/boards/${boardId}`, updateData)

  return response
}

export const moveCardToDifferentColumnAPI = async(updateData) => {
  const response = await axios.put('/v1/boards/supports/moving_card', updateData)

  return response
}

//Column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post('/v1/columns', newColumnData)
  return response
}
//UpdateColumn
export const updateColumnDetailsAPI = async(columnId, updateData) => {
  const response = await axios.put(`/v1/columns/${columnId}`, updateData)

  return response
}

//card
export const createNewCardnAPI = async (newColumnData) => {
  const response = await axios.post('/v1/cards', newColumnData)
  return response
}