import { Comment } from '@/entities/model/types'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
import React, { FC, useState } from 'react'
import * as s from './CommentItem.module.scss'

interface Props {
	author: string
	content: string
	createdAt: string
	avatar: string
	showReplyEditor: boolean
	replies?: Comment[]
	isLoading?: boolean

	onDelete: () => void
	onReply: () => void
	onSubmitReply: (content: string) => void
	onDeleteReply?: (id: string | number) => void
}

export const CommentItem: FC<Props> = ({
	author,
	content,
	createdAt,
	avatar,
	onDelete,
	onReply,
	showReplyEditor,
	onSubmitReply,
	onDeleteReply,
	isLoading = false,
	replies = [],
}) => {
	const [replyText, setReplyText] = useState('')
	const [likes, setLikes] = useState(0)
	const [isLiked, setIsLiked] = useState(false)

	const handleLikeToggle = () => {
		setLikes((prev) => prev + (isLiked ? -1 : 1))
		setIsLiked(!isLiked)
	}

	if (isLoading) {
		return (
			<div className={s.comment_container}>
				<div className={s.skeleton_avatar} />
				<div className={s.skeleton_username} />
				<div className={s.skeleton_text} />
				<div className={s.skeleton_buttons} />
			</div>
		)
	}

	return (
		<div className={s.comment_container}>
			<div className={s.comment_user}>
				<img className={s.comment_user_avatar} src={avatar} alt='john-doe' />
				<p className={s.comment_user_username}>{author}</p>
			</div>
			<p className={s.comment_text}>{content}</p>
			<div className={s.container_editor_post}>
				<div className={s.formatting_btns}>
					<button
						onClick={handleLikeToggle}
						className={isLiked ? s.comment_like_btn_active : s.comment_like_btn}
					>
						{isLiked ? 'Unlike' : 'Like'} {likes}
					</button>
					<button onClick={onReply} className={s.comment_reply_btn}>
						Reply
					</button>
					<button onClick={onDelete} className={s.comment_delete_btn}>
						Delete
					</button>
					<p className={s.comment_created_at}>
						{formatRelativeTime(createdAt)}
					</p>
				</div>
			</div>

			{showReplyEditor && (
				<div className={s.reply_editor}>
					<textarea
						className={s.reply_textarea}
						value={replyText}
						placeholder='Enter your reply comment'
						onChange={(e) => setReplyText(e.target.value)}
					/>
					<div className={s.editor_publish}>
						<div className={s.reply_divide}></div>
						<div className={s.reply_publish_formatting_btns}>
							<div>1, 2, 3</div>
							<button
								type='submit'
								disabled={!replyText}
								onClick={() => {
									onSubmitReply(replyText)
									setReplyText('')
								}}
								className={s.reply_publish_btn}
							>
								Reply
							</button>
						</div>
					</div>
				</div>
			)}

			<div className={s.replies}>
				{replies.map((reply) => (
					<div key={reply.id} className={s.reply_comment}>
						<CommentItem
							key={reply.id}
							author={reply.author}
							content={reply.content}
							createdAt={reply.createdAt}
							avatar={reply.avatar}
							onDelete={() => onDeleteReply?.(reply.id)}
							onReply={onReply}
							showReplyEditor={false}
							onSubmitReply={() => {}}
						/>
						<p className={s.reply_comment_created_at}>
							{formatRelativeTime(createdAt)}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
