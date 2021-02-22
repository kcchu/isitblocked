import { FunctionalComponent, Fragment, h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSelector } from "react-redux"
import Alert from '@material-ui/lab/Alert'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {Helmet} from 'react-helmet'
import dayjs from 'dayjs'

import JobInput from '../../components/job-input'
import { selectError, selectProbes, listProbes } from '../../stores/probes'
import { useAppDispatch } from '../../stores'

interface ProbesProps {
}
const Probes: FunctionalComponent<ProbesProps> = (props: ProbesProps) => {
  const dispatch = useAppDispatch()
  const error = useSelector(selectError)
  const probes = useSelector(selectProbes)
  useEffect(() => {
    dispatch(listProbes())
  }, [dispatch])

  return (
    <Fragment>
      <Helmet>
        <title>{`Probes Status - Is It Blocked in Hong Kong?`}</title>
      </Helmet>
      <JobInput />
      <Typography variant="h2" color="primary" gutterBottom={true}>Probes Status</Typography>
      {error &&
        <Alert severity="error" variant="filled" >{error.message}</Alert>}
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Probe</TableCell>
            <TableCell>CC</TableCell>
            <TableCell>ISP</TableCell>
            <TableCell>Name Server</TableCell>
            <TableCell>Last Contact</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {probes.map((probe) => (
            <TableRow key={probe.id}>
              <TableCell>#{probe.id}</TableCell>
              <TableCell>{probe.cc}</TableCell>
              <TableCell>{probe.networkName} ({probe.asn})</TableCell>
              <TableCell>{probe.resolverIp} ({probe.resolverNetworkName}, {probe.resolverAsn})</TableCell>
              <TableCell>{dayjs(probe.lastContact).fromNow()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  )
}

export default Probes
