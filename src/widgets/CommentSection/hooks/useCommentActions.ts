import {
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useGetCommentsQuery,
} from '@/shared/api/rtkQuery'

export const useCommentActions = () => {
	const {
		data: comments = [],
		isLoading,
		isFetching,
		refetch,
	} = useGetCommentsQuery()

	const [createComment] = useCreateCommentMutation()
	const [deleteComment] = useDeleteCommentMutation()

	const rootComments = comments.filter((c) => !c.parentId)

	const handleAddComment = (content: string) => {
		createComment({
			author: {
				name: 'John Doe',
				avatar: '/images/john-doe.webp',
			},
			content,
			createdAt: new Date().toISOString(),
			likes: 0,
			isLikedByUser: false,
		})
	}

	const handleDeleteComment = async (id: string) => {
		try {
			await deleteComment(id).unwrap()
			refetch()
		} catch (err) {
			console.error('Error deleting comment:', err)
		}
	}

	const handleAddReply = (
		parentId: string,
		content: string,
		onSuccess?: () => void,
	) => {
		createComment({
			parentId,
			author: {
				name: 'John Doe',
				avatar: '/images/john-doe.webp',
			},
			content,
			createdAt: new Date().toISOString(),
			likes: 0,
			isLikedByUser: false,
		}).then(() => onSuccess?.())
	}

	return {
		comments,
		isLoading,
		isFetching,
		refetch,
		rootComments,
		handleAddComment,
		handleDeleteComment,
		handleAddReply,
	}
}
