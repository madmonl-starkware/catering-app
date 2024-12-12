import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Star, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useSendTransaction, useContract } from '@starknet-react/core';
import { Badge } from '../ui/badge';
import { ABI, CONTRACT_ADDRESS } from '@/utils/consts';

interface FreechProps {
  id: string;
  topics: string[];
  author: string;
  content: string;
  timestamp: string;
  isFeatured: boolean;
  isOwnFreech: boolean;
  likeCount: number;
  isLiked: boolean;
  marketingBudget?: { total: number; used: number };
  onFeature: (id: string, amount: number) => void;
}

export function Freech({
  id,
  author,
  content,
  timestamp,
  isFeatured,
  isOwnFreech,
  likeCount,
  marketingBudget,
  topics,
  onFeature,
}: FreechProps) {
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const [featureAmount, setFeatureAmount] = useState('');

  const handleFeaturePost = () => {
    const amount = parseFloat(featureAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount of STRK tokens.',
        variant: 'destructive',
      });
      return;
    }
    onFeature(id, amount);
    setIsFeatureDialogOpen(false);
    toast({
      title: 'Post featured',
      description: `You've successfully featured your post for ${amount} STRK tokens.`,
    });
  };

  const { contract } = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  });

  const calls = useMemo(() => {
    return [contract.populate('like', [id])];
  }, []);

  const { sendAsync } = useSendTransaction({
    calls,
  });

  const handleLike = () => {
    alert('Liked!');
    sendAsync();
  };

  const getApproxUSD = (strk: number) => (strk * 0.5).toFixed(2);
  const getApproxViews = (strk: number) => Math.round(strk * 50);

  return (
    <Card className={`mb-4 ${isFeatured ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${author}`}
            alt={author}
          />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{timestamp}</p>
        </div>
        {isFeatured && (
          <div className="ml-auto flex items-center">
            <Star className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium">Featured</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {topics.map(interest => (
            <Badge key={interest} variant="secondary">
              <Tag className="h-3 w-3 mr-1" />
              {interest}
            </Badge>
          ))}
        </div>
        {isFeatured && marketingBudget && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Marketing Budget</p>
            <Progress
              value={(marketingBudget.used / marketingBudget.total) * 100}
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {marketingBudget.used} / {marketingBudget.total} STRK used
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={'text-primary'}
        >
          <Heart className={`mr-2 h-4 w-4`} />
          {likeCount}
        </Button>
        {isOwnFreech && !isFeatured && (
          <Dialog
            open={isFeatureDialogOpen}
            onOpenChange={setIsFeatureDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Star className="mr-2 h-4 w-4" />
                Feature
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Feature Your Post</DialogTitle>
                <DialogDescription>
                  Enter the amount of STRK tokens you want to spend to feature
                  this post.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    value={featureAmount}
                    onChange={e => setFeatureAmount(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter STRK amount"
                  />
                </div>
                {featureAmount && !isNaN(parseFloat(featureAmount)) && (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Approx. ${getApproxUSD(parseFloat(featureAmount))} USD
                    </p>
                    <p>
                      Estimated {getApproxViews(parseFloat(featureAmount))} post
                      views
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleFeaturePost}>Feature Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
