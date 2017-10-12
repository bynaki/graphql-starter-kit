/**
 * gulpfile.js
 */

const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const nodemon = require('gulp-nodemon')
const mocha = require('gulp-spawn-mocha')
const newer = require('gulp-newer')
const logger = require('gulp-logger')
const merge = require('merge2')
const {exec} = require('child_process')
const {readFile, remove} = require('fs-extra')
const {join} = require('path')


/**
 * get `package.json`
 */
function packageJson(callback) {
  readFile(join(__dirname, 'package.json'), (err, data) => {
    callback(err, JSON.parse(data.toString()))
  })
}

/**
 * get main in `package.json`
 */
// let main = './dev/app.js'
let main = null
function entryPoint(callback) {
  if(main) {
    process.nextTick(() => {
      callback(undefined, main)
    })
  } else {
    packageJson((err, package) => {
      if(err) {
        callback(err)
        return
      }
      if(package.main) {
        callback(undefined, package.main)
      } else {
        callback(new Error('not exist main in "package.json"'))
      }
    })
  }
}

/**
 * compile typescript
 */
function compileTypescript(project, src) {
  const tsResult = ((src)? gulp.src(src) : project.src())
    .pipe(newer('build'))
    .pipe(logger({
      before: 'compiled typescript .....',
      after: '.....',
    }))
    .pipe(sourcemaps.init())
    .pipe(tsProject())
  return merge([
    tsResult.dts,
    tsResult.js
    .pipe(sourcemaps.write('.', 
      // sourcemap을 제대로 생성하기위해 꼭 필요한 옵션
      {
        includeContent: false,
        sourceRoot: '../',
        mapSources: sourcePath => join('build', sourcePath),
      }
    )),
  ])
}

/**
 * compile typescript
 */
const tsProject = ts.createProject('tsconfig.json')
gulp.task('scripts', () => {
  return compileTypescript(tsProject)
    .pipe(gulp.dest('build'))
})

/**
 * compile ts & copy file
 */
gulp.task('build', ['scripts'], () => {
  return gulp.src(['src/**/**'], {
    base: 'src',
  })
  .pipe(newer('build'))
  .pipe(logger({
    before: 'changed files ......',
    after: '......',
  }))
  .pipe(gulp.dest('build'))
})

/**
 * clear build folder
 */
gulp.task('clear', done => {
  remove(join(__dirname, 'build'), err => {
    if(err) {
      console.error(err.stack)
    } else {
      console.log('success clearing build')
    }
    done()
  })
})

/**
 * test all
 */
gulp.task('test', ['build'], () => {
  return gulp.src('build/test/*.js', {read: false})
  .pipe(mocha({
    // report 종류
    R: 'spec',
  }))
})

/**
 * test.watch
 */
gulp.task('test.watch', ['test'], () => {
  gulp.watch('src/**/**', ['test'])
})

/**
 * start.watch
 */
gulp.task('start.watch', ['build'], done => {
  entryPoint((err, ep) => {
    if(err) {
      done(err)
      return
    }
    const stream = nodemon({
      script: ep,
      ext: '*',
      watch: ['src'],
      tasks: ['build'],
    })
    done(err, stream)
  })
})
