import { useMediaQuery } from '@mui/material'
import { MutableRefObject, useEffect, useState, type ChangeEvent } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, AppState } from './store'

export const useForm =
  <TContent>(defaultValues: TContent) =>
  (handler: (content: TContent) => void) =>
  async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.persist()

    const form = event.target as HTMLFormElement
    const elements = Array.from(form.elements) as HTMLInputElement[]
    const data = elements
      .filter((element) => element.hasAttribute('name'))
      .reduce(
        (object, element) => ({
          ...object,
          [`${element.getAttribute('name')}`]: element.value,
        }),
        defaultValues
      )
    await handler(data)
    form.reset()
  }

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useIsInViewport = (ref: MutableRefObject<Element | undefined>) => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  function buildThresholdList() {
    const thresholds: number[] = []
    const numSteps = 20

    for (let i = 1.0; i <= numSteps; i++) {
      const ratio = i / numSteps
      thresholds.push(ratio)
    }

    thresholds.push(0)
    return thresholds
  }

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: buildThresholdList(),
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref])

  return isIntersecting
}

export const useIsDesktop = () => {
  const MINIMAL_DESKTOP_WIDTH = 769

  const isDesktop = useMediaQuery(`(min-width: ${MINIMAL_DESKTOP_WIDTH}px)`)

  return isDesktop
}
