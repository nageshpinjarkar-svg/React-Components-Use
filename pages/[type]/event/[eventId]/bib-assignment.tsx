import { getServerSideProps } from 'src/features/policy/props'
import BibAssignment from 'src/features/bibAssignment'
import RegistrationWrapper from 'src/components/RegistrationWrapper'

const BibAssignmentPage = () => {
  return (
    <RegistrationWrapper isShowAllFieldsRequired>
      <BibAssignment />
    </RegistrationWrapper>
  )
}

export { getServerSideProps }

export default BibAssignmentPage
