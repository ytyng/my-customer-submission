import {PostData} from '@/app/interfaces/posts'

/**
 * ポストのカード1枚を表すコンポーネント
 */
export default async function Component({postData}: {postData: PostData}) {
  return (
    <div className={'card my-3 mx-3'}>
      <div className={'card-header'}>
        #{postData.id} {postData.title}
      </div>
      <div className={'card-body p-2'}>
        <div>{postData.body}</div>
      </div>
    </div>
  )
}
