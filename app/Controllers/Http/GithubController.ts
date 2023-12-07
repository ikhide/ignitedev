// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import Config from '@ioc:Adonis/Core/Config'
const { igniteApp } = Config.get('github')

export default class Github {
  public async getPrivateRepositories(): Promise<any> {
    try {
      const octokit = this.getGitHubConfig()
      let fetching = true
      const foundRepos: any[] = []
      let page = 0

      do {
        const { data } = await octokit.request(`Get /search/repositories`, {
          q: `user:${igniteApp.userName}`,
          page,
          per_page: 50,
        })

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { items, total_count } = data

        foundRepos.push(...items)

        fetching = total_count > foundRepos.length
        page++
      } while (fetching)

      const repositories = foundRepos
        .filter((item) => item.private)
        .map((repo) => {
          return { name: repo.name, type: repo.private }
        })

      return repositories
    } catch (error) {
      console.log('error', error)
    }
  }

  private getGitHubConfig() {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: igniteApp.appId,
        privateKey: igniteApp.privateKey,
        installationId: igniteApp.installationId,
      },
    })
  }
}
