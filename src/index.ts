import { createFilter } from '@rollup/pluginutils'
import { createUnplugin, type UnpluginInstance } from 'unplugin'
import { resolveOption, type Options } from './core/options'
import { resolveId } from './core/resolve-id'
import { transformCss, transformCssModule } from './core/transform'

const plugin: UnpluginInstance<Options | undefined, false> = createUnplugin(
  (rawOptions = {}) => {
    const options = resolveOption(rawOptions)
    const filter = createFilter(options.include, options.exclude)

    const transformedFiles = new Map<string, string>()

    const name = 'unplugin-lightningcss'
    return {
      name,
      enforce: options.enforce,

      transformInclude(id) {
        return filter(id)
      },

      resolveId(id, importer) {
        return resolveId(id, importer!)
      },

      transform(code, id) {
        return transformCss(id, code, options.options)
      },

      load(id) {
        if (id.endsWith('.module_built.css')) {
          const code = transformedFiles.get(id)!
          return {
            id,
            code,
          }
        }
        if (id.endsWith('?css_module')) {
          return transformCssModule(id, options.options).then(
            ({ code, map, exports, id: compiledId }) => {
              transformedFiles.set(compiledId, code)
              return {
                code: `import "${compiledId}";\n${exports}`,
                map,
              }
            },
          )
        }
      },
    }
  },
)

export default plugin
