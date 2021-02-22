import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

import observerClient from '../api'
import { CreateJobRequest, GetJobRequest, Job } from '../api/observer_pb'
import { RootState } from '.'

export type JobStatus = 'pending' | 'normal' | 'blocked' | 'error'

interface JobsState {
  loading: string,
  currentRequestId?: string,
  entities: {[id: string]: Job.AsObject },
  error?: any
}

const initialState = {
  loading: "idle",
  currentRequestId: undefined,
  entities: {},
  error: undefined
} as JobsState

export const createJob = createAsyncThunk<any, any>(
  'jobs/createJob',
  async (data, thunkAPI) => {
    const req = new CreateJobRequest()
    req.setInput(data.input)
    req.setForceCreate(data.forceCreate)
    const res = await observerClient.createJob(req)
    return res.toObject()
  }
)

export const getJob = createAsyncThunk(
  'jobs/getJob',
  async (id: number, thunkAPI) => {
    const req = new GetJobRequest()
    req.setId(id)
    const res = await observerClient.getJob(req)
    return res.toObject()
  }
)

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(getJob.pending, (state, action) => {
      const { requestId } = action.meta
      if (state.loading === "idle") {
        state.currentRequestId = requestId
        state.loading = "pending"
      }
    })
    builder.addCase(getJob.fulfilled, (state, action) => {
      const { requestId } = action.meta
      const job = action.payload
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.entities[job.id] = job
        state.loading = "idle"
      }
    })
    builder.addCase(getJob.rejected, (state, action) => {
      const { requestId } = action.meta
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle"
        state.error = action.error
      }
    })
  }
})

export const selectSelf = (state: RootState) => state.jobs

export const selectJobById = (id: number) => {
  return createSelector(
    selectSelf,
    state => {
      const job = state.entities[id]
      if (!job) {
        return job
      }
      const updatedAt = dayjs(job.updatedAt)
      const createdAt = dayjs(job.createdAt)
      const results = job.resultsList.map(rs => {
        const rawData = rs.rawData ? JSON.parse(rs.rawData) : undefined
        return {
          ...rs,
          rawData
        }
      })
      return {
        ...job,
        resultsList: results,
        updatedAt,
        createdAt
      }
    }
  )
}

export const selectJobStatus = (id: number) => {
  return (state: RootState) => {
    const job = selectJobById(id)(state)
    if (!job) {
      return undefined
    }
    let results = job.resultsList
    let done = true
    let blocked = false
    results.forEach(rs => {
      done = done && !!rs.rawData
      blocked = blocked || (rs.blocking !== undefined && rs.blocking !== 'false')
    })
    let status: JobStatus
    if (job.updatedAt.isAfter(dayjs().subtract(10, 's'))) {
      status = 'pending'
    } else if (results.length > 0 && done) {
      status = blocked ? 'blocked' : 'normal'
    } else if (job.updatedAt.isAfter(dayjs().subtract(5, 'm'))) {
      status = 'pending'
    } else {
      status = 'error'
    }
    return status
  }
}

export const selectError = (state: RootState) => state.jobs.error

export default jobsSlice.reducer