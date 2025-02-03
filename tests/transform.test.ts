import { resolve } from 'node:path'
import { rollupBuild, testFixtures } from '@sxzz/test-utils'
import css from 'rollup-plugin-css-only'
import { describe, it, expect } from 'vitest'
import LightningCSS from '../src/rollup'

describe('transform', async () => {
  await testFixtures(
    ['tests/fixtures/*.css'],
    async (args, id) =>
      (
        await rollupBuild(id, [
          LightningCSS({
            options: {
              minify: true,
              targets: {
                ie: 11,
              },
            },
          }),
          css(),
        ])
      ).snapshot,
    { cwd: resolve(__dirname, '..'), promise: true },
  )
})

describe('CSS Modules', () => {
  it('should transform CSS Modules', async () => {
    const entry = resolve(__dirname, './css-module-fixture/index.js')
    console.log('entry', entry)
    const build = await rollupBuild(entry, [
      LightningCSS({
        options: {
          minify: true,
          targets: {
            ie: 11,
          },
        },
      }),
      css(),
    ])
    expect(build.snapshot).toMatchSnapshot()
  })
})
