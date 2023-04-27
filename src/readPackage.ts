import {spawnSync, SpawnSyncReturns} from 'child_process'
import stripAnsi from 'strip-ansi'

const SPAWN_PROCESS_BUFFER_SIZE = 10485760 // 10MiB

export class ReadPackage {
  stdout = ''
  private status: number | null = null

  public run(): void {
    try {
      const options: Array<string> = ['./package.json']

      const isWindowsEnvironment: boolean = process.platform == 'win32'
      const cmd: string = isWindowsEnvironment ? 'cat' : 'cat'

      const result: SpawnSyncReturns<string> = spawnSync(cmd, options, {
        encoding: 'utf-8',
        maxBuffer: SPAWN_PROCESS_BUFFER_SIZE
      })

      if (result.error) {
        throw result.error
      }
      if (result.status === null) {
        throw new Error('the subprocess terminated due to a signal.')
      }
      if (result.stderr && result.stderr.length > 0) {
        throw new Error(result.stderr)
      }

      this.status = result.status
      this.stdout = result.stdout
    } catch (error) {
      throw error
    }
  }

  public strippedStdout(): string {
    return `\`\`\`\n${stripAnsi(this.stdout)}\n\`\`\``
  }
}