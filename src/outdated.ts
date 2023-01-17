import {spawnSync, SpawnSyncReturns} from 'child_process'
import stripAnsi from 'strip-ansi'

const SPAWN_PROCESS_BUFFER_SIZE = 10485760 // 10MiB

export class Outdated {
  stdout = ''
  private status: number | null = null

  public run(
    jsonFlag: string
  ): void {
    try {
      const outdatedOptions: Array<string> = ['outdated']

      const isWindowsEnvironment: boolean = process.platform == 'win32'
      const cmd: string = isWindowsEnvironment ? 'npm.cmd' : 'npm'

      if (jsonFlag === 'true') {
        outdatedOptions.push('--json')
      }

      const result: SpawnSyncReturns<string> = spawnSync(cmd, outdatedOptions, {
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

  public foundOutdated(): boolean {
    // `npm audit` return 1 when it found vulnerabilities
    return this.status === 1
  }

  public strippedStdout(): string {
    return `\`\`\`\n${stripAnsi(this.stdout)}\n\`\`\``
  }
}