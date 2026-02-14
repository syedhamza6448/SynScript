'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserPlus, UserMinus } from 'lucide-react'
import { inviteMember } from '@/app/actions/members'

type Role = 'contributor' | 'viewer'

export function InviteMemberDialog({
  vaultId,
  vaultName,
}: {
  vaultId: string
  vaultName: string
}) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('contributor')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await inviteMember(vaultId, email, role)
      if (error) throw new Error(error)
      setOpen(false)
      setEmail('')
      setRole('contributor')
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite to {vaultName}</DialogTitle>
            <DialogDescription>
              Invite a collaborator by email. They must have an account to be added.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collaborator@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex gap-4 flex-wrap">
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 border-[3px] border-neo-black font-bold transition-colors ${role === 'contributor' ? 'bg-neo-yellow' : 'bg-neo-white hover:bg-neo-gray'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="contributor"
                    checked={role === 'contributor'}
                    onChange={() => setRole('contributor')}
                    className="sr-only"
                  />
                  Contributor (can add/edit)
                </label>
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 border-[3px] border-neo-black font-bold transition-colors ${role === 'viewer' ? 'bg-neo-yellow' : 'bg-neo-white hover:bg-neo-gray'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="viewer"
                    checked={role === 'viewer'}
                    onChange={() => setRole('viewer')}
                    className="sr-only"
                  />
                  Viewer (read-only)
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Inviting...' : 'Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
