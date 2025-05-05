import { Comment } from '@/entities/model/types'
import { api } from '@/shared/api/api'
import { NotFound } from '@/widgets/CommentSection/ui/NotFound/NotFound'
import React, { useEffect, useState } from 'react'
import { CommentItem } from '../../widgets/CommentSection/ui/CommentItem/CommentItem'
import { Editor } from '../../widgets/CommentSection/ui/Editor/Editor'
import * as s from './CommentSection.module.scss'

export const CommentSection = () => {
	const [comments, setComments] = useState<Comment[] | null>(null)
	const [activeReplyId, setActiveReplyId] = useState<string | number | null>(
		null,
	)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setIsLoading(true)

		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 4000)

		api
			.get<Comment[]>('/comments')
			.then((res) => {
				const topLevelComments = res.data.filter((c) => !c.parentId)
				const replies = res.data.filter((rc) => rc.parentId)

				const commentWithReplies = topLevelComments.map((comment) => ({
					...comment,
					replies: replies.filter((reply) => reply.parentId === comment.id),
				}))
				setComments(commentWithReplies)
				clearTimeout(timer)
				setIsLoading(false)
			})
			.catch((error) => {
				console.error(error)
				clearTimeout(timer)
				setIsLoading(false)
				setComments([])
			})

		return () => clearTimeout(timer)
	}, [])

	const handleAddComment = (content: string) => {
		const newComment = {
			author: 'John Doe',
			content,
			createdAt: new Date().toISOString(),
			avatar: '/images/john-doe.webp',
		}

		api
			.post<Comment>('/comments', newComment)
			.then((res) => setComments((prev) => [...(prev || []), res.data]))
			.catch((err) => console.error('Failed to add comment:', err))
	}

	const handleDeleteComment = (id: string | number) => {
		api
			.delete(`/comments/${id}`)
			.then(() =>
				setComments((prev) =>
					(prev || []).filter((comment) => comment.id !== id),
				),
			)
			.catch((err) => console.error('Failed to delete comment:', err))
	}

	const handleAddReply = (parentId: string | number, content: string) => {
		const reply = {
			author: 'John Doe',
			content,
			createdAt: new Date().toISOString,
			avatar: '/images/john-doe.webp',
			parentId,
		}

		api.post<Comment>(`/comments`, reply).then((res) => {
			setComments((prev) =>
				(prev || []).map((comment) =>
					comment.id === parentId
						? {
								...comment,
								replies: [...(comment.replies || []), res.data],
							}
						: comment,
				),
			)
			setActiveReplyId(null)
		})
	}

	const handleDeleteReply = (
		parentId: string | number,
		replyId: string | number,
	) => {
		api
			.delete(`/comments/${replyId}`)
			.then(() => {
				setComments((prev) =>
					(prev || []).map((comment) =>
						comment.id === parentId
							? {
									...comment,
									replies: comment.replies?.filter(
										(reply) => reply.id !== replyId,
									),
								}
							: comment,
					),
				)
			})
			.catch((err) => console.error('Failed to delete reply:', err))
	}

	return (
		<>
			<main className={s.container}>
				<div className={s.container_inner}>
					<div className={s.container_inner_title}>Comments</div>
					<Editor handleAddComment={handleAddComment} />
					{isLoading &&
						[...Array(3)].map((_, idx) => (
							<CommentItem
								key={idx}
								isLoading
								showReplyEditor={false}
								onDelete={() => {}}
								onReply={() => {}}
								onSubmitReply={() => {}}
								author=''
								content=''
								createdAt=''
								avatar=''
							/>
						))}

					{!isLoading && comments && comments.length === 0 && <NotFound />}

					{!isLoading &&
						comments &&
						comments.length > 0 &&
						comments.map((comment) => (
							<CommentItem
								key={comment.id}
								{...comment}
								onDelete={() => handleDeleteComment(comment.id)}
								onReply={() => setActiveReplyId(comment.id)}
								showReplyEditor={activeReplyId === comment.id}
								onSubmitReply={(content) => handleAddReply(comment.id, content)}
								onDeleteReply={(replyId) =>
									handleDeleteReply(comment.id, replyId)
								}
							/>
						))}
				</div>
			</main>
		</>
	)
}
