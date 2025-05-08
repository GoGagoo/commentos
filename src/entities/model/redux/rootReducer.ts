import { combineReducers } from '@reduxjs/toolkit'
import commentsReducer from './commentSlice'

const rootReducer = combineReducers({
	comment: commentsReducer,
})

export default rootReducer
