import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  useSensor, useSensors,
  // MouseSensor, TouchSensor,
  DragOverlay, defaultDropAnimationSideEffects,
  closestCorners, rectIntersection, pointerWithin,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { generaPlaceholderCard } from '~/utils/formatters'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

const BoardContent = ({ board, createNewColumn, createNewCard }) => {

  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  //Cùng 1 thời điểm chỉ kéo thả card hoặc column
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnDragCard, setOldColumnDragCard] = useState(null)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(c => c.cards.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumn = (overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingData) => {
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

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generaPlaceholderCard(nextActiveColumn)]
        }

        // cập nhật lại cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(c => c._id)
      }

      if (nextOverColumn) {
        //kiểm tra xem card đã tồn tại chưa, có thì xóa trước
        nextOverColumn.cards = nextOverColumn.cards.filter(c => c._id !== activeDraggingCardId)

        const rebuild_activeDraggingData = {
          ...activeDraggingData,
          columnId: nextOverColumn._id
        }
        // cập nhật lại cardOrderIds
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingData)

        //Nếu hiện tại tồn tại card fake bên FE thì xóa đi, chỉ để card được over
        nextOverColumn.cards = nextOverColumn.cards.filter(c => !c.FE_placeholderCard)

        // Cập nhật cardOrderIds tại column mới
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(c => c._id)
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    // console.log(event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnDragCard(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    //kéo column thì ko làm gì
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    //card
    const { active, over } = event
    if (!active || !over) return

    //id của active=card._id hiện tại
    const { id: activeDraggingCardId, data: { current: activeDraggingData } } = active
    const { id: overCardId } = over
    //ta phải tìm ngược lên column chứa id của card đang được kéo thả
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return
    if (activeColumn !== overColumn) {
      moveCardBetweenDifferentColumn(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingData)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!oldColumnDragCard || !overColumn) return
      // console.log(activeDraggingData)
      // ta dùng oldColumnDragCard vì data này nấy từ active.id=> dò lại column chứa nó còn activeDraggingData trong curent nó không chạy vì
      // columnId trong current ko thay đổi nên giữ mặc định ban đầu là column cũ, dù sau khi kéo thả( ví dụ từ column2 -> 3) thì nó vẫn
      // thuộc column2, trong active nó ko đổi data.current, chỉ tự set lại active.id, nếu muốn dùng activeDraggingData ta phải set lại id
      if (oldColumnDragCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumn(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingData)
      }
      else {
        const oldCardIndex = oldColumnDragCard?.cards?.findIndex(c => c._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        const dndOrderCards = arrayMove(oldColumnDragCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          targetColumn.cards = dndOrderCards
          targetColumn.cardOrderIds = dndOrderCards.map(c => c._id)
          return nextColumns
        })
      }

    } if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // console.log('column')
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        const dndOrderColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderColumnsIds = dndOrderColumns.map(c => c._id)
        // console.log('dndOrderColumns', dndOrderColumns)
        // console.log('dndOrderColumnsIds', dndOrderColumnsIds)
        setOrderedColumns(dndOrderColumns)
      }
    } setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnDragCard(null)
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

  const collisionDetectionStratery = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    //tìm các điểm va chạm với con trỏ
    const poiterIntersections = pointerWithin(args)

    //check nếu rỗng poiterIntersections
    if (!poiterIntersections?.length) return

    const intersections = !!poiterIntersections?.length
      ? poiterIntersections
      : rectIntersection(args)
    //tìm OverId đầu tiên trong intersection
    let overId = getFirstCollision(intersections, 'id')
    if (overId) {
      //fix nháy giữa 2 column đối với card có ảnh ban đầu
      const checkColumn = orderedColumns.find(c => c._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return container.id !== overId &&
              checkColumn?.cardOrderIds?.includes(container.id)
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    //overId rỗng trả mảng rỗng
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])
  return (
    <DndContext
      onDragStart={handleDragStart}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStratery}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1560c0'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
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