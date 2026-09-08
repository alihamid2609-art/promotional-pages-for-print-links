(function () {
    "use strict";

    var currentScript = document.currentScript;
    var mode = currentScript ? currentScript.getAttribute("data-mode") : "";

    function writeLines(lines) {
        document.write(lines.join("\n"));
    }

    function getExtraScripts() {
        var extra = currentScript ? currentScript.getAttribute("data-extra") : "";

        return extra ? extra.split(",").map(function (src) {
            return src.trim();
        }).filter(Boolean) : [];
    }

    function getExtraStyles() {
        var extra = currentScript ? currentScript.getAttribute("data-extra-css") : "";

        return extra ? extra.split(",").map(function (href) {
            return href.trim();
        }).filter(Boolean) : [];
    }

    if (mode === "head") {
        writeLines([
            '<meta charset="utf-8">',
            '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">',
            '',
            '<title>' + (currentScript.getAttribute("data-title") || "Print Links") + '</title>',
            '',
            '<!-- Fav Icon -->',
            '<link rel="icon" href="images/favicon.ico" type="image/x-icon">',
            '',
            '<!-- Google Fonts -->',
            '<link href="https://fonts.googleapis.com/css?family=Ubuntu:300,300i,400,400i,500,500i,700,700i&amp;display=swap" rel="stylesheet">',
            '',
            '<!-- Stylesheets -->',
            '<link href="css/font-awesome-all.css" rel="stylesheet">',
            '<link href="css/flaticon.css" rel="stylesheet">',
            '<link href="css/owl.css" rel="stylesheet">',
            '<link href="css/bootstrap.css" rel="stylesheet">',
            '<link href="css/jquery.fancybox.min.css" rel="stylesheet">',
            '<link href="css/animate.css" rel="stylesheet">',
            '<link href="css/imagebg.css" rel="stylesheet">',
            '<link href="css/style.css" rel="stylesheet">',
            '<link href="css/responsive.css" rel="stylesheet">'
        ].concat(getExtraStyles().map(function (href) {
            return '<link href="' + href + '" rel="stylesheet">';
        })));
    }

    if (mode === "scripts") {
        var scripts = [
            "js/jquery.js",
            "js/popper.min.js",
            "js/bootstrap.min.js",
            "js/owl.js",
            "js/wow.js",
            "js/validation.js",
            "js/jquery.fancybox.js",
            "js/appear.js",
            "js/circle-progress.js",
            "js/jquery.countTo.js",
            "js/scrollbar.js",
            "js/nav-tool.js",
            "js/jquery.paroller.min.js",
            "js/tilt.jquery.js"
        ].concat(getExtraScripts());

        if (currentScript.getAttribute("data-include-layout") !== "false") {
            scripts.push("js/include-layout.js");
        }

        writeLines(['<!-- jequery plugins -->'].concat(scripts.map(function (src) {
            return '<script src="' + src + '"><\/script>';
        })));
    }
}());
