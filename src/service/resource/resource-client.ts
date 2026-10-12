import $api from '@/api'
import { ENDPOINTS } from '@/config'

export interface ResourceRecord<TData> {
  id: string
  resource: string
  data: TData
  createdAt: string
  updatedAt: string
}

// Typed wrapper around the backend's generic json `resource` CRUD.
// The API ignores unknown query filters, so filtering happens on the client.
export const createResourceClient = <TData extends object>(resource: string) => ({
  list: async () => {
    const { data } = await $api.get<ResourceRecord<TData>[]>(
      ENDPOINTS.RESOURCE(resource),
    )
    return data
  },

  create: async (items: TData[]) => {
    const { data } = await $api.post<ResourceRecord<TData>[]>(
      ENDPOINTS.RESOURCE(resource),
      { data: items },
    )
    return data
  },

  // The backend replaces the whole `data` object
  update: async (id: string, item: TData) => {
    await $api.put(ENDPOINTS.RESOURCE_ID(resource, id), { data: item })
  },

  remove: async (id: string) => {
    await $api.delete(ENDPOINTS.RESOURCE_ID(resource, id))
  },
})
