import { FunctionalComponent, Fragment, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSelector } from "react-redux"
import Alert from '@material-ui/lab/Alert'
import {Helmet} from 'react-helmet'

import JobInput from '../../components/job-input'
import Result from '../../components/result'
import { selectError, selectJobById, selectJobStatus, getJob } from '../../stores/jobs'
import { useAppDispatch } from '../../stores'

interface ResultPageProps {
  jobId: string
}
const ResultPage: FunctionalComponent<ResultPageProps> = (props: ResultPageProps) => {
  const dispatch = useAppDispatch()
  const jobId = parseInt(props.jobId)
  const jobError = useSelector(selectError)
  const job = useSelector(selectJobById(jobId))
  const jobStatus = useSelector(selectJobStatus(jobId))
  useEffect(() => {
    dispatch(getJob(jobId))
  }, [jobId, dispatch])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const polling = () => {
      dispatch(getJob(jobId))
      timeout = setTimeout(polling, 5000)
    }
    if (jobStatus === 'pending') {
      timeout = setTimeout(polling, 5000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [jobId, jobStatus])

  return (
    <Fragment>
      <Helmet>
        <title>{`${job?.domain} - Is It Blocked in Hong Kong?`}</title>
      </Helmet>
      <JobInput defaultValue={job?.website} />
      {jobError &&
        <Alert severity="error" variant="filled" >{jobError.message}</Alert>}
      {jobStatus && job && <Result job={job} jobStatus={jobStatus} />}
    </Fragment>
  )
}

export default ResultPage
