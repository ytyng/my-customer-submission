import {PostData} from '@/app/interfaces/posts'
import PostCard from './PostCard'

async function getPosts(): Promise<PostData[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  return await res.json()
}

/**
 * ポストのカード複数枚を fetch してから表示するコンポーネント
 */
export default async function Component() {
  const posts = await getPosts()
  return posts.map((post: any) => (
    <PostCard postData={post} key={post.id}/>
  ));
}
