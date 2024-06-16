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
