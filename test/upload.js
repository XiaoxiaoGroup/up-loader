module.exports = function(req, res, next) {
    
    res.write('{"success":true,"message":"hello world!"}');

    // set custom header.
    // res.setHeader('xxxx', 'xxx');

    setTimeout(function () {
        res.end();
    }, 3000);
};