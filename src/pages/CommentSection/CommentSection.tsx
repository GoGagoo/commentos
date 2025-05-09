import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import { useCommentActions } from '@/widgets/CommentSection/hooks/useCommentActions'
import { Editor } from '@/widgets/CommentSection/ui/Editor/Editor'
import { NotFound } from '@/widgets/CommentSection/ui/NotFound/NotFound'
import { VirtualizedCommentList } from '@/widgets/CommentSection/ui/VirtualizedCommentList/VirtualizedCommentList'
import React, { useState } from 'react'
import * as s from './CommentSection.module.scss'

export const CommentSection = () => {
	const [activeReplyId, setActiveReplyId] = useState<string | null>(null)

	const {
		comments,
		isLoading,
		isFetching,
		refetch,
		rootComments,
		handleAddComment,
		handleDeleteComment,
		handleAddReply,
	} = useCommentActions()

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
					<VirtualizedCommentList
						comments={comments}
						rootComments={rootComments}
						isFetching={isFetching}
						activeReplyId={activeReplyId}
						setActiveReplyId={setActiveReplyId}
						onReplySubmit={handleAddReply}
						onDelete={handleDeleteComment}
						refetch={refetch}
					/>
				)}
			</div>
		</main>
	)
}
