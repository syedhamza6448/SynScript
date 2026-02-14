import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="container mx-auto py-8 px-4 max-w-xl">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase border-b-[5px] border-neo-cyan pb-3 inline-block">
          Profile
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Update your account settings
        </p>
      </div>
      <ProfileForm user={user} />
    </div>
  )
}
