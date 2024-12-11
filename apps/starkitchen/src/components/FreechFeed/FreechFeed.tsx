import { useState, useEffect } from 'react'
import { Freech } from '../Freech/Freech';
import { FreechSkeleton } from '../FreechSkeleton';

const dummyFreeches = [
  { id: "1", author: 'Alice', content: 'Just learned about blockchain!', timestamp: '2 hours ago', isFeatured: true, likeCount: 30, isLiked: false, topics: ['Blockchain', 'Technology'] },
  { id: "2", author: 'Bob', content: 'Excited for the future of decentralized apps!', timestamp: '4 hours ago', isFeatured: false, likeCount: 22, isLiked: true, topics: ['DeFi', 'Web3'] },
  { id: "3", author: 'Charlie', content: 'Who wants to build a dApp with me?', timestamp: '1 day ago', isFeatured: true, likeCount: 55, isLiked: false, topics: ['Blockchain', 'Development', 'Collaboration'] },
  { id: "4", author: 'David', content: 'Here\'s an in-depth analysis of the latest crypto trends...', timestamp: '2 days ago', isFeatured: false, likeCount: 40, isLiked: true, topics: ['Cryptocurrency', 'Market Analysis'] },
]

export interface IRawFreech {
  id: BigInt;
  preacher_id: BigInt;
  data: string;
  time: BigInt;
  echo: BigInt;
}

export interface IFreech {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isFeatured: boolean;
  likeCount: number;
  isLiked: boolean;
  topics: string[];
}

interface FreechFeedProps {
  selectedTopics: string[]
  freeches: IFreech[]
  loading: boolean
}

export function FreechFeed({ selectedTopics, freeches, loading }: FreechFeedProps) {
  const filteredFreeches = freeches.filter(freech => 
    selectedTopics.length === 0 || selectedTopics.some(topic => freech.content.toLowerCase().includes(topic.toLowerCase()))
  )

  const featuredFreeches = filteredFreeches.filter(freech => freech.isFeatured)
  const regularFreeches = filteredFreeches.filter(freech => !freech.isFeatured)

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <FreechSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {featuredFreeches.map((freech) => (
        <Freech key={`featured-${freech.id}`} {...freech} isOwnFreech={false} onFeature={() => {}} />
      ))}
      {regularFreeches.map((freech) => (
        <Freech key={`regular-${freech.id}`} {...freech} isOwnFreech={false} onFeature={() => {}} />
      ))}
    </div>
  )
}

