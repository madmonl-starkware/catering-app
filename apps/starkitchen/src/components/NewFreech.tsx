import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface NewFreechProps {
  onPublish: (content: string) => void
  username: string
}

export function NewFreech({ onPublish, username }: NewFreechProps) {
  const [content, setContent] = useState('')

  const handlePublish = () => {
    if (content.trim()) {
      onPublish(content)
      setContent('')
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${username}`} alt={username} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{username}</h3>
          <p className="text-sm text-muted-foreground">Share your thoughts</p>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full resize-none"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handlePublish} disabled={!content.trim()}>
          Publish Freech
        </Button>
      </CardFooter>
    </Card>
  )
}
