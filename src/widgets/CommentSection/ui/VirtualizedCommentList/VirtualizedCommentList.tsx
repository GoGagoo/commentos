import { CommentWithReplies } from '@/entities/model/types'
import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import { useVirtualizer } from '@tanstack/react-virtual'
import React, { FC, useRef } from 'react'
import { CommentItem } from '../CommentItem/CommentItem'
import * as s from './VirtualizedCommentList.module.scss'

interface Props {
	commentTree: CommentWithReplies[]
	activeReplyId: string | null
	setActiveReplyId: React.Dispatch<React.SetStateAction<string | null>>
}

export const VirtualizedCommentList: FC<Props> = ({
	commentTree,
	activeReplyId,
	setActiveReplyId,
}) => {
	const parentRef = useRef<HTMLDivElement>(null)

	const rowVirtualizer = useVirtualizer({
		count: commentTree.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 120,
		overscan: 0,
	})

	return (
		<div ref={parentRef} className={s.visualizer_container}>
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					position: 'relative',
					width: '100%',
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => {
					const idx = virtualRow.index

					if (idx >= commentTree.length) {
						return (
							<div
								data-index={idx}
								ref={rowVirtualizer.measureElement}
								key={`skeleton-${idx}`}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<div className={s.comment_block}>
									<SkeletonComment />
								</div>
							</div>
						)
					}

					const rootComment = commentTree[idx]

					return (
						<div
							data-index={virtualRow.index}
							ref={rowVirtualizer.measureElement}
							key={rootComment.id}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							<CommentItem
								comment={rootComment}
								activeReplyId={activeReplyId}
								onReply={() =>
									setActiveReplyId((prev) =>
										prev === rootComment.id ? null : rootComment.id,
									)
								}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}
