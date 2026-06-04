export default {
    requireModule: [],
    require: ['support/**/*.js'],
    format: [
        'progress',
        'html:reports/cucumber-report.html',
        'json:reports/cucumber-report.json'
    ],
    paths: ['src/features/**/*.feature']
};