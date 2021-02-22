import { FunctionalComponent, createRef, h } from 'preact'
import { unwrapResult } from '@reduxjs/toolkit'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { route } from 'preact-router';

import { createJob } from '../../stores/jobs'
import { useAppDispatch } from '../../stores'

interface JobInputProps {
  defaultValue?: string
}

const JobInput: FunctionalComponent<JobInputProps> = (props: JobInputProps) => {
  const dispatch = useAppDispatch()
  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      dispatch(createJob({input: inputRef.current.value})).
        then(unwrapResult).
        then(resp => {
          route(`/results/${resp.jobId}`)
        })
    }
  }
  const inputRef = createRef()
  return (
    <Box mb={2}>
      <Typography variant="h1" align="center" color="inherit" gutterBottom={true}>Is It Blocked in Hong Kong?</Typography>
      <TextField value={props.defaultValue || ""} inputRef={inputRef} label="Enter domain name or IP address" variant="outlined" color="secondary" onKeyPress={onKeyPress} fullWidth />
    </Box>
  )
}

export default JobInput
