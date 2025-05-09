import {
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useGetCommentsQuery,
} from '@/shared/api/rtkQuery'
import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import { CommentItem } from '@/widgets/CommentSection/ui/CommentItem/CommentItem'
import { Editor } from '@/widgets/CommentSection/ui/Editor/Editor'
import { NotFound } from '@/widgets/CommentSection/ui/NotFound/NotFound'
import { useVirtualizer } from '@tanstack/react-virtual'
import React, { useRef, useState } from 'react'
import * as s from './CommentSection.module.scss'

export const CommentSection = () => {
	const [activeReplyId, setActiveReplyId] = useState<string | number | null>(
		null,
	)
	const parentRef = useRef<HTMLDivElement>(null)

	const {
		data: comments = [],
		isLoading,
		isFetching,
		refetch,
	} = useGetCommentsQuery()

	const [createComment] = useCreateCommentMutation()
	const [deleteComment] = useDeleteCommentMutation()

	const rootComments = comments.filter((c) => !c.parentId)

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

	const handleAddComment = (content: string) => {
		createComment({
			author: {
				name: 'John Doe',
				avatar: '/images/john-doe.webp',
			},
			content,
			createdAt: new Date().toISOString(),
			likes: 0,
			isLikedByUser: false,
		})
	}

	const handleDeleteComment = async (id: string) => {
		try {
			await deleteComment(id).unwrap()
			refetch()
		} catch (err) {
			console.error('Error deleting comment:', err)
		}
	}

	const handleAddReply = (parentId: string, content: string) => {
		createComment({
			parentId,
			author: {
				name: 'John Doe',
				avatar: '/images/john-doe.webp',
			},
			content,
			createdAt: new Date().toISOString(),
			likes: 0,
			isLikedByUser: false,
		}).then(() => setActiveReplyId(null))
	}

	return (
		<main className={s.container}>
			<div className={s.container_inner}>
				<h1 className={s.container_inner_title}>Comments</h1>
				<Editor handleAddComment={handleAddComment} />

				{isLoading ? (
					[...Array(3)].map((_, idx) => <SkeletonComment key={idx} />)
				) : rootComments.length === 0 ? (
					<NotFound />
				) : (
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
													replies: comments.filter(
														(c) => c.parentId === rootComment.id,
													),
													likes: rootComment.likes || 0,
													isLikedByUser: rootComment.isLikedByUser || false,
													createdAt:
														rootComment.createdAt || new Date().toISOString(),
												}}
												onDelete={handleDeleteComment}
												onReply={() =>
													setActiveReplyId((prev) =>
														prev === rootComment.id ? null : rootComment.id,
													)
												}
												onSubmitReply={(content) =>
													handleAddReply(rootComment.id, content)
												}
												activeReplyId={activeReplyId}
											/>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>
		</main>
	)
}
