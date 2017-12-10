
module.exports = function(grunt) {
    //Налаштування збірки Grunt
    var config = {
        //Інформацію про проект з файлу package.json
        pkg: grunt.file.readJSON('package.json'),

        //Конфігурація для модуля browserify (перетворює require(..) в код
        browserify:     {
            //Загальні налаштування (grunt-browserify)
            options:      {

                //brfs замість fs.readFileSync вставляє вміст файлу
                transform:  [ require('brfs') ],
                browserifyOptions: {
                    //Папка з корнем джерельних кодів javascript
                    basedir: "www/js/src"
                }
            },

            //Збірка з назвою піца
            pocketDistedu: {
                src:        'www/js/src/index.js',
                dest:       'www/js/main.js'
            }
        }
    };

    //Налаштування відстежування змін в проекті
    var watchDebug = {
        options: {
            'no-beep': true
        },
        //Назва завдання будь-яка
        scripts: {
            //На зміни в яких файлах реагувати
            files: ['www/js/src/**/**', 'www/js/src/**/**'],
            //Які завдання виконувати під час зміни в файлах
            tasks: ['browserify:pocketDistedu']
        }
    };

    //Ініціалузвати Grunt
    config.watch = watchDebug;
    grunt.initConfig(config);

    //Сказати які модулі необхідно виокристовувати
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Список завданнь по замовчування
    grunt.registerTask('default',
        [
            'browserify:pocketDistedu',
            //Інші завдання які необхідно виконати
        ]
    );
};