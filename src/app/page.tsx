import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { posts } from "~/server/db/schema";
import { api, HydrateClient } from "~/trpc/server";


const mockUrls = [
  "https://g3ckzr4sph.ufs.sh/f/aOYTnwugKsXAEkfLe9yPTMovpXSZeFLzAJhKaHs0YNqiRBCy",
  "https://g3ckzr4sph.ufs.sh/f/aOYTnwugKsXAiCoOAODHC0uhBeFbw69W8JZUjvdMyp71cQgV",
  "https://g3ckzr4sph.ufs.sh/f/aOYTnwugKsXAM0an5msXwdJoRcgNV5E2TjY0fP7CAneBsqH1"
]


const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url
}));



export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  const posts = await db.query.posts.findMany();
  console.log("posts", posts);

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="">
        <div className="flex flex-wrap gap-4">
          {posts.map((post) => (
            <div key={post.id}>{post.name}</div>
          ))}{
          [...mockImages, ...mockImages, ...mockImages].map(( image ) => (
            <div key={image.id} className="w-48">
              <img src={image.url}/>
            </div>
          ))}
        </div>
        Hello (gallery in progress)
      </main>
    </HydrateClient>
  );
}
