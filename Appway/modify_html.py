from pathlib import Path
import re


BASE_DIR = Path(__file__).resolve().parent

PAGES = [
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
]

HEADER_RE = re.compile(
    r"\n\s*<!-- main header -->.*?</div><!-- End Mobile Menu -->\s*\n",
    re.DOTALL,
)
FOOTER_RE = re.compile(
    r"\n\s*<!-- main-footer -->.*?<!-- main-footer end -->\s*\n",
    re.DOTALL,
)
SCRIPT_RE = re.compile(
    r'\n\s*<!-- main-js -->\s*\n\s*<script src="js/script\.js"></script>\s*\n',
    re.DOTALL,
)


def read_page(name):
    return (BASE_DIR / name).read_text(encoding="utf-8")


def write_page(name, content):
    (BASE_DIR / name).write_text(content, encoding="utf-8")


def extract_required(pattern, content, label):
    match = pattern.search(content)
    if not match:
        raise RuntimeError(f"Could not find {label}")
    return match.group(0).strip()


def get_header_settings(header_html):
    header_match = re.search(r'<header class="([^"]+)"', header_html)
    logo_match = re.search(
        r'<figure class="logo"><a href="index\.html"><img src="([^"]+)"',
        header_html,
    )
    menu_area_match = re.search(r'<div class="menu-area([^"]*)"', header_html)

    header_class = header_match.group(1) if header_match else "main-header style-four"
    logo = logo_match.group(1) if logo_match else "images/logo-4.png"
    menu_area_class = "menu-area" + (menu_area_match.group(1) if menu_area_match else "")
    return header_class, logo, menu_area_class


def get_footer_settings(footer_html):
    footer_match = re.search(r'<footer class="([^"]+)"', footer_html)
    bg_match = re.search(r"background-image:\s*url\(([^)]+)\)", footer_html)
    logo_match = re.search(
        r'<figure class="footer-logo"><a href="index\.html"><img src="([^"]+)"',
        footer_html,
    )

    footer_class = footer_match.group(1) if footer_match else "main-footer style-five style-six"
    bg = bg_match.group(1) if bg_match else "images/icons/footer-bg-6.png"
    logo = logo_match.group(1) if logo_match else "images/footer-logo-2.png"
    return footer_class, bg, logo


def active_menu_for(page_name):
    if page_name in {"index.html", "crm-management.html", "hr-management.html"}:
        return "home"
    if page_name == "contact.html":
        return "contact"
    return "pages"


def make_header_template(header_html):
    header_html = re.sub(
        r'<header class="[^"]+"',
        '<header class="{{HEADER_CLASS}}"',
        header_html,
        count=1,
    )
    header_html = re.sub(
        r'(<figure class="logo"><a href="index\.html"><img src=")[^"]+(")',
        r"\1{{HEADER_LOGO}}\2",
        header_html,
        count=1,
    )
    header_html = re.sub(
        r'<div class="menu-area[^"]*"',
        '<div class="{{MENU_AREA_CLASS}}"',
        header_html,
        count=1,
    )
    header_html = re.sub(r'<li class="current dropdown"', '<li class="dropdown"', header_html)
    return header_html + "\n"


def make_footer_template(footer_html):
    footer_html = re.sub(
        r'<footer class="[^"]+"',
        '<footer class="{{FOOTER_CLASS}}"',
        footer_html,
        count=1,
    )
    footer_html = re.sub(
        r"background-image:\s*url\([^)]+\)",
        "background-image: url({{FOOTER_BG}})",
        footer_html,
        count=1,
    )
    footer_html = re.sub(
        r'(<figure class="footer-logo"><a href="index\.html"><img src=")[^"]+(")',
        r"\1{{FOOTER_LOGO}}\2",
        footer_html,
        count=1,
    )
    return footer_html + "\n"


def make_header_placeholder(page_name, header_html):
    header_class, logo, menu_area_class = get_header_settings(header_html)
    return (
        "\n    <!-- main header -->\n"
        f'    <div data-include="header" data-header-class="{header_class}" '
        f'data-header-logo="{logo}" data-menu-area-class="{menu_area_class}" '
        f'data-active-menu="{active_menu_for(page_name)}"></div>\n'
        "    <!-- main-header end -->\n"
    )


def make_footer_placeholder(footer_html):
    footer_class, bg, logo = get_footer_settings(footer_html)
    return (
        "\n    <!-- main-footer -->\n"
        f'    <div data-include="footer" data-footer-class="{footer_class}" '
        f'data-footer-bg="{bg}" data-footer-logo="{logo}"></div>\n'
        "    <!-- main-footer end -->\n"
    )


def main():
    source_html = read_page("about.html")
    header_template = make_header_template(extract_required(HEADER_RE, source_html, "header"))
    footer_template = make_footer_template(extract_required(FOOTER_RE, source_html, "footer"))

    (BASE_DIR / "header.html").write_text(header_template, encoding="utf-8")
    (BASE_DIR / "footer.html").write_text(footer_template, encoding="utf-8")

    for page_name in PAGES:
        html = read_page(page_name)
        original_header = extract_required(HEADER_RE, html, f"{page_name} header")
        original_footer = extract_required(FOOTER_RE, html, f"{page_name} footer")

        html = HEADER_RE.sub(make_header_placeholder(page_name, original_header), html, count=1)
        html = FOOTER_RE.sub(make_footer_placeholder(original_footer), html, count=1)
        html = SCRIPT_RE.sub(
            '\n<!-- main-js -->\n<script src="js/include-layout.js"></script>\n',
            html,
            count=1,
        )
        write_page(page_name, html)


if __name__ == "__main__":
    main()
