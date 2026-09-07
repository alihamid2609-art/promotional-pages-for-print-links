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

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function setFormMessage(form, type, text) {
        var message = form.querySelector(".form-transition-message");

        if (!message) {
            message = document.createElement("div");
            message.className = "form-transition-message";
            message.setAttribute("role", "status");
            message.setAttribute("aria-live", "polite");
            form.appendChild(message);
        }

        message.className = "form-transition-message is-" + type;
        message.textContent = text;
    }

    function setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.setAttribute("data-original-html", button.innerHTML);
            button.classList.add("is-loading");
            button.disabled = true;
            button.innerHTML = '<span class="button-loader" aria-hidden="true"></span><span>Please wait...</span>';
            return;
        }

        button.classList.remove("is-loading");
        button.disabled = false;
        button.innerHTML = button.getAttribute("data-original-html") || button.innerHTML;
        button.removeAttribute("data-original-html");
    }

    function handleTransitionForm(form, successText) {
        var button = form.querySelector('button[type="submit"], .theme-btn-two');

        form.addEventListener("submit", function (event) {
            var email = form.querySelector('input[type="email"]');

            event.preventDefault();

            if (form.classList.contains("is-submitting")) {
                return;
            }

            if (email && (!email.value.trim() || !isValidEmail(email.value.trim()))) {
                setFormMessage(form, "error", "Please enter a valid email address.");
                email.focus();
                return;
            }

            if (!form.checkValidity()) {
                setFormMessage(form, "error", "Please complete the required fields.");
                if (form.reportValidity) {
                    form.reportValidity();
                }
                return;
            }

            form.classList.add("is-submitting");
            setFormMessage(form, "loading", "Sending...");
            setButtonLoading(button, true);

            window.setTimeout(function () {
                setButtonLoading(button, false);
                form.classList.remove("is-submitting");
                setFormMessage(form, "success", successText);
                form.reset();
            }, 2000);
        });
    }

    function initFormTransitions() {
        document.querySelectorAll(".subscribe-form").forEach(function (form) {
            handleTransitionForm(form, "Thanks. You are subscribed to Print Links updates.");
        });

        document.querySelectorAll(".question-form form").forEach(function (form) {
            handleTransitionForm(form, "Thanks. Your question has been received. We'll get back to you soon.");
        });

        document.querySelectorAll("#contact-form").forEach(function (form) {
            handleTransitionForm(form, "Thanks. Your message has been sent. We'll get back to you soon.");
        });
    }

    function updateSocialLinks() {
        var links = {
            "fa-facebook-f": "https://www.facebook.com/hamid339",
            "fa-facebook-square": "https://www.facebook.com/hamid339",
            "fa-twitter": "https://x.com/hamid339",
            "fa-twitter-square": "https://x.com/hamid339",
            "fa-linkedin-in": "https://www.linkedin.com/in/hamid339",
            "fa-linkedin": "https://www.linkedin.com/in/hamid339",
            "fa-instagram": "https://www.instagram.com/hamid339",
            "fa-youtube": "https://www.youtube.com/@hamid339",
            "fa-pinterest-p": "https://www.pinterest.com/hamid339"
        };

        Object.keys(links).forEach(function (iconClass) {
            document.querySelectorAll("." + iconClass).forEach(function (icon) {
                var link = icon.tagName.toLowerCase() === "a" ? icon : icon.closest("a");

                if (link) {
                    link.href = links[iconClass];
                    link.target = "_blank";
                    link.rel = "noopener";
                }
            });
        });
    }

    var includes = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));

    Promise.all(includes.map(loadPartial))
        .catch(function (error) {
            window.console.error(error);
        })
        .then(function () {
            initFormTransitions();
            updateSocialLinks();
            loadMainScript();
        });
}());
