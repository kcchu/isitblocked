import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'

import observerClient from '../api'
import { Probe, ListProbesRequest } from '../api/observer_pb'
import { RootState } from '.'

interface ProbesState {
  loading: string,
  currentRequestId?: string,
  allIds: number[],
  entities: {[id: string]: Probe.AsObject },
  error?: any
}

const initialState = {
  loading: "idle",
  currentRequestId: undefined,
  entities: {},
  allIds: [],
  error: undefined
} as ProbesState

export const listProbes = createAsyncThunk(
  'jobs/listProbes',
  async (thunkAPI) => {
    const req = new ListProbesRequest()
    const res = await observerClient.listProbes(req)
    return res.toObject()
  }
)

const probesSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(listProbes.pending, (state, action) => {
      const { requestId } = action.meta
      if (state.loading === "idle") {
        state.currentRequestId = requestId
        state.loading = "pending"
      }
    })
    builder.addCase(listProbes.fulfilled, (state, action) => {
      const { requestId } = action.meta
      const probes = action.payload.probesList
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        probes.forEach((probe: Probe.AsObject) => {
          state.entities[probe.id] = probe
        })
        state.allIds = probes.map((probe: Probe.AsObject) => probe.id)
        state.loading = "idle"
      }
    })
    builder.addCase(listProbes.rejected, (state, action) => {
      const { requestId } = action.meta
      if (state.loading === "pending" && state.currentRequestId === requestId) {
        state.loading = "idle"
        state.error = action.error
      }
    })
  }
})

export const selectSelf = (state: RootState) => state.probes

export const selectProbes = createSelector(
  selectSelf,
  state => {
    return state.allIds.map((id: number) => state.entities[id])
  }
)

export const selectError = (state: RootState) => state.probes.error

export default probesSlice.reducer