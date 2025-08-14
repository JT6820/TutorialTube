"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TutorialStep {
  step: number;
  description: string;
}

interface TutorialDisplayProps {
  tutorial: TutorialStep[];
  videoTitle?: string;
}

const TutorialDisplay: React.FC<TutorialDisplayProps> = ({ tutorial, videoTitle }) => {
  if (!tutorial || tutorial.length === 0) {
    return (
      <Card className="w-full max-w-3xl mt-8 p-4 text-center text-muted-foreground">
        <CardContent>
          <p>Your step-by-step tutorial will appear here after conversion.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mt-8 p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {videoTitle ? `Tutorial for "${videoTitle}"` : "Step-by-Step Tutorial"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tutorial.map((item) => (
          <div key={item.step} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
              {item.step}
            </div>
            <p className="flex-grow text-lg text-left">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TutorialDisplay;
