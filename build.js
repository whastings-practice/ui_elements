import flatten from 'gulp-flatten';
import gulp from 'gulp';
import ignore from 'metalsmith-ignore';
import Metalsmith from 'metalsmith';
import sass from 'metalsmith-sass';
import serve from 'metalsmith-serve';
import templates from 'metalsmith-templates';
import watch from 'metalsmith-watch';

var shouldServe = process.argv[2] === '--serve' || process.argv[2] === 's';

var metalsmith = Metalsmith(__dirname)
  .source('site')
  .use(ignore('*.swp')) // TODO: Why doesn't this work?
  .destination('build')
  .use(sass({
    outputStyle: 'expanded'
  }))
  .use(templates({
    default: 'layout.hbs',
    engine: 'handlebars',
    pattern: '*.html'
  }))
  .use(runGulp);

if (shouldServe) {
  metalsmith
    .use(watch({
      livereload: true
    }))
    .use(serve({
      port: 8000
    }));
}

metalsmith.build(error => {
  if (error) {
    console.log(JSON.stringify(error));
  }
});

function runGulp(files, metalsmith, done) {
  gulp.src('./src/**/*.js')
    .pipe(flatten())
    .pipe(gulp.dest('./build/js'))
    .on('end', done);
}
