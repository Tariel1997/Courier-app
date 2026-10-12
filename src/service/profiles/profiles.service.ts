import type { User, UserProfileData } from '@/types/user.types'

import {
  createResourceClient,
  type ResourceRecord,
} from '../resource/resource-client'

// The API has no endpoints to update or delete accounts, so edits and removals
// are stored as an override record that is merged on top of the base account
export interface ProfileOverride {
  userId: number
  firstName?: string
  lastName?: string
  data?: UserProfileData
  deleted?: boolean
}

export type ProfilePatch = Omit<ProfileOverride, 'userId'>

const profilesClient = createResourceClient<ProfileOverride>('account-profiles')

const findRecord = (records: ResourceRecord<ProfileOverride>[], userId: number) =>
  records.find((record) => Number(record.data.userId) === userId)

export const getProfileOverrides = async () => {
  const records = await profilesClient.list()
  return new Map(records.map(({ data }) => [Number(data.userId), data]))
}

export const getProfileOverride = async (userId: number) =>
  findRecord(await profilesClient.list(), userId)?.data

export const saveProfileOverride = async (userId: number, patch: ProfilePatch) => {
  const existing = findRecord(await profilesClient.list(), userId)

  if (!existing) {
    const [created] = await profilesClient.create([{ userId, ...patch }])
    return created.data
  }

  const next: ProfileOverride = {
    ...existing.data,
    ...patch,
    data: { ...existing.data.data, ...patch.data },
  }
  await profilesClient.update(existing.id, next)
  return next
}

export const applyProfileOverride = (
  user: User,
  override?: ProfileOverride,
): User => {
  if (!override) return user

  return {
    ...user,
    firstName: override.firstName ?? user.firstName,
    lastName: override.lastName ?? user.lastName,
    data: { ...user.data, ...override.data },
  }
}
