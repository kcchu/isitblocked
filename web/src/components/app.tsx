import { FunctionalComponent, h } from 'preact'
import { Route, Router } from 'preact-router'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import { Provider } from 'react-redux'

import Home from '../routes/home'
import ResultPage from '../routes/result'
import Probes from '../routes/probes'
import NotFoundPage from '../routes/notfound'
import Header from './header'
import store from '../stores'

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0c1c2c'
    },
    secondary: {
      main: '#3a82e4'
    }
  },
  typography: {
    fontSize: 12,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    h1: {
      fontSize: '4rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500
    }
  }
})
theme = responsiveFontSizes(theme)

const App: FunctionalComponent = () => {
  return (
    <div id="app">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Container fixed>
            <Box mt={8}>
              <Paper>
                <Box p={4}>
                  <Router>
                    <Route path="/" component={Home} />
                    <Route path="/results/:jobId" component={ResultPage} />
                    <Route path="/probes" component={Probes} />
                    <NotFoundPage default />
                  </Router>
                </Box>
              </Paper>
            </Box>
          </Container>
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default App
