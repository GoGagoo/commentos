import { Comment } from '@/entities/model/types'
import { api } from '@/shared/api/api'
import React, { useEffect, useState } from 'react'
import { CommentItem } from '../../widgets/CommentSection/ui/CommentItem/CommentItem'
import { Editor } from '../../widgets/CommentSection/ui/Editor/Editor'
import * as s from './CommentSection.module.scss'

export const CommentSection = () => {
	const [comments, setComments] = useState<Comment[]>([])

	useEffect(() => {
		api
			.get<Comment[]>('/comments')
			.then((res) => setComments(res.data))
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
						/>
					))}
				</div>
			</main>
		</>
	)
}
