export const privateRepos = [
  { name: 'repo1', private: true },
  { name: 'repo2', private: true }, // This one should be filtered out
]

export const publicRepos = [
  { name: 'repo3', private: false },
  { name: 'repo4', private: false }, // This one should be filtered out
]

export const allRepos = [...privateRepos, ...publicRepos]
