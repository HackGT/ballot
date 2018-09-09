const gulp = require("gulp");
const gutil = require("gulp-util");
const tslint = require("gulp-tslint");
const ts = require("gulp-typescript");
const webpack = require("webpack");
const nodemon = require('nodemon');
const path = require('path');

const tsProject = ts.createProject('./src/tsconfig.json');

gulp.task('watch', (done) => {
    gulp.watch('src/**/*', ['lint', 'build:server']);
});

gulp.task('build', [
    'lint',
    'build:server',
]);

gulp.task('lint', () => {
    return gulp.src(['src/**/*.ts', 'src/**/*.tsx'])
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report({
            emitError: false
        }));
});

gulp.task('build:server', () => {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('build/'));
});

// gulp.task('build:client', () => {
//     webpack(webpackConfig, function (err, stats) {
//         if (err) throw new gutil.PluginError("webpack", err);
//         gutil.log("[webpack]", stats.toString({
//             colors: true
//         }))
//     });
// });

gulp.task('serve',
    [
        'lint',
        'build:server'
    ], () => {
    nodemon({
        script: path.join(__dirname, 'build/app.js'),
        watch: ['build/'],
        ignore: ['build/public'],
        env: {
            'NODE_ENV': 'dev'
        }
    }).on('start', function () {
        gutil.log(gutil.colors.blue('Server started!'));
    });
});

gulp.task('default', ['serve', 'watch']);