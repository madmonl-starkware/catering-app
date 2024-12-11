import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const topics = [
  "Sport", "Politics", "Tech", "Crypto", "Economics", "Music", "Travel", "Style", "Weather", "Climate", "World", "Science", 
]

export function TopicSelection({ selectedTopicsA, onComplete }: { selectedTopicsA: string[]; onComplete: (selectedTopics: string[]) => void }) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(selectedTopicsA)

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select Your Interests</CardTitle>
        <CardDescription>Choose the topics you'd like to see in your feed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {topics.map(topic => (
            <div key={topic} className="flex items-center space-x-2">
              <Checkbox 
                id={topic} 
                checked={selectedTopics.includes(topic)}
                onCheckedChange={() => handleTopicToggle(topic)}
              />
              <label htmlFor={topic} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {topic}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => {
          onComplete(selectedTopics)
        }} disabled={selectedTopics.length === 0}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}
