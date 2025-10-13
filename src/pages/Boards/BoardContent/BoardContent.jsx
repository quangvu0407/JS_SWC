import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext, PointerSensor,
  useSensor, useSensors,
  MouseSensor, TouchSensor,
  DragOverlay, defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

const BoardContent = (props) => {

  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const { board } = props
  const [orderedColumns, setOrderedColumns] = useState([])
  //Cùng 1 thời điểm chỉ kéo thả card hoặc column 
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(c => c.cards.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    // console.log(event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    //card
    const { active, over } = event
    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return
    if (activeColumn !== overColumn) {
      setOrderedColumns(prevColumns => {
        const overCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        let newCardIndex
        const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top
          > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

        if (nextActiveColumn) {
          //loại bỏ card được di chuyển đi khỏi column hiện tại
          nextActiveColumn.cards = nextActiveColumn.cards.filter(c => c._id !== activeDraggingCardId)

          // cập nhật lại cardOrderIds
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(c => c._id)
        }

        if (nextOverColumn) {
          //kiểm tra xem card đã tồn tại chưa, có thì xóa trước
          nextOverColumn.cards = nextOverColumn.cards.filter(c => c._id !== activeDraggingCardId)

          // cập nhật lại cardOrderIds
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingData)

          // Cập nhật cardOrderIds tại column mới
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(c => c._id)
        }

        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    // console.log(event)
    const { active, over } = event
    if (!active || !over) return
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderColumnsIds = dndOrderColumns.map(c => c._id)
      // console.log('dndOrderColumns', dndOrderColumns)
      // console.log('dndOrderColumnsIds', dndOrderColumnsIds)
      setOrderedColumns(dndOrderColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1560c0'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box >
    </DndContext>
  )
}

export default BoardContent