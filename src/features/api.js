import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
  tagTypes: ['Ticket','Comment','User','Operation'],
  endpoints: (builder) => ({
    // auth
    login: builder.mutation({
      query: (body) => ({ url: '/login', method: 'POST', body })
    }),

    // tickets
    getTickets: builder.query({
      query: ({ ownerId, filters } = {}) => {
        const params = new URLSearchParams()
        params.set('_sort', 'createdAt')
        params.set('_order', 'desc')
        params.set('_embed', 'comments')
        if (filters?.q) params.set('title_like', filters.q)
        if (filters?.category && filters.category !== 'all') params.set('category', filters.category)
        if (filters?.status && filters.status !== 'all') params.set('status', filters.status)
        if (ownerId) params.set('ownerId', ownerId)
        return `/tickets?${params.toString()}`
      },
      providesTags: (result) => result ? [
        ...result.map(t => ({ type: 'Ticket', id: t.id })),
        { type: 'Ticket', id: 'LIST' }
      ] : [{ type: 'Ticket', id: 'LIST' }]
    }),
    getTicket: builder.query({
      // IMPORTANT: ensure id is number-like string support
      query: (id) => `/tickets/${id}?_embed=comments`,
      providesTags: (result, error, id) => [{ type: 'Ticket', id }]
    }),
    addTicket: builder.mutation({
      query: (body) => ({ url: '/tickets', method: 'POST', body }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }]
    }),
    patchTicket: builder.mutation({
      query: ({ id, ...patch }) => ({ url: `/tickets/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (r,e,{id}) => [{ type: 'Ticket', id }]
    }),

    // comments
    addComment: builder.mutation({
      query: (body) => ({ url: '/comments', method: 'POST', body }),
      invalidatesTags: (r,e,{ ticketId }) => [{ type: 'Ticket', id: ticketId }, { type:'Comment', id:'LIST' }]
    }),

    // operations
    getOperations: builder.query({
      query: (ticketId) => `/operations?ticketId=${ticketId}&_sort=createdAt&_order=desc`,
      providesTags: (res,err,ticketId) => res ? [
        ...res.map(o => ({ type:'Operation', id:o.id })),
        { type:'Operation', id:`T-${ticketId}` }
      ] : [{ type:'Operation', id:`T-${ticketId}` }]
    }),
    addOperation: builder.mutation({
      query: (body) => ({ url:'/operations', method:'POST', body }),
      invalidatesTags: (r,e,{ticketId}) => [{ type:'Operation', id:`T-${ticketId}` }, { type:'Ticket', id: ticketId }]
    })
  })
})

export const {
  useLoginMutation,
  useGetTicketsQuery,
  useGetTicketQuery,
  useAddTicketMutation,
  usePatchTicketMutation,
  useAddCommentMutation,
  useGetOperationsQuery,
  useAddOperationMutation
} = api
