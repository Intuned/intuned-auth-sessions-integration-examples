"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { likeLinkedinPost } from "@/lib/server-actions/like-linkedin-post";

const likePostFormSchema = z.object({
  postUrl: z.string().url(),
});

export function LikePostForm() {
  const likePostForm = useForm({
    defaultValues: {
      postUrl: "",
    },
    resolver: zodResolver(likePostFormSchema),
  });

  async function handlePostLike(values: z.infer<typeof likePostFormSchema>) {
    const likeLinkedinPostResult = await likeLinkedinPost({
      url: values.postUrl,
    });

    if (!likeLinkedinPostResult.success) {
      toast("Failed to like post");
      return;
    }

    toast(likeLinkedinPostResult.message);
  }

  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Like a post</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          Like a post on LinkedIn by providing the URL of the post.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Form {...likePostForm}>
            <form
              className="flex gap-3 items-stretch w-full"
              onSubmit={likePostForm.handleSubmit(handlePostLike)}
            >
              <FormField
                control={likePostForm.control}
                name="postUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Post URL to like"
                        {...field}
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={likePostForm.formState.isSubmitting}
              >
                {likePostForm.formState.isSubmitting ? "Liking..." : "Like"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
