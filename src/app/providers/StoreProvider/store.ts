import { rtkQueryApi } from '@/shared/api/rtkQuery'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
	reducer: {
		[rtkQueryApi.reducerPath]: rtkQueryApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(rtkQueryApi.middleware),
})

export default store
