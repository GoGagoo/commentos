import React from 'react'
import * as s from './SkeletonComment.module.scss'

export const SkeletonComment = () => {
	return (
		<div className={s.comment_container}>
				<div className={s.skeleton_avatar} />
				<div className={s.skeleton_username} />
				<div className={s.skeleton_text} />
				<div className={s.skeleton_buttons} />
			</div>
	)
}
