import { Comment } from '@/entities/model/types'
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import React, { FC, useRef, useState } from 'react'
import * as s from './CommentItem.module.scss'
import { useOnClickOutside } from '@/shared/lib/useOnClickOutside'

interface Props {
	id?: string | number | undefined
	author?: string
	content?: string
	createdAt?: string
	avatar?: string
	showReplyEditor?: boolean
	replies?: Comment[]
	isLoading?: boolean
	activeReplyId?: string | number | null
	setActiveReplyId?: (id: string | number | null) => void

	onDelete?: (id: string) => void
	onReply?: () => void
	onSubmitReply?: (content: string) => void
	onDeleteReply?: (id: string) => void
}

export const CommentItem: FC<Props> = ({
	id,
	author,
	content,
	createdAt,
	avatar,
	onDelete,
	onReply,
	activeReplyId,
	setActiveReplyId,
	showReplyEditor,
	onSubmitReply,
	onDeleteReply,
	isLoading = false,
	replies = [],
}) => {
	const [replyText, setReplyText] = useState('')
	const [likes, setLikes] = useState(0)
	const [isLiked, setIsLiked] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const replyEditorRef = useRef<HTMLDivElement | null>(null)

	const handleLikeToggle = () => {
		setLikes((prev) => prev + (isLiked ? -1 : 1))
		setIsLiked(!isLiked)
	}

	if (isLoading) return <SkeletonComment />

	useOnClickOutside<HTMLDivElement>(replyEditorRef, () => {
    if (showReplyEditor && setActiveReplyId) {
      setActiveReplyId(null)
    }
  })

	return (
		<div ref={containerRef} className={s.comment_container}>
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
					<button
						onClick={() => {
							if (onDelete && id !== undefined) onDelete(String(id))
						}}
						className={s.comment_delete_btn}
					>
						Delete
					</button>
					<p className={s.comment_created_at}>
						{createdAt ? formatRelativeTime(createdAt) : ''}
					</p>
				</div>
			</div>

			{showReplyEditor && (
				<div ref={replyEditorRef} className={s.reply_editor}>
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
									if (onSubmitReply) {
										onSubmitReply(replyText)
										setReplyText('')
									}
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
							id={reply.id}
							key={reply.id}
							author={reply.author}
							content={reply.content}
							createdAt={reply.createdAt}
							avatar={reply.avatar}
							onDelete={() => {
								if (onDeleteReply && reply.id) onDeleteReply(reply.id)
							}}
							onReply={() => setActiveReplyId?.(reply.id)}
							showReplyEditor={activeReplyId === reply.id}
							onSubmitReply={(content) => {
								if (onSubmitReply) onSubmitReply(content)
							}}
							activeReplyId={activeReplyId}
							setActiveReplyId={setActiveReplyId}
						/>
						<p className={s.reply_comment_created_at}>
							{reply.createdAt ? formatRelativeTime(reply.createdAt) : ''}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
