'use client'
 
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
 
export default function Profile() {
  const {profileid} = useParams<{ profileid: string }>()
  const session = useSession();
  const currentUserId = session.data?.user?.id;
 
  return (
    <div className="max-w-screen-lg mx-auto border-l-[1px] border-r-[1px]">
      <div>{profileid}</div>
    </div>
  )
}