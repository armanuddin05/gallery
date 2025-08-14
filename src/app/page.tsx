import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic"; // Force dynamic rendering  




export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => [desc(model.id)],
  });

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="">
        <div className="flex flex-wrap gap-4">
          {[...images, ...images, ...images].map(( image, index ) => (
            <div key={image.id + "-" + index} className="w-48">
              <img src={image.url}/>
            </div>
          ))}
        </div>
        Hello (gallery in progress)
      </main>
    </HydrateClient>
  );
}
