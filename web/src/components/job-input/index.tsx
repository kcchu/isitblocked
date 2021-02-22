import { FunctionalComponent, createRef, h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { unwrapResult } from '@reduxjs/toolkit'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import normalizeUrl from 'normalize-url'
import { route } from 'preact-router'

import { createJob } from '../../stores/jobs'
import { useAppDispatch } from '../../stores'

interface JobInputProps {
  defaultValue?: string
}

const JobInput: FunctionalComponent<JobInputProps> = (props: JobInputProps) => {
  const { defaultValue } = props
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(defaultValue || "")
  const [error, setError] = useState<any>(undefined)

  useEffect(() => {
    setValue(defaultValue || "")
  }, [defaultValue])

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const input = normalizeUrl(inputRef.current.value)
      dispatch(createJob({input})).
        then(unwrapResult).
        then(resp => {
          route(`/results/${resp.jobId}`)
        }).catch(setError)
    }
  }

  const onBlur = (e: any) => {
    setValue(normalizeUrl(inputRef.current.value))
  }

  const onChange = (e: any) => {
    setValue(inputRef.current.value)
    setError(undefined)
  }

  const inputRef = createRef()
  return (
    <Box my={4}>
      <Typography variant="h1" align="center" color="inherit" gutterBottom={true}>Is It Blocked in Hong Kong?</Typography>
      <Box mt={6}>
        <TextField error={error} value={value} inputRef={inputRef} label="Enter domain name or IP address" helperText={error?.message} variant="outlined" color="secondary" onChange={onChange} onKeyPress={onKeyPress} onBlur={onBlur} fullWidth />
      </Box>
    </Box>
  )
}

export default JobInput
