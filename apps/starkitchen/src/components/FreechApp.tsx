'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header/Header';
import { FreechFeed, IRawFreech } from '@/components/FreechFeed/FreechFeed';
import { TopicSelection } from '@/components/TopicSelection';
import { UserProfile } from '@/components/UserProfile';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAccount, useReadContract } from '@starknet-react/core';
import { ABI, CONTRACT_ADDRESS } from '../utils/consts';

const dummyUserData = {
  username: 'JohnDoe',
  bio: 'Blockchain enthusiast and developer',
  followers: 1337,
  following: 42,
  freeches: [
    {
      id: '1',
      content: 'Just deployed my first smart contract!',
      timestamp: '2 hours ago',
      isFeatured: false,
      viewCount: 120,
      likeCount: 15,
      isLiked: false,
    },
    {
      id: '2',
      content: 'Thoughts on the latest DeFi trends?',
      timestamp: '1 day ago',
      isFeatured: true,
      viewCount: 500,
      likeCount: 42,
      isLiked: true,
    },
    {
      id: '3',
      content: 'Working on a new blockchain project. Stay tuned!',
      timestamp: '3 days ago',
      isFeatured: false,
      viewCount: 300,
      likeCount: 28,
      isLiked: false,
    },
  ],
};

export const FreechApp = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showTopicSelection, setShowTopicSelection] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const starknetWallet = useAccount();
  const { data: lastPostOffset } = useReadContract({
    functionName: 'get_last_post_offset',
    abi: ABI,
    address: CONTRACT_ADDRESS,
    args: [],
  });
  const { data: freeches, refetch: refetchFreeches } = useReadContract({
    functionName: 'fetch_posts',
    enabled: false,
    abi: ABI,
    address: CONTRACT_ADDRESS,
    args: [Math.max(0, Number(lastPostOffset) - 10), Number(lastPostOffset)],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeches = async () => {
      await refetchFreeches();
      setLoading(false);
    };
    if (lastPostOffset) {
      fetchFreeches();
    }
  }, [lastPostOffset]);

  useEffect(() => {
    const userFreechTopicsLocalStorage = JSON.parse(
      localStorage.getItem('user_freech_topics')!,
    );

    if (!userFreechTopicsLocalStorage?.topics?.length) {
      setShowTopicSelection(true);
      setShowUserProfile(false);
    } else {
      setSelectedTopics(userFreechTopicsLocalStorage.topics);
      setShowTopicSelection(false);
      setShowUserProfile(true);
    }
  }, []);

  const handleTopicSelectionComplete = (topics: string[]) => {
    setSelectedTopics(topics);
    setShowTopicSelection(false);
    localStorage.setItem('user_freech_topics', JSON.stringify({ topics }));
  };

  const handleProfileClick = () => {
    setShowUserProfile(true);
    setShowTopicSelection(false);
  };

  const handleTopicsClick = () => {
    setShowUserProfile(false);
    setShowTopicSelection(true);
  };

  const handleBackToFeed = () => {
    setShowUserProfile(false);
  };

  const onConnectWallet = async () => {
    setLoading(false);
  };

  console.log(freeches);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onProfileClick={handleProfileClick}
        onTopicsClick={handleTopicsClick}
        onConnectWallet={onConnectWallet}
        wallet={starknetWallet}
      />
      <main className="container mx-auto px-4 py-8">
        {showTopicSelection ? (
          <TopicSelection
            selectedTopicsA={selectedTopics}
            onComplete={handleTopicSelectionComplete}
          />
        ) : showUserProfile ? (
          <>
            <Button
              onClick={handleBackToFeed}
              className="mb-6 hover:bg-secondary"
              variant="ghost"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feed
            </Button>
            <UserProfile {...dummyUserData} />
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Freech Feed</h2>
            <FreechFeed
              loading={loading}
              freeches={
                (freeches as IRawFreech[])?.map(
                  ({ data, echos, id, preacher_id, time }) => ({
                    author: `0x${preacher_id.toString(16)}`,
                    content: data,
                    timestamp: time as any,
                    isFeatured: false,
                    isLiked: false,
                    likeCount: Number(echos),
                    topics: ['Sport', 'World', 'Health'],
                    id: id.toString(),
                  }),
                ) ?? []
              }
              selectedTopics={selectedTopics}
            />
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
};
