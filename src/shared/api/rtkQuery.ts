import { Comment } from '@/entities/model/types'
import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axiosBaseQuery'

export const rtkQueryApi = createApi({
	reducerPath: 'api',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Comments'],
	endpoints: (builder) => ({
		getComments: builder.query<Comment[], void>({
			query: () => ({
				url: 'comments',
				method: 'GET',
			}),
			providesTags: ['Comments'],
		}),
		createComment: builder.mutation<Comment, Partial<Comment>>({
			query: (body) => ({
				url: 'comments',
				method: 'POST',
				data: {
					...body,
					author: body.author || {
						name: 'John Doe',
						avatar: '/images/john-doe.webp',
					},
					createdAt: body.createdAt || new Date().toISOString(),
					likes: body.likes || 0,
					isLikedByUser: body.isLikedByUser || false,
					parentId: body.parentId !== undefined ? body.parentId : null,
				},
			}),
			invalidatesTags: ['Comments'],
		}),
		deleteComment: builder.mutation<void, string>({
			query: (id) => ({
				url: `comments/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Comments'],
		}),
		updateComment: builder.mutation<Comment, Partial<Comment>>({
			query: ({ id, ...patch }) => ({
				url: `comments/${id}`,
				method: 'PATCH',
				data: patch,
			}),
			invalidatesTags: ['Comments'],
		}),
	}),
})

export const {
	useGetCommentsQuery,
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useUpdateCommentMutation,
} = rtkQueryApi
