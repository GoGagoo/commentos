import { Comment } from '@/entities/model/types'
import { useUpdateCommentMutation } from '@/shared/api/rtkQuery'
import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import React, { FC, useRef } from 'react'
import { CommentActions } from '../CommentActions/CommentActions'
import { ReplyEditor } from '../ReplyEditor/ReplyEditor'
import * as s from './CommentItem.module.scss'

interface Props {
	isLoading?: boolean
	comment: Comment
	activeReplyId?: string | number | null

	onDelete: (id: string) => void
	onReply?: () => void
	onSubmitReply?: (content: string) => void
}

export const CommentItem: FC<Props> = ({ comment, ...props }) => {
	const containerRef = useRef<HTMLDivElement | null>(null)

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

	if (props.isLoading) return <SkeletonComment />

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
				likes={comment.likes}
				isLiked={comment.isLikedByUser}
				createdAt={comment.createdAt}
				onLike={handleLikeToggle}
				onReply={() => props.onReply?.()}
				onDelete={() => props.onDelete(comment.id)}
			/>

			{props.activeReplyId === comment.id && props.onSubmitReply && (
				<ReplyEditor
					onSubmit={props.onSubmitReply}
					onClose={() => props.onReply?.()}
				/>
			)}

			{comment.replies && comment.replies.length > 0 && (
				<div className={s.replies}>
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							onDelete={props.onDelete}
							onReply={props.onReply}
							onSubmitReply={props.onSubmitReply}
							activeReplyId={props.activeReplyId}
						/>
					))}
				</div>
			)}
		</div>
	)
}
