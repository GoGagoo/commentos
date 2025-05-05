import { Comment } from '@/entities/model/types'
import { api } from '@/shared/api/api'
import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import { NotFound } from '@/widgets/CommentSection/ui/NotFound/NotFound'
import { useVirtualizer } from '@tanstack/react-virtual'
import React, { useEffect, useRef, useState } from 'react'
import { CommentItem } from '../../widgets/CommentSection/ui/CommentItem/CommentItem'
import { Editor } from '../../widgets/CommentSection/ui/Editor/Editor'
import * as s from './CommentSection.module.scss'

export const CommentSection = () => {
	const [comments, setComments] = useState<Comment[]>([])
	const [activeReplyId, setActiveReplyId] = useState<string | number | null>(
		null,
	)
	const [isLoading, setIsLoading] = useState(true)
	const [isFetchingMore, setIsFetchingMore] = useState(false)
	const [hasMoreComments, setHasMoreComments] = useState(true)

	const parentRef = useRef<HTMLDivElement>(null)

	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

	const commentVisualCount = comments?.length + (isFetchingMore ? 2 : 0)

	const rowVirtualizer = useVirtualizer({
		count: commentVisualCount,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 178,
		overscan: 0,
	})

	const fetchInitialComments = async () => {
		try {
			const res = await api.get<Comment[]>('/comments?_limit=10&_start=0')
			const topLevelComments = res.data.filter((c) => !c.parentId)
			const replies = res.data.filter((r) => r.parentId)

			const withReplies = topLevelComments.map((comment) => ({
				...comment,
				replies: replies.filter((r) => r.parentId === comment.id),
			}))

			setComments(withReplies)
			setHasMoreComments(res.data.length >= 10)
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const fetchMoreComments = async () => {
		setIsFetchingMore(true)
		try {
			await delay(1500)
			const res = await api.get<Comment[]>(
				`/comments?_limit=5&_start=${comments?.length}`,
			)
			const newTop = res.data.filter((c) => !c.parentId)
			const replies = res.data.filter((r) => r.parentId)

			const withReplies = newTop.map((comment) => ({
				...comment,
				replies: replies.filter((r) => r.parentId === comment.id),
			}))

			setComments((prev) => [...(prev || []), ...withReplies])
			if (res.data.length < 5) setHasMoreComments(false)
		} catch (err) {
			console.error(err)
		} finally {
			setIsFetchingMore(false)
		}
	}

	useEffect(() => {
		fetchInitialComments()
	}, [])

	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()
		if (
			lastItem &&
			lastItem.index >= comments.length - 1 &&
			!isFetchingMore &&
			hasMoreComments
		) {
			fetchMoreComments()
		}
	}, [rowVirtualizer.getVirtualItems(), comments.length])

	const handleAddComment = (content: string) => {
		const newComment = {
			author: 'John Doe',
			content,
			createdAt: new Date().toISOString(),
			avatar: '/images/john-doe.webp',
		}

		api
			.post<Comment>('/comments', newComment)
			.then((res) => setComments((prev) => [...(prev || []), res.data]))
			.catch((err) => console.error('Failed to add comment:', err))
	}

	const handleDeleteComment = (id: string | number) => {
		api
			.delete(`/comments/${id}`)
			.then(() =>
				setComments((prev) =>
					(prev || []).filter((comment) => comment.id !== id),
				),
			)
			.catch((err) => console.error('Failed to delete comment:', err))
	}

	const handleAddReply = (parentId: string | number, content: string) => {
		const reply = {
			author: 'John Doe',
			content,
			createdAt: new Date().toISOString(),
			avatar: '/images/john-doe.webp',
			parentId,
		}

		api.post<Comment>(`/comments`, reply).then((res) => {
			setComments((prev) =>
				(prev || []).map((comment) =>
					comment.id === parentId
						? {
								...comment,
								replies: [...(comment.replies || []), res.data],
							}
						: comment,
				),
			)
			setActiveReplyId(null)
		})
	}

	const handleDeleteReply = (
		parentId: string | number,
		replyId: string | number,
	) => {
		api
			.delete(`/comments/${replyId}`)
			.then(() => {
				setComments((prev) =>
					(prev || []).map((comment) =>
						comment.id === parentId
							? {
									...comment,
									replies: comment.replies?.filter(
										(reply) => reply.id !== replyId,
									),
								}
							: comment,
					),
				)
			})
			.catch((err) => console.error('Failed to delete reply:', err))
	}

	return (
		<main className={s.container}>
			<div className={s.container_inner}>
				<div className={s.container_inner_title}>Comments</div>
				<Editor handleAddComment={handleAddComment} />

				{isLoading &&
					[...Array(3)].map((_, idx) => (
						<CommentItem
							key={idx}
							isLoading
							showReplyEditor={false}
							onDelete={() => {}}
							onReply={() => {}}
							onSubmitReply={() => {}}
							author=''
							content=''
							createdAt=''
							avatar=''
						/>
					))}

				{!isLoading && comments.length === 0 && <NotFound />}

				{!isLoading && comments.length > 0 && (
					<div ref={parentRef} className={s.visualizer_container}>
						<div
							style={{
								height: `${rowVirtualizer.getTotalSize()}px`,
								width: '100%',
								position: 'relative',
							}}
						>
							{rowVirtualizer.getVirtualItems().map((virtualRow) => {
								const isSkeleton = virtualRow.index >= comments.length
								if (isSkeleton) {
									return (
										<div
											key={`skeleton-${virtualRow.index}`}
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												transform: `translateY(${virtualRow.start}px)`,
											}}
										>
											<SkeletonComment />
										</div>
									)
								}

								const comment = comments[virtualRow.index]
								return (
									<div
										key={comment.id}
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											transform: `translateY(${virtualRow.start}px)`,
										}}
									>
										<CommentItem
											{...comment}
											onDelete={() => handleDeleteComment(comment.id)}
											onReply={() => setActiveReplyId(comment.id)}
											showReplyEditor={activeReplyId === comment.id}
											onSubmitReply={(content) =>
												handleAddReply(comment.id, content)
											}
											onDeleteReply={(replyId) =>
												handleDeleteReply(comment.id, replyId)
											}
										/>
									</div>
								)
							})}
						</div>

						{isFetchingMore && (
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									transform: `translateY(${rowVirtualizer.getTotalSize()}px)`,
								}}
							>
								{[...Array(2)].map((_, i) => (
									<SkeletonComment key={i} />
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</main>
	)
}
