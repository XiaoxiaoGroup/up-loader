fis.match('/node_modules/**', {
    release: false
});
fis.match('/src/**', {
    release: false
});
fis.match('/package.json', {
    release: false
});
fis.match('/rollup.config.js', {
    release: false
});
fis.match('/test/**', {
  release: '$0'
});

fis.match('/test/server.conf', {
  release: '/config/server.conf'
});
