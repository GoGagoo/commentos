export interface Comment {
	id: string
	author: string
	content: string
	createdAt: string
	avatar: string
	replies?: Comment[]
	parentId?: string | number | null
	likes?: number
	isLikedByUser?: boolean
}
