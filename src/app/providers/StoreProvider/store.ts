import commentsReducer from '@/entities/model/redux/commentSlice'
import rootReducer from '@/entities/model/redux/rootReducer'
import { rtkQueryApi } from '@/shared/api/rtkQuery'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
	reducer: {
		comments: commentsReducer,
		[rtkQueryApi.reducerPath]: rtkQueryApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(rtkQueryApi.middleware),
})

export default store
export type TypedRootState = ReturnType<typeof rootReducer>
