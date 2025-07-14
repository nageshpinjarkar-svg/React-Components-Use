import { ThemeOptions } from '@mui/material'
import { grey, indigo, lightBlue, pink, blue, red } from '@mui/material/colors'

import { darkBlack, darkBlue, whiteColor } from '../includes/_colors'

export const THEME_MODE_LIGHT = 'light'
export const THEME_MODE_DARK = 'dark'

export const lightTheme: ThemeOptions = {
  palette: {
    mode: THEME_MODE_LIGHT,
    primary: {
      main: lightBlue[800],
    },
    secondary: {
      main: pink['A400'],
    },
    background: {
      default: whiteColor,
      paper: whiteColor,
    },
    text: {
      primary: grey[900],
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${lightBlue[50]} inset`,
            },
            '&[chrome-autofilled]': {
              backgroundColor: `${lightBlue[100]} !important`,
            },
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: 'black',
          '&.Mui-focused ': { color: 'black' },
          '&.Mui-error': {
            color: darkBlack,
          },
        },
        asterisk: {
          '&.Mui-error': {
            color: darkBlack,
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          background: grey[50],
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'lightgray',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: darkBlack,
        },
        body2: {
          color: darkBlack,
          fontSize: '20px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '15px',
          padding: '6px 16px',
        },
        contained: {
          color: 'white',
        },
        text: {
          color: grey[800],
        },
        outlined: {
          borderColor: grey[600],
          color: grey[900],
          fontWeight: 500,
        },
      },
    },
  },
}

export const darkTheme: ThemeOptions = {
  palette: {
    mode: THEME_MODE_DARK,
    primary: {
      main: darkBlue,
    },
    secondary: {
      main: pink['A400'],
    },
    background: {
      default: darkBlue,
      paper: indigo[500],
    },
    text: {
      primary: whiteColor,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${blue[800]} inset`,
            },
            '&[chrome-autofilled]': {
              backgroundColor: `${blue[800]} !important`,
              color: 'inherit !important',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: whiteColor,
          backgroundColor: blue[700],
        },
        outlined: {
          borderColor: whiteColor,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: whiteColor,
        },
        body2: {
          color: whiteColor,
          fontSize: '20px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'white !important',
          '&::focused': { borderColor: 'white !important' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white !important',
          '&.Mui-error': {
            color: `${red[500]} !important`,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: whiteColor,
          '&.Mui-focused ': { color: whiteColor },
          '&.Mui-error': {
            color: whiteColor,
          },
        },
        asterisk: {
          '&.Mui-error': {
            color: whiteColor,
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          background: blue[800],
          color: whiteColor,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: blue[700],
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: whiteColor,
          textDecoration: 'underline',
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked ': { color: whiteColor },
        },
      },
    },
  },
}
