const getEventDateOnly = (eventDate: string) => {
  const date = new Date(eventDate)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const getEventDateForSmallScreen = (start: string, end: string) => {
  const startDate = getEventDateOnly(start)
  const endDate = getEventDateOnly(end)

  return startDate === endDate ? startDate : `${startDate} - ${endDate}`
}
