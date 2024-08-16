"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageInterface } from "./messageList";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ChatInputProps {
  channelId: string;
  messages: MessageInterface[];
  setMessages: Dispatch<SetStateAction<MessageInterface[]>>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ channelId, messages, setMessages }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(formSchema),
  });
  const session = useSession();

  // Generates a unique id. Takes in ids from all message as input
  // Used to push message from user optimistically
  function generateUniqueId(ids: number[]) {
    return ids.reduce((acc, id) => acc + id, 0) % Number.MAX_SAFE_INTEGER;
  }

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const uniqueId = generateUniqueId(messages.map((e) => e.id));
    fetch("/api/channel/" + channelId + "/message", {
      method: "POST",
      body: JSON.stringify({
        content: value.content,
      }),
    }).then((response) => {
      if (!response.ok) {
        setMessages((e) => e.filter((item) => item.id !== uniqueId));
      }
    });
    const newMessage: MessageInterface = {
      id: uniqueId,
      user: {
        name: session.data?.user?.name || "",
        image: session.data?.user?.image || "",
        id: session.data?.user?.id || "",
      },
      content: value.content,
      createdAt: new Date(),
    };
    setMessages([newMessage, ...messages]);
    form.reset();
  };

  useEffect(() => {
    form.setFocus("content")
  }, [form.setFocus])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative h-10 w-full px-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 z-10"
                    variant="ghost">
                    <Send />
                  </Button>
                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="Send a Message"
                    className="py-2 text-md w-full border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent" // Add additional styling as needed
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
