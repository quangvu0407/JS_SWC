import { Box, InputAdornment, Card as MuiCard, TextField } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import AttachmentIcon from '@mui/icons-material/Attachment'
import ForumIcon from '@mui/icons-material/Forum'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import { updateCardTitleAPI } from '~/apis'
import { validateTitle } from '~/utils/validTitle'

//redux board
import { useDispatch, useSelector } from 'react-redux'
import { updateBoard } from '~/redux/slices/boardSlice'
import { toast } from 'react-toastify'

const Card = ({ card }) => {
  const dispatch = useDispatch()
  const board = useSelector(state => state.board.board)

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(card.title)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const handleUpdateTitleCard = async () => {
    const errorMessage = validateTitle(title)
    if (errorMessage) {
      toast.error(errorMessage, {
        position: 'bottom-right'
      })
      return
    }
    await updateCardTitleAPI(card._id, { title: title })
    const newBoard = structuredClone(board)
    // find column chứa card
    const column = newBoard.columns.find(col =>
      col.cards.some(c => c._id === card._id)
    )

    if (column) {
      // find card và update title
      const foundCard = column.cards.find(c => c._id === card._id)
      if (foundCard) foundCard.title = title
      setTitle(foundCard.title)
    }

    dispatch(updateBoard(newBoard))
    setIsEditing(!isEditing)
  }

  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid red' : undefined
  }

  const isShowActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.sh?.attachments
  }

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
      // {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        display: card?.FE_placeholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main },
        borderColor: isEditing ? 'error.main' : 'divider'
      }}
    >
      {card?.cover &&
        <CardMedia
          sx={{ height: 140 }}
          image={card?.cover}
        />
      }

      <CardContent sx={{
        p: 1.5, '&:last-child': { p: 1.5 }, '& .MuiInput-underline:before, & .MuiInput-underline:after': {
          display: 'none'
        }
      }}>
        {isEditing ? (
          <TextField
            value={title}
            autoFocus
            variant="standard"
            fullWidth
            InputProps={{
              endAdornment: (
                isEditing ?
                  <InputAdornment position="end">
                    <CloseIcon
                      fontSize="small"
                      sx={{ color: 'red', cursor: 'pointer' }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        setIsEditing(false)
                      }}
                    />
                    <DoneIcon
                      fontSize='small'
                      sx={{ color: 'green', cursor: 'pointer' }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={handleUpdateTitleCard}
                    />
                  </InputAdornment>
                  : <></>)
            }}
            sx={{
              '& input': {
                fontSize: '0.875rem',
                fontWeight: 400,
                padding: 0
              }
            }}
            onChange={(e) => setTitle(e.target.value)}
          />

        ) : (
          <Typography onClick={() => setIsEditing(true)}>
            {card.title}
          </Typography>
        )}
      </CardContent>
      {isShowActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>}
          {!!card?.comments?.length && <Button size="small" startIcon={<ForumIcon />}>{card?.comments?.length}</Button>}
          {!!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>}
        </CardActions>
      }

    </MuiCard>
  )
}

export default Card