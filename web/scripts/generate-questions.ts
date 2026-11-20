import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseQuestionFiles, renderQuestionsModule } from './questionFiles.ts'

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const questionsDir = resolve(webRoot, '../authoring/questions')

const files = readdirSync(questionsDir)
  .filter((name) => name.endsWith('.md') && name !== 'README.md')
  .sort()
  .map((name) => ({
    path: `authoring/questions/${name}`,
    text: readFileSync(resolve(questionsDir, name), 'utf8'),
  }))

const questions = parseQuestionFiles(files)
writeFileSync(
  resolve(webRoot, 'src/questions.generated.ts'),
  renderQuestionsModule(questions),
)
console.log(`Generated ${questions.length} approved questions.`)
