import { selectRootCommentsWithReplies } from '@/entities/Comment/model/selectors/commentsSelectors'
import { useGetCommentsQuery } from '@/shared/api/rtkQuery'
import { SkeletonComment } from '@/shared/ui/SkeletonComment/SkeletonComment'
import { NotFound } from '@/widgets/CommentSection/ui/NotFound/NotFound'
import { UserCommentForm } from '@/widgets/CommentSection/ui/UserCommentForm/UserCommentForm'
import { VirtualizedCommentList } from '@/widgets/CommentSection/ui/VirtualizedCommentList/VirtualizedCommentList'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import * as s from './CommentSection.module.scss'

export const CommentSection = () => {
	const [activeReplyId, setActiveReplyId] = useState<string | null>(null)

	const { isLoading } = useGetCommentsQuery()

	const commentTree = useSelector(selectRootCommentsWithReplies)

	return (
		<main className={s.container}>
			<div className={s.container_inner}>
				<h1 className={s.container_inner_title}>Comments</h1>
				<UserCommentForm />

				{isLoading ? (
					[...Array(3)].map((_, idx) => <SkeletonComment key={idx} />)
				) : commentTree.length === 0 ? (
					<NotFound />
				) : (
					<VirtualizedCommentList
						commentTree={commentTree}
						activeReplyId={activeReplyId}
						setActiveReplyId={setActiveReplyId}
					/>
				)}
			</div>
		</main>
	)
}
