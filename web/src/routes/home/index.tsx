import { FunctionalComponent, Fragment, h } from 'preact'
import {Helmet} from 'react-helmet'

import JobInput from '../../components/job-input'

const Home: FunctionalComponent = () => {
  return (
    <Fragment>
      <Helmet>
        <title>{`Is It Blocked in Hong Kong?`}</title>
      </Helmet>
      <JobInput />
    </Fragment>
  )
}

export default Home
