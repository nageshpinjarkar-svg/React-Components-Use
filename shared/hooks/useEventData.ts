import { useRouter } from 'next/router'

import { useGetRegistrationEventByIdQuery } from 'src/api/event'

export const useEventData = () => {
  const { query } = useRouter()

  const { data } = useGetRegistrationEventByIdQuery(Number(query.eventId))

  return { event: data || null }
}
