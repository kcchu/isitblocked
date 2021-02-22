import { FunctionalComponent, h } from 'preact'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

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
        <Typography variant="h6" className={classes.toolbarTitle}>
          Is It Blocked?
        </Typography>
        <nav>
          <Link variant="button" color="inherit" href="/" className={classes.link}>
            Home
          </Link>
          <Link variant="button" color="inherit" href="/probes" className={classes.link}>
            Probe Status
          </Link>
        </nav>
      </Toolbar>
    </AppBar>
  )
}

export default Header
