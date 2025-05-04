import { Comment } from '@/entities/model/types'
import { api } from '@/shared/api/api'
import React, { useEffect, useState } from 'react'
import { CommentItem } from '../../widgets/CommentSection/ui/CommentItem/CommentItem'
import { Editor } from '../../widgets/CommentSection/ui/Editor/Editor'
import * as s from './CommentSection.module.scss'

export const CommentSection = () => {
	const [comments, setComments] = useState<Comment[]>([])
	const [activeReplyId, setActiveReplyId] = useState<string | number | null>(
		null,
	)

	useEffect(() => {
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
			})
			.catch((error) => console.error(error))
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
			.then((res) => setComments((prev) => [...prev, res.data]))
			.catch((err) => console.error('Failed to add comment:', err))
	}

	const handleDeleteComment = (id: string | number) => {
		api
			.delete(`/comments/${id}`)
			.then(() =>
				setComments((prev) => prev.filter((comment) => comment.id !== id)),
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
				prev.map((comment) =>
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
					prev.map((comment) =>
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
					{comments.map((comment) => (
						<CommentItem
							key={comment.id}
							author={comment.author}
							content={comment.content}
							createdAt={comment.createdAt}
							avatar={comment.avatar}
							onDelete={() => handleDeleteComment(comment.id)}
							onReply={() => setActiveReplyId(comment.id)}
							showReplyEditor={activeReplyId === comment.id}
							onSubmitReply={(content) => handleAddReply(comment.id, content)}
							replies={comment.replies}
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
