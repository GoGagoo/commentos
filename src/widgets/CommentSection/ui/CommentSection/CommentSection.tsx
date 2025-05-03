import React from 'react'
import { CommentItem } from '../CommentItem/CommentItem'
import { Editor } from '../Editor/Editor'
import * as s from './CommentSection.module.scss'

export const CommentSection = () => {
	return (
		<>
			<main className={s.container}>
				<div className={s.container_inner}>
					<div className={s.container_inner_title}>Comments</div>
					<Editor />
					<CommentItem />
					<CommentItem />
				</div>
			</main>
		</>
	)
}
