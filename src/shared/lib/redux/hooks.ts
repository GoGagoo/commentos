import { TypedRootState } from '@/app/providers/StoreProvider/store'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const useTypedSelector: TypedUseSelectorHook<TypedRootState> =
	useSelector