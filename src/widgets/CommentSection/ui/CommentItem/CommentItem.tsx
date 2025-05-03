import React from 'react'
import janeDoeImage from '../../../../shared/assets/images/jane-doe.webp'
import * as s from './CommentItem.module.scss'

export const CommentItem = () => {
	return (
		<div className={s.comment_container}>
			<div className={s.comment_user}>
				<img
					className={s.comment_user_avatar}
					src={janeDoeImage}
					alt='john-doe'
				/>
				<p className={s.comment_user_username}>Jane Doe</p>
			</div>
			<p className={s.comment_text}>
				I really appreciate the insights and perspective shared in this article.
				It&apos;s definitely given me something to think about and has helped me
				see things from a different angle. Thank you for writing and sharing!
			</p>
			<div className={s.container_editor_post}>
				<div className={s.formatting_btns}>
					<button className={s.comment_like_btn}>Like</button>
					<button className={s.comment_reply_btn}>Reply</button>
					<button className={s.comment_delete_btn}>Delete</button>
					<p className={s.comment_created_at}>5 min ago</p>
				</div>
			</div>
			<div className={s.comment_divide}></div>
		</div>
	)
}
