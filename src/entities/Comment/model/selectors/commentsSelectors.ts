import { RootState } from '@/app/providers/StoreProvider/store'
import { Comment, CommentWithReplies } from '@/entities/model/types'
import { rtkQueryApi } from '@/shared/api/rtkQuery'
import { createSelector } from 'reselect'

const selectCommentsResult = rtkQueryApi.endpoints.getComments.select()

const EMPTY_ARRAY: Comment[] = []

export const selectRootCommentsWithReplies = createSelector(
	(state: RootState) => selectCommentsResult(state)?.data ?? EMPTY_ARRAY,
	(comments: Comment[]): CommentWithReplies[] => {
		const commentsWithReplies = comments.map((comment) => ({
			...comment,
			replies: [] as CommentWithReplies[],
		}))

		const commentMap = new Map<string, CommentWithReplies>()
		commentsWithReplies.forEach((comment) => {
			commentMap.set(comment.id, comment)
		})

		const result: CommentWithReplies[] = []

		commentsWithReplies.forEach((comment) => {
			if (comment.parentId) {
				const parent = commentMap.get(comment.parentId)
				if (parent) {
					parent.replies.push(comment)
				}
			} else {
				result.push(comment)
			}
		})
		
		return result
	},
)
