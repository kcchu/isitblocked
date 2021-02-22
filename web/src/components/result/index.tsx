import { FunctionalComponent, Fragment, h } from 'preact'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'preact/hooks'
import { unwrapResult } from '@reduxjs/toolkit'
import { route } from 'preact-router';
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import { createJob, JobStatus } from '../../stores/jobs'
import { useAppDispatch } from '../../stores'
import dayjs from 'dayjs'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
})

interface ResultTitleProps {
  createdAt: dayjs.Dayjs
  website: string
  domain: string
  jobStatus: JobStatus
}

const ResultTitle: FunctionalComponent<ResultTitleProps> = (props: ResultTitleProps) => {
  const { domain, jobStatus, website, createdAt } = props
  const dispatch = useAppDispatch()
  const onTestAgain = (e: any) => {
    e.preventDefault()
    dispatch(createJob({input: website, forceCreate: true})).
      then(unwrapResult).
      then(resp => {
        route(`/results/${resp.jobId}`)
      })
  }

  let title
  if (jobStatus === 'pending') {
    title = <Typography variant="h2" color="textSecondary" gutterBottom={true}>Testing {domain}&hellip;</Typography>
  } else if (jobStatus === 'blocked') {
    title = <Typography variant="h2" color="error" gutterBottom={true}>Yes! It appears that {domain} is currently blocked in Hong Kong.</Typography>
  } else if (jobStatus === 'normal') {
    title = <Typography variant="h2" color="secondary" gutterBottom={true}>No, {domain} is probably not blocked in Hong Kong. Yet.</Typography>
  } else {
    title = <Typography variant="h2" color="textSecondary" gutterBottom={true}>Unable to test {domain}. Please try again later.</Typography>
  }
  return <div>
    {title}
    {jobStatus === 'pending' ||
      <Typography color="textSecondary" gutterBottom>Created <span title={createdAt.format()}>{dayjs().to(createdAt)}</span>. <Link href="#" onClick={onTestAgain} color="secondary">Test again</Link></Typography>}
  </div>
}

interface ResultRowProps {
  result: any
}
const ResultRow: FunctionalComponent<ResultRowProps> = (props: ResultRowProps) => {
  const { result } = props
  const [open, setOpen] = useState(false)
  const classes = useRowStyles()
  const rawData = result.rawData

  return (
    <Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          #{result.probeId}
        </TableCell>
        <TableCell>{rawData.probe_network_name} ({rawData.resolver_asn})</TableCell>
        <TableCell>{result.blocking}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Box mb={1}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <TableRow key="resolver">
                      <TableCell component="th" scope="row">DNS Server</TableCell>
                      <TableCell>
                        <pre>
                          {rawData.resolver_ip} ({rawData.resolver_network_name}, {rawData.resolver_asn})
                        </pre>
                      </TableCell>
                    </TableRow>
                    <TableRow key="queries">
                      <TableCell component="th" scope="row">DNS Queries</TableCell>
                      <TableCell>
                        <pre>
                          {rawData.test_keys.queries.map((query: any) => {
                            return (
                              <p>
                                {query.query_type} {query.failure || `${query.answers.map((ans: any) => ans.ipv6 || ans.ipv4).join(" ")}`}
                              </p>
                            )
                          })}
                        </pre>
                      </TableCell>
                    </TableRow>
                    <TableRow key="tcp_connect">
                      <TableCell component="th" scope="row">TCP Connect</TableCell>
                      <TableCell>
                        <pre>
                          {rawData.test_keys.tcp_connect?.map((tcp: any) => {
                            return (
                              <Fragment>
                                {tcp.ip}:{tcp.port} {tcp.status.failure || "OK"}<br/>
                              </Fragment>
                            )
                          })}
                        </pre>
                      </TableCell>
                    </TableRow>
                    <TableRow key="requests">
                      <TableCell component="th" scope="row">HTTP Requests</TableCell>
                      <TableCell>
                        <pre>
                          {rawData.test_keys.requests?.map((request: any) => {
                            return (
                              <p>
                                {request.request.method} {request.request.url} {request.response.code}
                              </p>
                            )
                          })}
                        </pre>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
              <Button color="primary">Download Raw Data</Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

interface ResultTableProps {
  jobStatus: JobStatus
  results: any[]
}
const ResultTable: FunctionalComponent<ResultTableProps> = (props: ResultTableProps) => {
  const { results, jobStatus } = props
  if (jobStatus === 'pending') {
    return (
      <LinearProgress color="secondary" />
    )
  }
  return (
    <Box mt={6}>
      <Typography variant="h3" color="inherit" gutterBottom={true}>Details</Typography>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Probe</TableCell>
            <TableCell>ISP</TableCell>
            <TableCell>Blocking?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <ResultRow key={result.id} result={result} />
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

interface ResultProps {
  job: any
  jobStatus: JobStatus
}
const Result: FunctionalComponent<ResultProps> = props => {
  const { job, jobStatus } = props
  return (
    job &&
      <Fragment>
        <ResultTitle jobStatus={jobStatus} website={job.website} domain={job.domain} createdAt={job.createdAt} />
        <ResultTable jobStatus={jobStatus} results={job.resultsList} />
      </Fragment>
  )
}

export default Result
