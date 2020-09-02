//
// build task definitions
//
// run any task with "yarn build ${taskName}"
//

const livereload = require('gulp-livereload')
const { createTask, composeSeries, composeParallel, detectAndRunEntryTask } = require('./task')
const createManifestTasks = require('./manifest')
const createScriptTasks = require('./scripts')
const createStyleTasks = require('./styles')
const createStaticAssetTasks = require('./static')
const createEtcTasks = require('./etc')
const createBraveHTMLTasks = require('../../brave/build/html')
const createBraveManifestTasks = require('../../brave/build/manifest')
const createBraveLocalesTasks = require('../../brave/build/locales')
const createBravePublishTasks = require('../../brave/build/publish')
const { fontsTask, imagesTask, fontsTaskProd, imagesTaskProd } = require('../../brave/build/assets')

const browserPlatforms = [
  'firefox',
  'chrome',
  'brave',
  'opera',
]

defineAllTasks()
detectAndRunEntryTask()

function defineAllTasks () {

  const staticTasks = createStaticAssetTasks({ livereload, browserPlatforms })
  const manifestTasks = createManifestTasks({ browserPlatforms })
  const styleTasks = createStyleTasks({ livereload })
  const scriptTasks = createScriptTasks({ livereload, browserPlatforms })
  const { clean, reload, zip } = createEtcTasks({ livereload, browserPlatforms })

  const braveHTMLTasks = createBraveHTMLTasks()
  const braveManifestTasks = createBraveManifestTasks()
  const bravePublishTasks = createBravePublishTasks()
  const { stringTask, combineTask } = createBraveLocalesTasks()

  // build for development (livereload)
  createTask('dev',
    composeSeries(
      clean,
      styleTasks.dev,
      staticTasks.dev,
      manifestTasks.dev,
      braveHTMLTasks,
      braveManifestTasks,
      stringTask,
      combineTask,
      fontsTask,
      imagesTask,
      composeParallel(
        scriptTasks.dev,
        reload,
      ),
    ),
  )

  createTask('prod:brave',
    composeSeries(
      clean,
      styleTasks.prod,
      staticTasks.prod,
      manifestTasks.prod,
      braveHTMLTasks,
      braveManifestTasks,
      stringTask,
      combineTask,
      fontsTaskProd,
      imagesTaskProd,
      scriptTasks.prod,
      zip,
    ),
  )

  createTask('publish:brave',
    composeSeries(
      bravePublishTasks,
    ),
  )

  // build for test development (livereload)
  createTask('testDev',
    composeSeries(
      clean,
      styleTasks.dev,
      composeParallel(
        scriptTasks.testDev,
        staticTasks.dev,
        manifestTasks.testDev,
        reload,
      ),
    ),
  )

  // build for prod release
  createTask('prod',
    composeSeries(
      clean,
      styleTasks.prod,
      composeParallel(
        scriptTasks.prod,
        staticTasks.prod,
        manifestTasks.prod,
      ),
      zip,
    ),
  )

  // build for CI testing
  createTask('test',
    composeSeries(
      clean,
      styleTasks.prod,
      composeParallel(
        scriptTasks.test,
        staticTasks.prod,
        manifestTasks.test,
      ),
    ),
  )

  // special build for minimal CI testing
  createTask('styles', styleTasks.prod)

}
