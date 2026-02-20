"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlog } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogEditorPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim().toLowerCase()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsLoading(true);
        try {
            await createBlog({
                title,
                content,
                imageUrl,
                tags,
            });
            toast.success("Blog published successfully!");
            router.push("/blogs");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to publish blog");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tighter uppercase italic underline underline-offset-8">THE JOURNAL EDITOR</h1>
                <p className="text-gray-500 uppercase text-[10px] tracking-[0.3em] font-bold mt-4">AAU MENTORSHIP ECOSYSTEM • PUBLICATION SUITE</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="bg-black border-white/10 rounded-none">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="text-xs uppercase tracking-widest text-gray-400">Article Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Article Title</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.G. SURVIVING THE FIRST SEMESTER AT 5-KILO"
                                className="bg-black border-white/10 rounded-none h-14 text-lg font-bold uppercase tracking-tight focus-visible:ring-0 focus-visible:border-white transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Banner Image URL (Optional)</label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="HTTPS://IMAGES.UNSPLASH.COM/..."
                                        className="bg-black border-white/10 rounded-none h-12 text-xs font-mono focus-visible:ring-0 focus-visible:border-white transition-all"
                                    />
                                </div>
                                <div className="h-12 w-12 border border-white/10 flex items-center justify-center bg-white/5">
                                    <ImageIcon className="h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Categorization (Press Enter to add)</label>
                            <div className="min-h-12 p-3 border border-white/10 bg-black flex flex-wrap gap-2 transition-all">
                                {tags.map((tag) => (
                                    <Badge key={tag} className="bg-white text-black rounded-none font-bold uppercase text-[9px] tracking-widest flex items-center gap-1">
                                        {tag}
                                        <X className="h-2 w-2 cursor-pointer" onClick={() => removeTag(tag)} />
                                    </Badge>
                                ))}
                                <input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder={tags.length === 0 ? "E.G. FRESHMAN, ACADEMICS" : ""}
                                    className="bg-transparent border-none outline-none text-[10px] uppercase tracking-widest font-bold flex-1 min-w-[100px]"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black border-white/10 rounded-none">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="text-xs uppercase tracking-widest text-gray-400">Content Engine</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="WRITE YOUR INSIGHTS HERE..."
                            className="min-h-[500px] bg-black border-none rounded-none p-8 text-lg font-light leading-relaxed italic placeholder:text-gray-800 focus-visible:ring-0"
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        Draft saved locally • AAUS-PR01
                    </p>
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            className="rounded-none font-bold tracking-widest text-[10px] uppercase hover:bg-white/5"
                        >
                            Discard
                        </Button>
                        <Button
                            disabled={isLoading}
                            className="bg-white text-black hover:bg-gray-200 h-14 px-12 rounded-none font-black tracking-widest uppercase text-xs transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Publish Article"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
