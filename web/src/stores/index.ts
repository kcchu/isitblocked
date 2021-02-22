import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import jobs from './jobs'
import probes from './probes'

const store = configureStore({
  reducer: {
    jobs,
    probes
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store