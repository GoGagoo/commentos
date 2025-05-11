import { useOnClickOutside } from '@/shared/lib/useOnClickOutside'
import React, { FC, useRef, useState } from 'react'
import * as s from './ReplyEditor.module.scss'

interface Props {
	onSubmit: (content: string) => void
	onClose: () => void
}

export const ReplyEditor: FC<Props> = ({ onSubmit, onClose }) => {
	const [replyText, setReplyText] = useState('')
	const editorRef = useRef<HTMLDivElement>(null)

	useOnClickOutside(editorRef, onClose)

	const handleSubmit = () => {
		if (replyText.trim()) {
			onSubmit(replyText)
			setReplyText('')
			onClose()
		}
	}

	return (
		<div ref={editorRef} className={s.reply_editor}>
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
						onClick={handleSubmit}
						className={s.reply_publish_btn}
					>
						Reply
					</button>
				</div>
			</div>
		</div>
	)
}
