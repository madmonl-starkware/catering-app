import { Freech } from '../Freech/Freech';
import { FreechSkeleton } from '../FreechSkeleton';

export interface IRawFreech {
  id: BigInt;
  preacher_id: BigInt;
  data: string;
  time: BigInt;
  echos: BigInt;
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

export function FreechFeed({ freeches, loading }: FreechFeedProps) {
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
      {freeches.map((freech) => (
        <Freech key={`featured-${freech.id}`} {...freech} isOwnFreech={false} onFeature={() => {}} />
      ))}
    </div>
  )
}

