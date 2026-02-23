import { syncUser } from "@/actions/user";
import { redirect } from "next/navigation";
import { getUserConversations, getAvailableUsers, getUserJoinedCommunities } from "@/actions/chat";
import { ChatClient } from "./ChatClient";

export default async function ChatPage({
    searchParams,
}: {
    searchParams: Promise<{ conversation?: string; community?: string }>;
}) {
    const user = await syncUser();
    if (!user) redirect("/sign-in");

    const params = await searchParams;
    
    const [conversations, availableUsers, communities] = await Promise.all([
        getUserConversations(),
        getAvailableUsers(),
        getUserJoinedCommunities(),
    ]);

    return (
        <ChatClient
            currentUser={user}
            conversations={conversations}
            availableUsers={availableUsers}
            communities={communities}
            initialConversationId={params.conversation}
            initialCommunityId={params.community}
        />
    );
}
