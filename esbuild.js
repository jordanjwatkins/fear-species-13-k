const esbuild = require('esbuild')
const { htmlPlugin } = require('@craftamap/esbuild-plugin-html')
const postcss = require('esbuild-postcss');

;(async () => {
  const ctx = await esbuild.context({
    logLevel: 'info',
    entryPoints: ['src/index.js'],
    bundle: true,
    outdir: 'dist',
    metafile: true,
    loader: { '.png': 'file' },
    write: false,
    plugins: [
      postcss(),
      htmlPlugin({
        files: [
          {
            entryPoints: ['src/index.js'],
            filename: 'index.html',
            htmlTemplate: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
            </head>
            <body></body>
            </html>
            `,
          },
        ],
      }),
    ],
  })

  await ctx.watch()

  await ctx.serve({
    servedir: 'dist',
  })

  // ctx.dispose()
})()
