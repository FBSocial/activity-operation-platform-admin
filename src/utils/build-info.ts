import { abbreviatedSha, committerDate, sha } from '~build/git'
import now from '~build/time'

export function logSemanticGitInfo() {
  const gitInfo = {
    SHA: sha,
    'Abbreviated SHA': abbreviatedSha,
    'Committer Date': committerDate,
    'Build Time': now,
  }
  if (import.meta.env.MODE !== 'development') {
    console.log('%cSemantic Git Information:', 'color: blue; font-weight: bold;')
    for (const [key, value] of Object.entries(gitInfo)) {
      console.log(`%c${key}: %c${value}`, 'color: green; font-weight: bold;', 'color: black;')
    }
  }
}
