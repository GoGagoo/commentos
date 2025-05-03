import { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
import React, { FC } from 'react'
import * as s from './CommentItem.module.scss'

interface Props {
	author: string
	content: string
	createdAt: string
	avatar: string
}

export const CommentItem: FC<Props> = ({
	author,
	content,
	createdAt,
	avatar,
}) => {
	return (
		<div className={s.comment_container}>
			<div className={s.comment_user}>
				<img className={s.comment_user_avatar} src={avatar} alt='john-doe' />
				<p className={s.comment_user_username}>{author}</p>
			</div>
			<p className={s.comment_text}>{content}</p>
			<div className={s.container_editor_post}>
				<div className={s.formatting_btns}>
					<button className={s.comment_like_btn}>Like</button>
					<button className={s.comment_reply_btn}>Reply</button>
					<button className={s.comment_delete_btn}>Delete</button>
					<p className={s.comment_created_at}>
						{formatRelativeTime(createdAt)}
					</p>
				</div>
			</div>
			<div className={s.comment_divide}></div>
		</div>
	)
}
