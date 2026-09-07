import bs4
import re

file_path = r'c:\Users\HamidAli\Downloads\promotional-pages-for-print-links\Appway\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

soup = bs4.BeautifulSoup(html_content, 'html.parser')

# Title
title_tag = soup.find('title')
if title_tag:
    title_tag.string = 'Print Links - Complete Printing Business Management System'

# Banner Section
banner_section = soup.find('section', class_='banner-section')
if banner_section:
    h1 = banner_section.find('h1')
    if h1:
        h1.string = 'All-in-One Printing Business Platform'
    text = banner_section.find('div', class_='text')
    if text:
        text.string = 'Print Links brings printing calculations, clients, pricing, expenses, employees, salaries, suppliers, analytics, reports, earnings and profit management together in one platform.'
    btn = banner_section.find('a', string=re.compile('.*Get App Now.*'))
    if btn:
        btn.string = 'Get Started'

# Feature Section 1
feature_section = soup.find('section', class_='feature-section')
if feature_section:
    sec_title_h2 = feature_section.find('div', class_='sec-title').find('h2')
    if sec_title_h2:
        sec_title_h2.string = 'Printing Operations'
    sec_title_p = feature_section.find('div', class_='sec-title').find('p')
    if sec_title_p:
        sec_title_p.string = 'Manage calculations, quantities, jobs, items, materials, and pricing.'

    features = feature_section.find_all('div', class_='single-item')
    if len(features) >= 4:
        features[0].find('h5').find('a').string = 'Printing Calculations'
        features[0].find('div', class_='text').string = 'Automates the underlying calculation process while keeping the owner\'s workflow simple.'
        
        features[1].find('h5').find('a').string = 'Quantity Management'
        features[1].find('div', class_='text').string = 'Manage required details and let Print Links calculate.'

        features[2].find('h5').find('a').string = 'Items & Materials'
        features[2].find('div', class_='text').string = 'Keep track of items used and connect relevant information with operations.'

        features[3].find('h5').find('a').string = 'Pricing & Tiers'
        features[3].find('div', class_='text').string = 'Organize pricing according to business requirements rather than manual calculations.'

# Feature Style Two
feature_style_two = soup.find('section', class_='feature-style-two')
if feature_style_two:
    features2 = feature_style_two.find_all('div', class_='feature-block-one')
    if len(features2) >= 3:
        features2[0].find('h5').find('a').string = 'Business Management'
        features2[0].find('div', class_='text').string = 'Manage clients, suppliers, employees, salaries, holidays, and expenses.'
        
        features2[1].find('h5').find('a').string = 'Financial Visibility'
        features2[1].find('div', class_='text').string = 'Track daily earnings, daily expenses, and daily profit seamlessly.'
        
        features2[2].find('h5').find('a').string = 'Intelligence & Reporting'
        features2[2].find('div', class_='text').string = 'Understand business performance with analytics and specialized reports.'

# Feature Style Three (Mobile Applications Redefined -> Complete Business Ecosystem)
feature_style_three = soup.find('section', class_='feature-style-three')
if feature_style_three:
    inner_boxes = feature_style_three.find_all('div', class_='inner-box')
    if len(inner_boxes) >= 2:
        content_box_1 = inner_boxes[0].find('div', class_='content-box')
        if content_box_1:
            content_box_1.find('h2').string = 'Complete Business Ecosystem'
            text_p = content_box_1.find('div', class_='text').find_all('p')
            if len(text_p) >= 2:
                text_p[0].string = 'Print Links is a complete management platform built for printing businesses.'
                text_p[1].string = 'From printing calculations and client management to pricing, items, expenses, employees, salaries, holidays, suppliers, daily earnings, daily profit, analytics and reports, Print Links brings the essential parts of a printing business into one organized system.'

        content_box_2 = inner_boxes[1].find('div', class_='content-box')
        if content_box_2:
            content_box_2.find('h2').string = 'Platform Management'
            text_p2 = content_box_2.find('div', class_='text').find_all('p')
            if len(text_p2) >= 2:
                text_p2[0].string = 'Print Links has a role-based system architecture.'
                text_p2[1].string = 'Dedicated dashboards for the Printing Owner, Suppliers, Admins, and Super Admins allow different users to interact with the platform according to their role.'

