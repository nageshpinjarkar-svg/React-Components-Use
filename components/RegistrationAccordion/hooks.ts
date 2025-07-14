import { MutableRefObject, useEffect } from 'react'
import _debounce from 'lodash/debounce'

import { useIsDesktop, useIsInViewport } from 'src/app/hooks'
import { getIsElementAbove } from 'src/features/shared/utils'

type SubscribeAndHandleMobileEventsHookArgs = {
  scrollPosition: MutableRefObject<number>
  setTouchingStatus: (status: boolean) => void
}

type MobileBrowserScrollJumpFixHookArgs = {
  isAccordionExpanded: boolean
  accordionDetailsRef: MutableRefObject<HTMLElement | undefined>
  setIsAccordionExpanded: (value: boolean) => void
}

export const useSubscribeAndHandleMobileEvents = ({
  scrollPosition,
  setTouchingStatus,
}: SubscribeAndHandleMobileEventsHookArgs) => {
  const isDesktop = useIsDesktop()

  /** Handling touch events */
  useEffect(() => {
    if (isDesktop) {
      return
    }

    const onTouchStart = () => {
      setTouchingStatus(true)
    }

    const onTouchEnd = () => {
      setTouchingStatus(false)
    }

    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDesktop, setTouchingStatus])

  /** Handling scroll event */
  useEffect(() => {
    if (isDesktop) {
      return
    }

    const onScroll = () => {
      scrollPosition.current = window.screenY
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [isDesktop, scrollPosition])
}

export const useCollapseAccordionOnScroll = ({
  accordionDetailsRef,
  isAccordionExpanded,
  setIsAccordionExpanded,
}: MobileBrowserScrollJumpFixHookArgs) => {
  const isDesktop = useIsDesktop()
  const isInViewport = useIsInViewport(accordionDetailsRef)

  useEffect(() => {
    const handleScroll = _debounce(() => {
      const accordionElement = accordionDetailsRef.current
      const isElementAbove =
        !!accordionElement && getIsElementAbove(accordionElement)

      const shouldAccordionBeCollapsed = !(
        !isAccordionExpanded ||
        isInViewport ||
        !isElementAbove
      )

      if (shouldAccordionBeCollapsed) {
        setIsAccordionExpanded(false)
      }
    }, 200)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isDesktop, isInViewport, isAccordionExpanded])

  /** Decides whether the section should be collapsed */
  useEffect(() => {
    const accordionElement = accordionDetailsRef.current

    const isElementAbove =
      !!accordionElement && getIsElementAbove(accordionElement)

    if (isDesktop || !isAccordionExpanded || isInViewport || !isElementAbove) {
      return
    }
  }, [isAccordionExpanded, accordionDetailsRef, isDesktop, isInViewport])
}
