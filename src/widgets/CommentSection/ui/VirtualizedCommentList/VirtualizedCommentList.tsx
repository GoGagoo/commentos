import { Comment } from '@/entities/model/types'
import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import { useVirtualizer } from '@tanstack/react-virtual'
import React, { FC, useRef } from 'react'
import { CommentItem } from '../CommentItem/CommentItem'
import * as s from './VirtualizedCommentList.module.scss'

interface Props {
	comments: Comment[]
	rootComments: Comment[]

	isFetching: boolean
	activeReplyId: string | number | null
	setActiveReplyId: React.Dispatch<React.SetStateAction<string | null>>
	onReplySubmit: (parentId: string, content: string) => void
	onDelete: (id: string) => void
	refetch: () => void
}

export const VirtualizedCommentList: FC<Props> = ({
	comments,
	rootComments,
	refetch,
	isFetching,
	activeReplyId,
	setActiveReplyId,
	onReplySubmit,
	onDelete,
}) => {
	const parentRef = useRef<HTMLDivElement>(null)

	const rowVirtualizer = useVirtualizer({
		count: rootComments.length + (isFetching ? 2 : 0),
		getScrollElement: () => parentRef.current,
		estimateSize: (index) => {
			if (index >= rootComments.length) return 120

			const comment = rootComments[index]
			const repliesCount = comments.filter(
				(c) => c.parentId === comment?.id,
			).length
			return 180 + repliesCount * 160
		},
		measureElement: (el) => el.getBoundingClientRect().height,
		overscan: 5,
		onChange: (virtualizer) => {
			const items = virtualizer.getVirtualItems()
			const lastItem = items[items.length - 1]
			if (lastItem && lastItem.index >= rootComments.length - 1 && !isFetching)
				refetch()
		},
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

					if (idx >= rootComments.length) {
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

					const rootComment = rootComments[idx]
					const replies = comments.filter((c) => c.parentId === rootComment.id)

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
							<div className={s.comment_block}>
								<CommentItem
									comment={{
										...rootComment,
										replies,
										likes: rootComment.likes || 0,
										isLikedByUser: rootComment.isLikedByUser || false,
										createdAt:
											rootComment.createdAt || new Date().toISOString(),
									}}
									onDelete={onDelete}
									onReply={() =>
										setActiveReplyId((prev) =>
											prev === rootComment.id ? null : rootComment.id,
										)
									}
									onSubmitReply={(content) =>
										onReplySubmit(rootComment.id, content)
									}
									activeReplyId={activeReplyId}
								/>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
