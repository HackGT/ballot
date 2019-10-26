const gulp = require("gulp");
const install = require('gulp-install');
const shell = require('gulp-shell');

// Tasks relating build
gulp.task('build:server', shell.task('cd server && npm run build'));

gulp.task('build:client', shell.task('cd client && npm run build'));

gulp.task('build', gulp.series(
    'build:server',
    'build:client',
));

// Tasks relating dependencies
gulp.task('dependencies:client', () => {
    return gulp.src(['./client/package.json']).pipe(install());
});

gulp.task('dependencies:server', () => {
    return gulp.src(['./server/package.json']).pipe(install());
});

gulp.task('dependencies', gulp.series(
    'dependencies:client',
    'dependencies:server',
));

// Postinstall
gulp.task('postinstall', gulp.series(
    'dependencies',
    'build',
));

// Default task
gulp.task('default', gulp.parallel('dependencies'));