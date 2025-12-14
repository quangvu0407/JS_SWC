import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardnAPI, updateBoardDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'
import { generaPlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

const Board = () => {
  const [board, setBoard] = useState(null)
  //Tam thoi fix cung boardId
  const boardId = '692b144037ebfc9ccb5b1a58'
  useEffect(() => {

    // Call Api
    fetchBoardDetailsAPI(boardId).then((board) => {
      //Xử lý kéo thả vào 1 column rỗng
      board.columns.forEach(col => {
        if (isEmpty(col.cards)) {
          col.cards = [generaPlaceholderCard(col)]
          col.cardOrderIds = [generaPlaceholderCard(col)._id]
        }
      })

      setBoard(board)
    })
  }, [])

  //Gọi API tạo mới col và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    if (createdColumn.statusCode) {
      toast.error(createdColumn.message)
    }

    //Xử lý khi tạo column mới mà chưa có card thì tạo 1 card ảo bên fe
    createdColumn.cards = [generaPlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generaPlaceholderCard(createdColumn)._id]

    //Cập nhật state Board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  //Gọi API tạo mới card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardnAPI({
      ...newCardData,
      boardId: board._id
    })

    if (createdCard.statusCode) {
      // console.log(createdColumn)
      toast.error(createdCard.message)
    }

    //Cập nhật state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(c => c._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)

  }

  //Gọi API, xử lý kéo thả column.
  const moveColumn = async (dndOrderColumns) => {
    const dndOrderColumnsIds = dndOrderColumns.map(c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderColumns
    newBoard.columnOrderIds = dndOrderColumnsIds
    setBoard(newBoard)

    //Gọi API update Board
    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderColumnsIds })
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'primary.contrastText' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumn={moveColumn}
      />
    </Container>
  )
}

export default Board