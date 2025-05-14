import React, { useState } from 'react'
import johnDoeImage from '../../../../../public/images/john-doe.webp'
import { useCommentActions } from '../../hooks/useCommentActions'
import * as s from './UserCommentForm.module.scss'

export const UserCommentForm = () => {
	const [commentText, setCommentText] = useState('')

	const { handleAddComment } = useCommentActions()

	const handleClick = () => {
		if (!commentText.trim()) return
		handleAddComment(commentText)
		setCommentText('')
	}

	return (
		<div className={s.container_editor}>
			<div className={s.container_editor_user}>
				<img
					className={s.container_editor_avatar}
					src={johnDoeImage}
					alt='john-doe'
				/>
				<p className={s.container_editor_username}>John Doe</p>
			</div>
			<textarea
				className={s.container_editor_textarea}
				placeholder='Enter your comment'
				value={commentText}
				onChange={(e) => setCommentText(e.target.value)}
			></textarea>
			<div className={s.divide}></div>
			<div className={s.editor_publish}>
				<div className={s.editor_publish_formatting_btns}>
					<div>1, 2, 3</div>
					<button
						type='submit'
						disabled={!commentText}
						onClick={handleClick}
						className={s.comment_publish_btn}
					>
						Comment
					</button>
				</div>
			</div>
		</div>
	)
}
