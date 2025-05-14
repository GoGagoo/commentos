import { useOnClickOutside } from '@/shared/lib/useOnClickOutside'
import React, { FC, useRef, useState } from 'react'
import * as s from './ReplyCommentForm.module.scss'

interface Props {
	onSubmit: (content: string, parentId?: string) => void
	onClose: () => void
	parentId: string
}

export const ReplyCommentForm: FC<Props> = ({
	onSubmit,
	onClose,
	parentId,
}) => {
	const [replyText, setReplyText] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const editorRef = useRef<HTMLDivElement>(null)

	useOnClickOutside(editorRef, onClose)

	const handleSubmit = async () => {
		if (!replyText.trim()) return

		setIsSubmitting(true)
		try {
			await onSubmit(replyText, parentId)
			setReplyText('')
			onClose()
		} finally {
			setIsSubmitting(false)
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
						{isSubmitting ? 'Sending' : 'Retry'}
					</button>
				</div>
			</div>
		</div>
	)
}
