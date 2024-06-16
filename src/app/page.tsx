'use server'
import fs from 'fs'
import parse from 'html-react-parser'


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
 * テンプレートHTML の Body を JSX.Element として取得
 */
async function getInnerBodyElement() {
  const htmlTemplatePath = "src/templates/index.html"
  const htmlTemplate = await loadHtmlFile(htmlTemplatePath)
  const innerBodyHTML = extractBodyContent(htmlTemplate)
  return parse(innerBodyHTML)
}

export default async function Home() {
  return await getInnerBodyElement()
}
