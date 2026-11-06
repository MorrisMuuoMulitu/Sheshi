import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'i9s1a5ax',
    dataset: 'production'
  },
  /**
   * Sanity TypeGen: scan lib/ for `defineQuery` usage and generate
   * types into ./sanity.types.ts (run with `npm run typegen`).
   */
  typegen: {
    path: ['./lib/**/*.ts'],
    schema: './schema.json',
    generates: './sanity.types.ts',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: "yc5wxc49hjvlhigq7vilwll3",
  },
})
