import { syncUser } from "@/actions/user";
import { redirect } from "next/navigation";
import {
    getUserConversations,
    getAvailableUsers,
    getUserJoinedCommunities,
    getAvailableCommunities
} from "@/actions/chat";
import { ChatClient } from "./ChatClient";

export const dynamic = "force-dynamic";

export default async function ChatPage({
    searchParams,
}: {
    searchParams: Promise<{ conversation?: string; community?: string }>;
}) {
    const user = await syncUser();
    if (!user) redirect("/sign-in");

    const params = await searchParams;

    const [conversations, availableUsers, communities, availableCommunities] = await Promise.all([
        getUserConversations(),
        getAvailableUsers(),
        getUserJoinedCommunities(),
        getAvailableCommunities(),
    ]);

    return (
        <ChatClient
            currentUser={user}
            conversations={conversations}
            availableUsers={availableUsers}
            communities={communities}
            availableCommunities={availableCommunities}
            initialConversationId={params.conversation}
            initialCommunityId={params.community}
        />
    );
}
