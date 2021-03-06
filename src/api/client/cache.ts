import { InMemoryCache } from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        channelsConnection: relayStylePagination(),
        videosConnection: relayStylePagination((args) => {
          // make sure queries asking for a specific category are separated in cache
          const channelId = args?.where?.channelId_eq || ''
          const categoryId = args?.where?.categoryId_eq || ''
          return `${channelId}:${categoryId}`
        }),
      },
    },
    Video: {
      fields: {
        createdAt: {
          merge(_, createdAt: string | Date): Date {
            if (typeof createdAt !== 'string') {
              // TODO: investigate further
              // rarely, for some reason the object that arrives here is already a date object
              // in this case parsing attempt will cause an error
              return createdAt
            }
            return parseISO(createdAt)
          },
        },
      },
    },
  },
})

export default cache
