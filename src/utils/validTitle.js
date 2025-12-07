export const validateTitle = (title) => {
  if (!title) {
    return 'Please enter Column Title!'
  }

  if (title === undefined || title === null) {
    return 'Title is required.'
  }

  // empty
  if (title.trim().length === 0) {
    return 'Title is not allowed to be empty.'
  }

  // trim: không được có space ở đầu hoặc cuối
  if (title !== title.trim()) {
    return 'Title must not have leading or training whitespace.'
  }

  // min
  if (title.length < 3) {
    return 'Title min 3 chars.'
  }

  // max
  if (title.length > 50) {
    return 'Title max 50 chars.'
  }

  return null
}