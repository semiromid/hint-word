const 
  gulp = require('gulp'),
  rename = require("gulp-rename"),
  gulp_watch = require('gulp-watch'),
  livereload = require('gulp-livereload'),
  plumber = require('gulp-plumber'),
  uglify = require('gulp-uglify'),
  htmlmin = require('gulp-htmlmin'), 
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  cssnano = require('cssnano'),
  autoprefixer = require('gulp-autoprefixer'),
  uglifyes = require('uglify-es'),
  composer = require('gulp-uglify/composer'),
  minifyJS = composer(uglifyes, console), 
  concat = require('gulp-concat');




const 
  SASS_name_1 = "SASS_1",
  SASS_input_1 = "src/sass/**/*.scss", 
  SASS_output_1 = "src/css/",

  CSS_name_1 = "CSS_1",  
  CSS_input_1 = "src/css/**/*.css", 
  CSS_output_1 = "basic/public_html/build/css/"

  JS_name_1 = "JS_1",  
  JS_input_1 = "src/js/**/*.js", 
  JS_output_1 = "basic/public_html/build/js/";




// HTML
/***
Minification guide by html:
https://www.npmjs.com/package/html-minifier
http://kangax.github.io/html-minifier/
http://perfectionkills.com/experimenting-with-html-minifier/
***/
function minify_html(taskname, input, output){
  gulp.task(taskname, function() {
    return gulp.src(input)
        .pipe(gulp_watch(input, { verbose: true, "ignoreInitial": false}, function(f){
          //console.clear();
          //console.log(f.path);
          //console.log('=============== [Compilide started!] ===============');
        }))
        .pipe(plumber())    
        .pipe(htmlmin({
                    collapseWhitespace: true, // Remove spaces between tags
                    removeComments: true, // Remove comments
                    removeScriptTypeAttributes: true, // Remove type="text/javascript" from script tags. Other type attribute values are left intact
                    includeAutoGeneratedTags: false,
                    ignoreCustomComments: [ // Ignore noindex comments
                        /^noindex/,
                        /\/noindex+$/
                    ], 
                    minifyJS: true, // Minify JS
                    minifyCSS: true, // Minify JS
                    trimCustomFragments: true,
                    //ignoreCustomFragments: [ (/\{\%[^\%]*?\%\}(\s)?/g) ], // Ignoring tag
                 }))
        .pipe(gulp.dest(output))
        .pipe(livereload());
  });

  //gulp.series(gulp.task(taskname))();
  gulp.start(taskname);
}



// SASS
gulp.task(SASS_name_1, function() {
  return gulp.src(SASS_input_1)
    .pipe(plumber()) 
    .pipe(sass().on('error', sass.logError))                 
    .pipe(gulp.dest(SASS_output_1));
});



// CSS
gulp.task(CSS_name_1, function() {
  const plugins = [
      cssnano({zindex: false, reduceIdents: false})
  ];

  return gulp.src(CSS_input_1)
    .pipe(plumber()) 
    .pipe(autoprefixer())
    .pipe(postcss(plugins))   
    .pipe(rename(function (path) {
      path.basename += "-min";
    }))               
    .pipe(gulp.dest(CSS_output_1))    
    .pipe(livereload());
});



// JS
gulp.task(JS_name_1, function() {
  return gulp.src(JS_input_1)
    //.pipe(gulp_watch(JS_input_1, { verbose: true, "ignoreInitial": false}, function(f){
      //console.clear();
      //console.log(f.path);
      //console.log('=============== [Compilide started!] ===============');
    //}))   
    .pipe(plumber()) 
    .pipe(minifyJS())
    .pipe(concat('index-min.js'))
    .pipe(gulp.dest(JS_output_1))
    .pipe(livereload());
});



// WATCH
gulp.task('watch', function () {
    livereload.listen();

    gulp.watch('src/js/**/*.js', gulp.series(JS_name_1));

    gulp.watch('src/sass/**/*.scss', gulp.series(SASS_name_1, CSS_name_1));

});



gulp.task('w', gulp.series('watch'));
