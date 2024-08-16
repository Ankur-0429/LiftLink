import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    count: number;
}

export const useChatScroll = ({
    chatRef,
    bottomRef,
    count
}:ChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);
    
    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef.current;

        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }
            if (!topDiv) {
                return false;
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 300;
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                });
            }, 100);
        }
    }, [bottomRef, chatRef, count, hasInitialized]);
}