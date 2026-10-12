import ProfileCard from '@/components/dashboard/ProfileCard'
import ProfileEditor from '@/features/profile/components/ProfileEditor'
import { profileTemplates } from '@/features/profile/profile-templates'
import { useAuthStore } from '@/store/auth.store'

// Own profile page of an admin, user or courier — the template depends on the role
const ProfilePage = () => {
  const user = useAuthStore((state) => state.user)
  if (!user) return null

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_2fr]">
      <ProfileCard
        user={user}
        subtitle="Email and password cannot be changed"
        extraRows={[
          { label: 'Role', value: <span className="capitalize">{user.role}</span> },
        ]}
      />
      <ProfileEditor
        account={user}
        fields={profileTemplates[user.role]}
        title="Edit profile"
        description="Keep your information up to date"
      />
    </div>
  )
}

export default ProfilePage
