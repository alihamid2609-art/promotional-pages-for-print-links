const fs = require("fs");
const path = require("path");

const baseDir = __dirname;
const pages = [
  "index.html",
  "crm-management.html",
  "about.html",
  "contact.html",
  "faq.html",
  "hr-management.html",
  "portfolio-2.html",
  "portfolio-details.html",
  "pricing.html",
  "service-details.html",
  "service.html",
  "testimonial.html",
];

const headerRe = /\n\s*<!-- main header -->[\s\S]*?<\/div><!-- End Mobile Menu -->\s*\n/;
const footerRe = /\n\s*<!-- main-footer -->[\s\S]*?<!-- main-footer end -->\s*\n/;
const scriptRe = /\n\s*<!-- main-js -->\s*\n\s*<script src="js\/script\.js"><\/script>\s*\n/;

function readPage(name) {
  return fs.readFileSync(path.join(baseDir, name), "utf8");
}

function writePage(name, content) {
  fs.writeFileSync(path.join(baseDir, name), content, "utf8");
}

function extractRequired(pattern, content, label) {
  const match = content.match(pattern);
  if (!match) {
    throw new Error(`Could not find ${label}`);
  }
  return match[0].trim();
}

function getHeaderSettings(headerHtml) {
  const headerMatch = headerHtml.match(/<header class="([^"]+)"/);
  const logoMatch = headerHtml.match(/<figure class="logo"><a href="index\.html"><img src="([^"]+)"/);
  const menuAreaMatch = headerHtml.match(/<div class="menu-area([^"]*)"/);

  return {
    headerClass: headerMatch ? headerMatch[1] : "main-header style-four",
    logo: logoMatch ? logoMatch[1] : "images/logo-4.png",
    menuAreaClass: `menu-area${menuAreaMatch ? menuAreaMatch[1] : ""}`,
  };
}

function getFooterSettings(footerHtml) {
  const footerMatch = footerHtml.match(/<footer class="([^"]+)"/);
  const bgMatch = footerHtml.match(/background-image:\s*url\(([^)]+)\)/);
  const logoMatch = footerHtml.match(/<figure class="footer-logo"><a href="index\.html"><img src="([^"]+)"/);

  return {
    footerClass: footerMatch ? footerMatch[1] : "main-footer style-five style-six",
    bg: bgMatch ? bgMatch[1] : "images/icons/footer-bg-6.png",
    logo: logoMatch ? logoMatch[1] : "images/footer-logo-2.png",
  };
}

function activeMenuFor(pageName) {
  if (["index.html", "crm-management.html", "hr-management.html"].includes(pageName)) {
    return "home";
  }

  if (pageName === "contact.html") {
    return "contact";
  }

  return "pages";
}

function makeHeaderTemplate(headerHtml) {
  return headerHtml
    .replace(/<header class="[^"]+"/, '<header class="{{HEADER_CLASS}}"')
    .replace(
      /(<figure class="logo"><a href="index\.html"><img src=")[^"]+(")/,
      "$1{{HEADER_LOGO}}$2"
    )
    .replace(/<div class="menu-area[^"]*"/, '<div class="{{MENU_AREA_CLASS}}"')
    .replace(/<li class="current dropdown"/g, '<li class="dropdown"') + "\n";
}

function makeFooterTemplate(footerHtml) {
  return footerHtml
    .replace(/<footer class="[^"]+"/, '<footer class="{{FOOTER_CLASS}}"')
    .replace(/background-image:\s*url\([^)]+\)/, "background-image: url({{FOOTER_BG}})")
    .replace(
      /(<figure class="footer-logo"><a href="index\.html"><img src=")[^"]+(")/,
      "$1{{FOOTER_LOGO}}$2"
    ) + "\n";
}

function makeHeaderPlaceholder(pageName, headerHtml) {
  const settings = getHeaderSettings(headerHtml);
  return `
    <!-- main header -->
    <div data-include="header" data-header-class="${settings.headerClass}" data-header-logo="${settings.logo}" data-menu-area-class="${settings.menuAreaClass}" data-active-menu="${activeMenuFor(pageName)}"></div>
    <!-- main-header end -->
`;
}

function makeFooterPlaceholder(footerHtml) {
  const settings = getFooterSettings(footerHtml);
  return `
    <!-- main-footer -->
    <div data-include="footer" data-footer-class="${settings.footerClass}" data-footer-bg="${settings.bg}" data-footer-logo="${settings.logo}"></div>
    <!-- main-footer end -->
`;
}

const sourceHtml = readPage("about.html");
const headerTemplate = makeHeaderTemplate(extractRequired(headerRe, sourceHtml, "header"));
const footerTemplate = makeFooterTemplate(extractRequired(footerRe, sourceHtml, "footer"));

fs.writeFileSync(path.join(baseDir, "header.html"), headerTemplate, "utf8");
fs.writeFileSync(path.join(baseDir, "footer.html"), footerTemplate, "utf8");

for (const pageName of pages) {
  let html = readPage(pageName);
  const originalHeader = extractRequired(headerRe, html, `${pageName} header`);
  const originalFooter = extractRequired(footerRe, html, `${pageName} footer`);

  html = html.replace(headerRe, makeHeaderPlaceholder(pageName, originalHeader));
  html = html.replace(footerRe, makeFooterPlaceholder(originalFooter));
  html = html.replace(scriptRe, '\n<!-- main-js -->\n<script src="js/include-layout.js"></script>\n');
  writePage(pageName, html);
}
