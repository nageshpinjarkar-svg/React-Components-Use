import { getServerSideProps } from 'src/features/policy/props'
import Confirmation from 'src/features/confirmation'
import RegistrationWrapper from 'src/components/RegistrationWrapper'

const BibAssignmentPage = () => {
  return (
    <RegistrationWrapper>
      <Confirmation />
    </RegistrationWrapper>
  )
}

export { getServerSideProps }

export default BibAssignmentPage
