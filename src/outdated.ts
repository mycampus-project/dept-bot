import {spawnSync, SpawnSyncReturns} from 'child_process'
import stripAnsi from 'strip-ansi'
import logger from 'not-a-log'
let columnify = require('columnify')

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
    const json = JSON.parse(this.stdout)
          let majors = []
          for (var dept in json) {
            let current: Number = json[dept]["current"].split(".")[0];
            let latest: Number = json[dept]["latest"].split(".")[0];
            if(latest > current) {
                json[dept].name = dept
              majors.push(json[dept]);
            }
          }
          const formatted = []
          for (var dep in majors) {
            let entry = {
                name: majors[dep]["name"],
                current: majors[dep]["current"],
                wanted: majors[dep]["wanted"],
                latest: majors[dep]["latest"],
                dependent: majors[dep]["dependent"],
            }
            formatted.push(entry)
          }
          const body = columnify(formatted) ;
    return `The following dependencies must be updated manually\n\`\`\`\n${body}\n\`\`\``
  }
}