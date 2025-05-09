import { API_ROOT } from '@/entities/model/constants'
import { Comment } from '@/entities/model/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const rtkQueryApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: API_ROOT,
	}),
	tagTypes: ['Comment'],
	endpoints: (builder) => ({
		getComments: builder.query<Comment[], void>({
			query: () => 'comments',
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({
								type: 'Comment' as const,
								id,
							})),
							{ type: 'Comment', id: 'LIST' },
						]
					: [{ type: 'Comment', id: 'LIST' }],
		}),
		createComment: builder.mutation<Comment, Partial<Comment>>({
			query: (body) => ({
				url: 'comments',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
		}),
		deleteComment: builder.mutation<void, string>({
			query: (id) => ({
				url: `/comments/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Comment'],
		}),
		updateComment: builder.mutation<Comment, Partial<Comment>>({
			query: ({ id, ...patch }) => ({
				url: `comments/${id}`,
				method: 'PATCH',
				body: patch,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Comment', id }],
		}),
	}),
})

export const {
	useGetCommentsQuery,
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useUpdateCommentMutation,
} = rtkQueryApi
