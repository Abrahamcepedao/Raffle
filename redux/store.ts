/* 
  Program to store the state of the application in Redux.
*/

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import fileReducer from './states/file/reducer'

export function makeStore() {
  return configureStore({
    reducer: { 
      fileState: fileReducer,
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store;