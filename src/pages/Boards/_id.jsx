import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import { toast } from 'react-toastify'
import { generaPlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { Box, CircularProgress, Typography } from '@mui/material'

const Board = () => {
  const [board, setBoard] = useState(null)
  //Tam thoi fix cung boardId
  const boardId = '692b144037ebfc9ccb5b1a58'
  useEffect(() => {

    // Call Api
    fetchBoardDetailsAPI(boardId).then((board) => {
      // sắp xếp thứ tự các col ở đâu trước khi đưa data xuống dưới, do BoardContent khi kéo thả 2 card thì nó xét vị trí dựa trên
      // thứ tự trong mảng Cards, nhưng mảng card chx được sắp xếp mà chỉ hiển thị UI dựa trên vị trí id của cards
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach(col => {
        //Xử lý kéo thả vào 1 column rỗng
        if (isEmpty(col.cards)) {
          col.cards = [generaPlaceholderCard(col)]
          col.cardOrderIds = [generaPlaceholderCard(col)._id]
        }
        else {
          // Nếu ko phải mảng rỗng thì sắp xếp cards theo cardOrderIds vì kéo thả dựa trên vị trí trong mảng cards
          col.cards = mapOrder(col?.cards, col?.cardOrderIds, '_id')
        }
      })
      console.log('full board', board)
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

      if (columnToUpdate.cards.some(card => card.FE_placeholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      }
      else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }

    }
    console.log(columnToUpdate)
    setBoard(newBoard)

  }

  //Gọi API, xử lý kéo thả column.
  const moveColumn = (dndOrderColumns) => {
    const dndOrderColumnsIds = dndOrderColumns.map(c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderColumns
    newBoard.columnOrderIds = dndOrderColumnsIds
    setBoard(newBoard)

    //Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderColumnsIds })
  }

  const moveCardInTheSameColumn = (dndOrderCards, dndOrderCardsIds, columnId) => {
    // Update cho chuẩn dữ liệu Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(col => col._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderCards
      columnToUpdate.cardOrderIds = dndOrderCardsIds
    }
    setBoard(newBoard)

    // Gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderCardsIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderColumns) => {
    const dndOrderColumnsIds = dndOrderColumns.map(c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderColumns
    newBoard.columnOrderIds = dndOrderColumnsIds
    setBoard(newBoard)

    let prevCardOrderIds = dndOrderColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    // console.log(prevCardOrderIds)
    // Gọi api xử lý backend
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box >
    )
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
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board