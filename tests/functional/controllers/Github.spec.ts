import { test } from '@japa/runner'
import sinon from 'sinon'
import GithubController from 'App/Controllers/Http/GithubController'
import Redis from '@ioc:Adonis/Addons/Redis'
import { allRepos, publicRepos } from '../../testConstants'

test.group('Github Controller', (group) => {
  group.each.setup(async () => {
    await sinon.restore()
  })

  test('Get all private repositories - Cache miss', async ({ client, assert }) => {
    sinon.stub(Redis, 'get').resolves(null)
    sinon.stub(Redis, 'set').resolves('OK')

    const octokitStub = sinon.stub().resolves({
      data: {
        items: allRepos,
        total_count: 2,
      },
    })

    // Mock GitHub response
    sinon.stub(GithubController.prototype, 'getGitHubConfig').returns({
      request: octokitStub,
    } as any)

    const response = await client.get('/')
    assert.equal(response.status(), 200)
    assert.deepEqual(response.body(), ['repo1', 'repo2'])
  })

  test('Get all private repositories - Cache hit', async ({ client, assert }) => {
    // Mock Redis.get method to simulate cache hit
    sinon.stub(Redis, 'get').resolves(JSON.stringify(['cachedRepo']))
    sinon.stub(Redis, 'set').resolves('OK')

    const response = await client.get('/')
    assert.equal(response.status(), 200)
    assert.deepEqual(response.body(), ['cachedRepo'])
  })

  test('Get all private repositories - No private repos', async ({ client, assert }) => {
    sinon.stub(Redis, 'get').resolves(null)
    sinon.stub(Redis, 'set').resolves('OK')

    const octokitStub = sinon.stub().resolves({
      data: {
        items: publicRepos,
        total_count: 0,
      },
    })
    sinon.stub(GithubController.prototype, 'getGitHubConfig').returns({
      request: octokitStub,
    } as any)

    const response = await client.get('/')
    assert.equal(response.text(), JSON.stringify({ message: 'You have no private repositories' }))
    assert.equal(response.status(), 404)
  })
})
