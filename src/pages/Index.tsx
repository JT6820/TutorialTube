"use client";

import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import YouTubeInput from "@/components/YouTubeInput";
import TutorialDisplay from "@/components/TutorialDisplay";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

// Define the type for a tutorial step
interface TutorialStep {
  step: number;
  description: string;
}

const Index = () => {
  const [tutorialContent, setTutorialContent] = useState<TutorialStep[]>([]);
  const [videoTitle, setVideoTitle] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvertVideo = async (url: string) => {
    setIsLoading(true);
    setTutorialContent([]); // Clear previous tutorial
    setVideoTitle(undefined); // Clear previous title

    toast.loading("Processing video and generating tutorial...", { id: "conversion-toast" });

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('convert-youtube', {
        body: { youtubeUrl: url },
      });

      if (error) {
        throw error;
      }

      if (data && data.tutorial) {
        setTutorialContent(data.tutorial);
        setVideoTitle(data.videoTitle || "Generated Tutorial");
        toast.success("Tutorial generated successfully!", { id: "conversion-toast" });
      } else {
        toast.error("Failed to generate tutorial: No data received.", { id: "conversion-toast" });
      }
    } catch (error: any) {
      console.error("Error converting video:", error);
      toast.error(`Failed to generate tutorial: ${error.message || "An unknown error occurred."}`, { id: "conversion-toast" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-background p-4">
      <div className="text-center mb-8">
        <img src="/logo.png" alt="Tutorial Tube Logo" className="mx-auto mb-4 w-48 h-auto" />
        <h1 className="text-4xl font-bold mb-2 text-foreground">Tutorial Tube</h1>
        <p className="text-xl text-muted-foreground">
          Convert YouTube video tutorials into easy-to-follow step-by-step guides.
        </p>
      </div>

      <YouTubeInput onConvert={handleConvertVideo} isLoading={isLoading} />
      <TutorialDisplay tutorial={tutorialContent} videoTitle={videoTitle} />

      <MadeWithDyad />
    </div>
  );
};

export default Index;
