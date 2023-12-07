import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import Config from '@ioc:Adonis/Core/Config'
import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'

const { igniteApp } = Config.get('github')
const REDIS_KEY = 'repositories'

export default class Github {
  public async getPrivateRepositories(ctx: HttpContextContract): Promise<void> {
    try {
      // FETCH DATA FROM CACHE
      const cachedRepositories = await Redis.get(REDIS_KEY)
      if (cachedRepositories) {
        return ctx.response.status(200).json(JSON.parse(cachedRepositories))
      }

      const octokit = this.getGitHubConfig()
      let fetching = true
      const foundRepos: any[] = []
      let page = 0

      do {
        const { data } = await octokit.request(`Get /search/repositories`, {
          q: `user:${igniteApp.userName}`,
          page,
          per_page: 100,
        })

        const { items, total_count: totalCount } = data

        foundRepos.push(...items)

        fetching = totalCount > foundRepos.length
        page++
      } while (fetching)

      // FIND ALL PRIVATE REPOSITORIES
      const repositories = foundRepos
        ? foundRepos.filter((repo) => repo.private).map((repo) => repo.name)
        : []

      if (!repositories.length)
        return ctx.response.status(404).json({ message: 'You have no private repositories' })

      await Redis.set(REDIS_KEY, JSON.stringify(repositories)) // Save result to cache
      await Redis.expire(REDIS_KEY, 300) // Set TTL to 5 minutes (300 seconds)

      return ctx.response.status(200).json(repositories)
    } catch (error) {
      Logger.error('Error in Github.getPrivateRepositories', error)
      return ctx.response.status(500).json({ error: error.message || 'Internal Server Error' })
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
