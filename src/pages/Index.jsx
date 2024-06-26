import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );
        const storyIds = await response.json();
        const top5StoryIds = storyIds.slice(0, 5);

        const storyPromises = top5StoryIds.map(async (id) => {
          const storyResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          return storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setFilteredStories(stories);
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center mb-4">Top 5 Hacker News Stories</h1>
      <div className="mb-4">
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        {filteredStories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upvotes: {story.score}</p>
              <Button as="a" href={story.url} target="_blank" rel="noopener noreferrer">
                Read more
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;