# Video Section
video_section = soup.find('section', class_='video-section')
if video_section:
    content_box = video_section.find('div', class_='content-box')
    if content_box:
        content_box.find('h2').string = 'See Print Links in Action'
        text_div = content_box.find('div', class_='text')
        if text_div:
            text_div.string = 'The owner enters the required information, while Print Links handles the calculations, processing and business insights behind the scenes. Less manual work. Better visibility. Smarter printing-business management.'

# Pricing Section
pricing_section = soup.find('section', class_='pricing-section')
if pricing_section:
    sec_title = pricing_section.find('div', class_='sec-title')
    if sec_title:
        sec_title.find('h2').string = 'Pricing Plans'
        sec_title.find('p').string = 'Choose the right plan for your complete printing business management system.'
    
    # Let's just update the monthly tab (tab-1) and yearly tab (tab-2) if we can
    # The prompt asks for Basic (PKR 2,999), Standard (PKR 5,999), Premium (PKR 9,999).
    # And to make standard recommended.
    tabs = pricing_section.find_all('div', class_='tab')
    for tab in tabs:
        pricing_blocks = tab.find_all('div', class_='pricing-block-one')
        if len(pricing_blocks) >= 3:
            # Plan 1: Basic
            pricing_blocks[0].find('h3', class_='title').string = 'Basic'
            pricing_blocks[0].find('h2', class_='price').clear()
            pricing_blocks[0].find('h2', class_='price').append('2,999')
            span_mo1 = soup.new_tag('span')
            span_mo1.string = '/Mo PKR'
            pricing_blocks[0].find('h2', class_='price').append(span_mo1)
            
            ul1 = pricing_blocks[0].find('ul')
            ul1.clear()
            for li_text in ['Printing management', 'Client management', 'Items']:
                li = soup.new_tag('li')
                li.string = li_text
                ul1.append(li)

            # Plan 2: Standard (Recommended)
            pricing_blocks[1].find('h3', class_='title').string = 'Standard'
            pricing_blocks[1].find('h2', class_='price').clear()
            pricing_blocks[1].find('h2', class_='price').append('5,999')
            span_mo2 = soup.new_tag('span')
            span_mo2.string = '/Mo PKR'
            pricing_blocks[1].find('h2', class_='price').append(span_mo2)
            
            ul2 = pricing_blocks[1].find('ul')
            ul2.clear()
            for li_text in ['All Basic features', 'Pricing', 'Expenses', 'Employees & Salaries']:
                li = soup.new_tag('li')
                li.string = li_text
                ul2.append(li)

            # Plan 3: Premium
            pricing_blocks[2].find('h3', class_='title').string = 'Premium'
            pricing_blocks[2].find('h2', class_='price').clear()
            pricing_blocks[2].find('h2', class_='price').append('9,999')
            span_mo3 = soup.new_tag('span')
            span_mo3.string = '/Mo PKR'
            pricing_blocks[2].find('h2', class_='price').append(span_mo3)
            
            ul3 = pricing_blocks[2].find('ul')
            ul3.clear()
            for li_text in ['All Standard features', 'Analytics & Reports', 'Supplier management', 'Advanced business management']:
                li = soup.new_tag('li')
                li.string = li_text
                ul3.append(li)

# Testimonials Section (Our Users Review -> Business Owners Review)
testimonial_section = soup.find('section', class_='testimonial-section')
if testimonial_section:
    sec_title = testimonial_section.find('div', class_='sec-title')
    if sec_title:
        sec_title.find('h2').string = 'Business Owners Review'
        sec_title.find('p').string = 'Trusted by printing presses to manage their day-to-day operations.'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

