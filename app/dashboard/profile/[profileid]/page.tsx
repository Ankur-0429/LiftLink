'use client'
 
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import UserChannelsList from './channelList';
 
export default function Profile() {
  const {profileid} = useParams<{ profileid: string }>()
  const session = useSession();
 
  return (
    <div className="max-w-screen-lg mx-auto border-l-[1px] border-r-[1px]">
      <UserChannelsList userId={profileid} />
    </div>
  )
}