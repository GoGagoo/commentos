import { rtkQueryApi } from '@/shared/api/rtkQuery'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
	reducer: {
		[rtkQueryApi.reducerPath]: rtkQueryApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(rtkQueryApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export default store