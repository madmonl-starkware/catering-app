import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Freech } from './Freech/Freech'
import { FreechSkeleton } from './FreechSkeleton';
import { toast } from "@/hooks/use-toast";

interface Freech {
  id: string
  content: string
  timestamp: string
  isFeatured: boolean
  likeCount: number
  topics?: string[]
  isLiked: boolean
  marketingBudget?: { total: number; used: number }
}

interface UserProfileProps {
  username: string
  bio: string
  followers: number
  following: number
  freeches: Freech[]
}

export function UserProfile({ username, bio, followers, following, freeches: initialPosts }: UserProfileProps) {
  const [loading, setLoading] = useState(true)
  const [freeches, setFreeches] = useState<Freech[]>([])

  useEffect(() => {
    setTimeout(() => {
      setFreeches(initialPosts)
      setLoading(false)
    }, 3000)
  }, [initialPosts])

  const handleFeaturePost = (id: string, amount: number) => {
    setFreeches(prevPosts => 
      prevPosts.map(freech => 
        freech.id === id ? { 
          ...freech, 
          isFeatured: true, 
          marketingBudget: { total: amount, used: 0 } 
        } : freech
      )
    )

    toast({
      title: "Post Featured",
      description: `You've successfully featured your freech for ${amount} STRK tokens.`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${username}`} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-muted-foreground">{bio}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="font-semibold">{following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <FreechSkeleton key={index} />
          ))
        ) : (
          freeches?.map((freech) => (
            <Freech
              key={freech.id}
              id={freech.id}
              topics={freech.topics ?? []}
              author={username}
              content={freech.content}
              timestamp={freech.timestamp}
              isFeatured={freech.isFeatured}
              isOwnFreech={true}
              likeCount={freech.likeCount}
              isLiked={freech.isLiked}
              marketingBudget={freech.marketingBudget}
              onFeature={handleFeaturePost}
            />
          ))
        )}
      </div>
    </div>
  )
}

