export interface Comment {
	id: string
	author: {
		name: string
		avatar: string
	}
	content: string
	createdAt: string
	likes: number
	isLikedByUser: boolean
	parentId?: string
	replies?: Comment[]
}

export interface CommentWithReplies extends Comment {
	replies: Comment[]
}
