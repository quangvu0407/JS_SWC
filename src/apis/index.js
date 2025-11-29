import axios from '~/utils/axiosCustomize'

export const fetchBoardDetailsAPI = async(boardId) => {
  const response = await axios.get(`/v1/boards/${boardId}`)

  return response
}