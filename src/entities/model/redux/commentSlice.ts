import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ICommentState {
	id: number
	parentId: number | null
	content: string
	createdAt: string
	children?: ICommentState[]
}

interface CommentsState {
	items: ICommentState[]
}

const initialState: CommentsState = {
	items: [],
}

const commentSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		setComments(state, action: PayloadAction<ICommentState[]>) {
			state.items = action.payload
		},
		addComment(state, action: PayloadAction<ICommentState>) {
			state.items.push(action.payload)
		},
		deleteComment(state, action: PayloadAction<number>) {
			state.items = state.items.filter(
				(c) => c.id !== action.payload && c.parentId !== action.payload,
			)
		},
	},
})

export const { setComments, addComment, deleteComment } =
	commentSlice.actions
export default commentSlice.reducer
