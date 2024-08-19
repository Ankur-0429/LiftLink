'use client'
 
import { useParams } from 'next/navigation'
import UserChannelsList from './channelList';
import User, { UserInterface } from './User';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
 
export default function Profile() {
  const {profileid} = useParams<{ profileid: string }>() 
  const [user, setUser] = useState(null as null | UserInterface);

  useEffect(() => {
    const fetchData = async() => {
      const res = await fetch("/api/profile/" + profileid, {
        method: "GET"
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    }
    fetchData();
  }, [profileid])

  return (
    <div className="max-w-screen-lg mx-auto border-l-[1px] border-r-[1px]">
      {user && <User {...user} />}
      <Separator />
      <UserChannelsList userId={profileid} />
    </div>
  )
}