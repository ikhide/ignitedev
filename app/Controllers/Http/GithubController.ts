import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import Config from '@ioc:Adonis/Core/Config'
import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'

const { igniteApp } = Config.get('github')
const REDIS_KEY = 'repositories'

export default class Github {
  public async getPrivateRepositories(ctx: HttpContextContract): Promise<any> {
    try {
      // FETCH DATA FROM CACHE
      let repositories = await Redis.get(REDIS_KEY)
      if (repositories) {
        return ctx.response.status(200).json(JSON.parse(repositories))
      }

      const octokit = this.getGitHubConfig()
      let fetching = true
      const foundRepos: any[] = []
      let page = 0

      // GET ALL PRIVATE REPOSITORIES
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

      repositories = foundRepos
        ?.filter((item) => item.private)
        .map((repo) => {
          return { name: repo.name, type: repo.private }
        })

      await Redis.set(REDIS_KEY, JSON.stringify(repositories))
      await Redis.expire(REDIS_KEY, 300) // Set TTL to 5 minutes (300 seconds)

      return ctx.response.status(200).json(repositories)
    } catch (error) {
      Logger.error('Error in Github.getPrivateRepositories', error)
      return ctx.response.status(500).json({ error: 'Internal Server Error' })
    }
  }

  //CONNECT TO GITHUB APP
  private getGitHubConfig(): Octokit {
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
