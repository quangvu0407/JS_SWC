import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardnAPI } from '~/apis'
import { toast } from 'react-toastify'

const Board = () => {
  const [board, setBoard] = useState(null)
  const boardId = '692b144037ebfc9ccb5b1a58'
  useEffect(() => {

    // Call Api
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    if (createdColumn.statusCode) {
      // console.log(createdColumn)
      toast.error(createdColumn.message)
    }
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardnAPI({
      ...newCardData,
      boardId: board._id
    })

    if (createdCard.statusCode) {
      // console.log(createdColumn)
      toast.error(createdCard.message)
    }
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'primary.contrastText' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board