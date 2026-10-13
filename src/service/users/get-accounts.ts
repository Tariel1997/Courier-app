import {
  applyProfileOverride,
  getProfileOverrides,
} from '../profiles/profiles.service'
import getUsers from './get-users'

const getAccounts = async () => {
  const [users, overrides] = await Promise.all([getUsers(), getProfileOverrides()])

  return users
    .filter((user) => !overrides.get(user.id)?.deleted)
    .map((user) => applyProfileOverride(user, overrides.get(user.id)))
}

export default getAccounts
