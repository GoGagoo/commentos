import React from 'react'
import johnDoeImage from '../../../../shared/assets/images/john-doe.webp'
import * as s from './Editor.module.scss'

export const Editor = () => {
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
				placeholder='Enter your comment'
				className={s.container_editor_textarea}
			></textarea>
			<div className={s.container_divide}></div>
			<div className={s.container_editor_post}>
				<div className={s.formatting_btns}>
					<div>1, 2, 3</div>
					<button className={s.container_editor_post_btn}>Comment</button>
				</div>
			</div>
		</div>
	)
}
