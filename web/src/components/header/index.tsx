import { FunctionalComponent, h } from 'preact'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme) => ({
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  }
}))

const Header: FunctionalComponent = () => {
  const classes = useStyles()
  return (
    <AppBar position="static">
      <Toolbar>
        <Link variant="h6" color="inherit" href="/" className={classes.toolbarTitle}>
        Is It Blocked?
        </Link>
        <nav>
          <Link variant="button" color="inherit" href="/probes" className={classes.link}>
            Probe Status
          </Link>
        </nav>
      </Toolbar>
    </AppBar>
  )
}

export default Header
