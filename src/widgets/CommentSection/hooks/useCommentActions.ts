import {
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useGetCommentsQuery,
} from '@/shared/api/rtkQuery'

export const useCommentActions = () => {
	const { data: comments = [], refetch } = useGetCommentsQuery()

	const [createComment] = useCreateCommentMutation()
	const [deleteComment] = useDeleteCommentMutation()

	const rootComments = comments.filter((c) => !c.parentId)

	const handleAddComment = async (
		content: string,
		parentId?: string,
		onSuccess?: () => void,
	) => {
		try {
			await createComment({
				content,
				parentId,
				author: {
					name: 'John Doe',
					avatar: '/images/john-doe.webp',
				},
				createdAt: new Date().toISOString(),
				likes: 0,
				isLikedByUser: false,
			}).unwrap()
			onSuccess?.()
			await refetch()
		} catch (err) {
			console.error('Error adding comment:', err)
		}
	}

	const handleDeleteComment = async (id: string) => {
		try {
			await deleteComment(id).unwrap()
		} catch (err) {
			console.error('Error deleting comment:', err)
		}
	}

	return {
		handleAddComment,
		handleDeleteComment,
		rootComments,
	}
}
