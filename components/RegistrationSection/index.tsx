import RegistrationAccordion, {
  RegistrationAccordionProps,
} from '../shared/RegistrationAccordion'

import { FooterProps } from './Footer'

type RegistrationSectionProps = RegistrationAccordionProps & {
  footerProps?: FooterProps
  isAccordionExpandedDefault: boolean
}

export const RegistrationSection = ({
  children,
  ...accordionProps
}: RegistrationSectionProps) => {
  return (
    <RegistrationAccordion {...accordionProps}>
      {children}
    </RegistrationAccordion>
  )
}
