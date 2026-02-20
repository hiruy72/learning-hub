"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLikeBlog } from "@/actions/blog";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
    blogId: string;
    initialLikes: number;
    initialIsLiked: boolean;
}

export function LikeButton({ blogId, initialLikes, initialIsLiked }: LikeButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikes);

    const handleToggleLike = () => {
        // Optimistic UI update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

        startTransition(async () => {
            try {
                await toggleLikeBlog(blogId);
            } catch (error) {
                // Revert on error
                setIsLiked(isLiked);
                setLikesCount(likesCount);
                console.error("Failed to toggle like:", error);
            }
        });
    };

    return (
        <Button
            variant="ghost"
            onClick={handleToggleLike}
            disabled={isPending}
            className={cn(
                "flex items-center gap-2 group transition-all rounded-none",
                isLiked ? "text-white" : "text-gray-500 hover:text-white"
            )}
        >
            <Heart
                className={cn(
                    "h-5 w-5 transition-transform duration-300 group-active:scale-125",
                    isLiked && "fill-white text-white"
                )}
            />
            <span className="text-xs font-bold font-mono">{likesCount}</span>
        </Button>
    );
}
