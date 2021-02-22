import { FunctionalComponent, Fragment, h } from 'preact'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import {Helmet} from 'react-helmet'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  isocLogo: {
    height: "50px"
  }
}))

import JobInput from '../../components/job-input'

const Home: FunctionalComponent = () => {
  const classes = useStyles()
  return (
    <Fragment>
      <Helmet>
        <title>{`Is It Blocked in Hong Kong?`}</title>
      </Helmet>
      <JobInput />
      <Box mt={12} textAlign="center">
        <Typography variant="h6" color="textSecondary" gutterBottom={true}>This project is created by</Typography>
        <p><img src="/assets/ISOC-HONG-KONG-Logo-Dark-Core-RGB-small.png" class={classes.isocLogo}></img></p>
      </Box>
    </Fragment>
  )
}

export default Home
