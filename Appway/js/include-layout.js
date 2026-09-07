(function () {
    "use strict";

    function applyValues(template, values) {
        return Object.keys(values).reduce(function (html, key) {
            return html.replace(new RegExp("{{" + key + "}}", "g"), values[key] || "");
        }, template);
    }

    function markActiveMenu(root) {
        var items = root.querySelectorAll(".navigation > li");
        for (var i = 0; i < items.length; i += 1) {
            items[i].classList.remove("current");
        }

        var page = window.location.pathname.split("/").pop() || "index.html";
        var activeLink = root.querySelector('.navigation a[href="' + page + '"]');
        var target = activeLink ? activeLink.parentElement : null;

        while (target && target.parentElement && !target.parentElement.classList.contains("navigation")) {
            target = target.parentElement.closest("li");
        }

        if (target) {
            target.classList.add("current");
        }
    }

    function loadPartial(el) {
        var includeName = el.getAttribute("data-include");
        var fileName = includeName + ".html";

        return fetch(fileName)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Unable to load " + fileName);
                }
                return response.text();
            })
            .then(function (template) {
                var html = template;

                if (includeName === "header") {
                    html = applyValues(template, {
                        HEADER_CLASS: el.getAttribute("data-header-class"),
                        HEADER_LOGO: el.getAttribute("data-header-logo"),
                        MENU_AREA_CLASS: el.getAttribute("data-menu-area-class")
                    });
                }

                if (includeName === "footer") {
                    html = applyValues(template, {
                        FOOTER_CLASS: el.getAttribute("data-footer-class"),
                        FOOTER_BG: el.getAttribute("data-footer-bg"),
                        FOOTER_LOGO: el.getAttribute("data-footer-logo")
                    });
                }

                el.outerHTML = html;

                if (includeName === "header") {
                    markActiveMenu(document);
                }
            });
    }

    function loadMainScript() {
        var script = document.createElement("script");
        script.src = "js/script.js";
        document.body.appendChild(script);
    }

    var includes = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));

    Promise.all(includes.map(loadPartial))
        .then(loadMainScript)
        .catch(function (error) {
            window.console.error(error);
        });
}());
