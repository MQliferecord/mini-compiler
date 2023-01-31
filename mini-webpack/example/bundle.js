(function (modules) {
    function requireModule(id) {

        const {fn,mapping} = modules[id]
        const module = {
            exports: {}
        }
        function localRequire(filePath){
            const id = mapping[filePath]
            return requireModule(id)
        }
        fn(localRequire, module, module.exports)

        return module.exports
    }
    requireModule(0)
})({
    0: [function (requireModule, module, exports){
        const { foo } = requireModule("./foo.js")
        foo()
        console.log("main.js")
    },{
        "./foo.js":1
    }],
    1: [function (requireModule, module, exports) {
        function foo() {
            console.log("foo.js")
        }
        module.exports = {
            foo,
        }
    },{}],
})