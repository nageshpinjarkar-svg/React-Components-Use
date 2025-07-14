import { CountryCode } from 'libphonenumber-js'

export type OptionBase = {
  disabled?: boolean
  label: string | JSX.Element
  value: string | boolean
  additionalInfo?: string
}

export const DISABLE_AUTOCOMPLETE_SAFARI = 'off'
export const DISABLE_AUTOCOMPLETE_CHROME = 'one-time-code'

export type AutoFillField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'streetAddress1'
  | 'streetAddress2'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'country'
  | 'ccName'
  | 'ccNumber'
  | 'ccExp'
  | 'ccCsc'
  | 'birthDay'
  | 'phone'
  | 'phoneNational'

export const AUTOFILL_PHONE: AutoFillField = 'phone'
export const AUTOFILL_PHONE_NATIONAL: AutoFillField = 'phoneNational'
export const AutoFillFields: { [key in AutoFillField]: string } = {
  firstName: 'given-name',
  lastName: 'family-name',
  email: 'email',
  streetAddress1: 'address-line1',
  streetAddress2: 'address-line2',
  state: 'address-level1',
  city: 'address-level2',
  country: 'country',
  postalCode: 'postal-code',
  ccName: 'cc-name',
  ccNumber: 'cc-number',
  ccExp: 'cc-exp',
  ccCsc: 'cc-csc',
  birthDay: 'bday',
  phone: 'tel',
  phoneNational: 'tel-national',
}

export const defaultCountry: CountryCode = 'US'
export const defaultCountryLabel = 'United States'

export interface CountryRegion {
  name: string
  shortCode: string
}
