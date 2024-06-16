https://www.ytyng.com/blog/react-next-client-submission-dynamic-ssr/

クライアント入稿されたHTMLに、一部サーバーサイドで動的に変更する要件を、Next で対応するチュートリアルです。

今回のプロジェクトの結果は Github で公開しています。

https://github.com/ytyng/my-customer-submission

デプロイしたサイト: https://my-customer-submission.ytyng.com/

# Next の環境構築

```shell
npx create-next-app@latest --typescript
```

次のように選択していきます。

- project name: my-customer-submission
- Would you like to use ESLint: Yes
- Would you like to use Tailwind CSS?: No
- Would you like to use `src/` directory?:  Yes
- Would you like to use App Router? (recommended): Yes
- Would you like to customize the default import alias: Yes

![画像](https://media.ytyng.com/20240616/acb6c4354442404587d42fa88204159a.png)



## 動作確認

```shell
cd my-customer-submission
npm run dev
```

![画像](https://media.ytyng.com/20240616/807d1714046743e88fd80552dfbd87ce.png)


# 入稿HTML の追加

`src/templates` フォルダを作って、入稿されたHTMLを入れます。

CSS は Bootstrap CDN と手書きの CSS を使っているものとします。

## src/templates/index.html
```html
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>My customer submission</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
        crossorigin="anonymous">
  <link rel="stylesheet" href="./css/site.css">
</head>

<body class="d-flex flex-column h-100">
<header class="site-header d-flex align-items-center">
  <h1 class="flex-grow-1 m-0 p-2">My customer submission</h1>
  <div>
    <button class="btn btn-primary m-2" id="register-button">Register</button>
  </div>
</header>
<div id="center-row" class="flex-grow-1 d-flex">
  <nav class="site-nav p-2">
    nav
  </nav>
  <main class="flex-grow-1">
    <div id="main-content" class="p-3">
      main content
    </div>
  </main>
</div>
<footer class="site-footer p-2">
  Site footer
</footer>
<script src="./js/site.js"></script>
</body>
</html>
```

## src/templates/css/site.css
```css
.site-header {
  background-color: #2b538f;
  color: white;
}

.site-nav {
  background-color: #eee;
  width: 300px;
}

.site-footer {
  background-color: #333;
  color: white;
}
```

## src/templates/js/site.js
```js
document.querySelector('#register-button').addEventListener('click', function() {
  alert('Hello World!');
})
```

![画像](https://media.ytyng.com/20240616/e4871bca38944487b36c9c71881e480c.png)

# 方針

入稿 HTML ファイルから、 `body` の中身だけを抜き出して React のコンポーネントにし、`id="main-content"` のHTMLエレメントを別の React エレメントに差し替えます。

入稿 HTML ファイルには `head` タグがありますが、今回はこれは使わずに独自で head の内容を作ります。
head の内容をパースして使う方法もあると思いますが、今回は行わず、例えば BootStrap を CDN から読み込んでいる箇所は、コピペで `<link>`` タグを作ります。

ブラウザJSがあります。右上の「Register」ボタンを押した時のアクションが登録されています。
これは public 内にそのままコピーしてクライアントに返します。


# ライブラリの準備

## html-react-parser のインストール

HTMLをパースして使うにあたり、`html-react-parser` を使います。

```shell
npm install html-react-parser -D
```


# コンポーネントの追加

[JSONPlaceholder](https://jsonplaceholder.typicode.com) の [posts](https://jsonplaceholder.typicode.com/posts)
を取得して、 Bootstrap の Card コンポーネントで表示する React コンポーネントを作ります。

## src/app/interfaces/posts.ts
```ts
export interface PostData {
  userId: number
  id: number
  title: string
  body: string
}
```

## src/app/components/PostCard.tsx
```tsx
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
```

## src/app/components/PostCards.tsx
```tsx
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
```

# layout.tsx の修正

`layout.tsx` で `html`, `head`, `body` の HTML エレメントを返すようにします。
テンプレートの css はここで import しています。

今回は、link タグなどは 入稿HTMLからパースせず、tsx にハードコーディングしました。

`head` 内の `link` タグや `body` のクラス名は、二重管理になってしまっていますのであまり良くありませんが、
どのような方針が良いかは入稿 HTML の修正頻度やプロジェクトの方針次第になると思います。

## src/app/layout.tsx
```tsx
import type { Metadata } from "next";
import "../templates/css/site.css"

export const metadata: Metadata = {
  title: "My customer submission",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={'h-100'}>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
              crossOrigin="anonymous"/>
      </head>
    <body className={'d-flex flex-column h-100'}>{children}</body>
    </html>
  );
}

```

# page.tsx の修正

入稿HTML を読み込み、正規表現で `body` の中だけを抽出して html-react-parser でパースします。

そして、 `<div id="main-content"></div>` を、`PostCards` コンポーネントに差し替えます。


## src/app/page.tsx
```
'use server'

import fs from 'fs'
import parse from 'html-react-parser'
import PostCards from '@/app/components/PostCards'

/**
 * ファイルの内容をテキストとして取得
 */
async function loadHtmlFile(filePath: string) {
  return fs.promises.readFile(filePath, 'utf8')
}

/**
 * HTMLのbodyタグの中身を取得
 */
function extractBodyContent(html: string) : string {
  const match = /<body[^>]*?>([\s\S]*)<\/body>/.exec(html)
  return match ? match[1] : html
}

/**
 * テンプレート内の <div id="main-content"> を PostCards に置き換える
 */
function replaceElement(domNode: any, index: number) {
  if (domNode.type === "tag" && domNode.name === "div" && domNode.attribs.id === "main-content") {
    return (
      <PostCards />
    )
  }
}

/**
 * テンプレートHTML の Body を JSX.Element として取得
 */
async function getInnerBodyElement() {
  const htmlTemplatePath = "src/templates/index.html"
  const htmlTemplate = await loadHtmlFile(htmlTemplatePath)
  const innerBodyHTML = extractBodyContent(htmlTemplate)
  return parse(innerBodyHTML, {replace: replaceElement})
}

export default async function Home() {
  return await getInnerBodyElement()
}
```

# JSファイルのコピー
入稿された ブラウザJSは、`public/js/` 内にコピーします。

# 動作確認
できました。

![画像](https://media.ytyng.com/20240616/a78ee37cf3dc4210a33add77c71738cd.png)

デプロイしたサイト: https://my-customer-submission.ytyng.com/

生成されたHTMLソースを見ると、SSRできていることが確認できます。

![画像](https://media.ytyng.com/20240616/a04b31ae489a46829079578a75233371.png)
