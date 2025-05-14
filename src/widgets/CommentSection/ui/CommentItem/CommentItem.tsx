import { Comment } from '@/entities/model/types'
import { useUpdateCommentMutation } from '@/shared/api/rtkQuery'
import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import React, { FC, useRef } from 'react'
import { useCommentActions } from '../../hooks/useCommentActions'
import { CommentActions } from '../CommentActions/CommentActions'
import { ReplyCommentForm } from '../ReplyCommentForm/ReplyCommentForm'
import * as s from './CommentItem.module.scss'

interface Props {
	isLoading?: boolean
	comment: Comment
	activeReplyId?: string | null
	onSubmitReply?: (parentId: string, content: string) => void
	onDelete?: (id: string) => void
	onReply?: () => void
}

export const CommentItem: FC<Props> = ({
	comment,
	isLoading,
	activeReplyId,
	onReply,
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null)

	const { handleDeleteComment, handleAddComment } = useCommentActions()

	const [updateComment] = useUpdateCommentMutation()

	const handleLikeToggle = async () => {
		try {
			await updateComment({
				id: comment.id,
				likes: comment.isLikedByUser ? comment?.likes - 1 : comment?.likes + 1,
				isLikedByUser: !comment.isLikedByUser,
			}).unwrap()
		} catch (error) {
			console.error('Error updating comment:', error)
		}
	}

	if (isLoading) return <SkeletonComment />

	return (
		<div ref={containerRef} className={s.comment_container}>
			<div className={s.comment_user}>
				<img
					className={s.comment_user_avatar}
					src={comment.author.avatar}
					alt='john-doe'
				/>
				<p className={s.comment_user_username}>{comment.author.name}</p>
			</div>
			<p className={s.comment_text}>{comment.content}</p>
			<CommentActions
				commentId={comment.id}
				likes={comment.likes || 0}
				isLiked={comment.isLikedByUser || false}
				createdAt={comment.createdAt || new Date().toISOString()}
				onLike={handleLikeToggle}
				onReply={() => onReply?.()}
				onDelete={() => handleDeleteComment(comment.id)}
			/>

			{activeReplyId === comment.id && handleAddComment && (
				<ReplyCommentForm
					onSubmit={(content) => {
						if (!comment.id) return
						handleAddComment(content, comment.id)
						onReply?.()
					}}
					parentId={comment.id}
					onClose={() => onReply?.()}
				/>
			)}

			{comment.replies && comment.replies.length > 0 && (
				<div className={s.replies}>
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							onDelete={handleDeleteComment}
							onReply={onReply}
							onSubmitReply={handleAddComment}
							activeReplyId={activeReplyId}
						/>
					))}
				</div>
			)}
		</div>
	)
}
