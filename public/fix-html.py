import re
from pathlib import Path

ROOT = Path(__file__).parent

DEAL_PRODUCTS = {
    "1": {"name": "Men's Pattern Shirt", "category": "Clothing", "new": 649, "old": 799},
    "2": {"name": "Women's Casual Dress", "category": "Clothing", "new": 899, "old": 1099},
    "3": {"name": "Kids Printed T-Shirt", "category": "Clothing", "new": 349, "old": 449},
    "4": {"name": "Aviator Sunglasses", "category": "Accessories", "new": 179, "old": 249},
    "5": {"name": "Leather Crossbody Bag", "category": "Accessories", "new": 249, "old": 349},
    "6": {"name": "Baseball Cap", "category": "Accessories", "new": 89, "old": 119},
    "7": {"name": "Classic Wristwatch", "category": "Accessories", "new": 999, "old": 1299},
    "8": {"name": "Formal Leather Shoes", "category": "Footwear", "new": 699, "old": 899},
}

TITLES = {
    "shop.html": "Shop — Styra",
    "product.html": "Product — Styra",
    "contact.html": "Contact — Styra",
    "blog.html": "Blog — Styra",
    "about.html": "About — Styra",
    "cart.html": "Cart — Styra",
    "login.html": "Login — Styra",
    "signup.html": "Sign Up — Styra",
    "checkout.html": "Checkout — Styra",
    "wishlist.html": "Wishlist — Styra",
}

COMMON_REPLACEMENTS = [
    ('<title>Document</title>', None),
    ('<title>E-commerce Website</title>', None),
    ('COntact', 'Contact'),
    ('href=""login.html', 'href="login.html'),
    ('<a href=""><img src="" alt="" class="logo"></a>', '<a href="index.html"><img src="" alt="Styra" class="logo"></a>'),
    ('<h5>contact-section</h5>', '<h5>Contact Us</h5>'),
    ('Sector-M,Ashiyana,Lucknows', 'Sector M, Ashiyana, Lucknow'),
    ('<span>Hours:</span>10:00', '<span>Hours:</span> 10:00'),
    ('Terms&Conditions', 'Terms &amp; Conditions'),
    ('Accesories', 'Accessories'),
    ('JohnDOe', 'John Doe'),
    ('Select SIze', 'Select Size'),
]

TRENDING_REPLACEMENTS = [
    ("<p class=\"product-name\">Men's Solid T-shirt</p>\n      <p>$699</p>", "<p class=\"product-name\">Men's Solid T-Shirt</p>\n      <p>₹699</p>"),
    ("<p class=\"product-name\">Women Casual Dress</p>\n      <p>$699</p>", "<p class=\"product-name\">Women's Casual Dress</p>\n      <p>₹999</p>"),
    ("<p class=\"product-name\">Kids Printed t-shirts</p>\n      <p>$699</p>", "<p class=\"product-name\">Kids Printed T-Shirt</p>\n      <p>₹399</p>"),
    ("<p class=\"product-name\">formal shoes</p>\n      <p>$699</p>", "<p class=\"product-name\">Formal Leather Shoes</p>\n      <p>₹799</p>"),
    ('<img src="images/Bags1.jpg" alt=""></div>\n      <p class="product-name">Men\'s Solid T-shirt</p>\n      <p>$699</p>', '<img src="images/Bags1.jpg" alt="Leather crossbody bag"></div>\n      <p class="product-name">Leather Crossbody Bag</p>\n      <p>₹299</p>'),
    ('<img src="images/Watches2.jpg" alt=""></div>\n      <p class="product-name">Men\'s Solid T-shirt</p>\n      <p>$699</p>', '<img src="images/Watches2.jpg" alt="Classic wristwatch"></div>\n      <p class="product-name">Classic Wristwatch</p>\n      <p>₹1199</p>'),
    ('<img src="images/Sunglasses2.jpg" alt=""></div>\n      <p class="product-name">Men\'s Solid T-shirt</p>\n      <p>$699</p>', '<img src="images/Sunglasses2.jpg" alt="Aviator sunglasses"></div>\n      <p class="product-name">Aviator Sunglasses</p>\n      <p>₹199</p>'),
    ('<img src="images/Caps2.jpg" alt=""></div>\n      <p class="product-name">Men\'s Solid T-shirt</p>\n      <p>$699</p>', '<img src="images/Caps2.jpg" alt="Baseball cap"></div>\n      <p class="product-name">Baseball Cap</p>\n      <p>₹99</p>'),
    ("<p>Men's Solid T-shirt</p>\n      <p>$699</p>", None),
    ("<p>Women Casual Dress</p>\n      <p>$699</p>", "<p>Women's Casual Dress</p>\n      <p>₹999</p>"),
    ("<p>Kids Printed t-shirts</p>\n      <p>$699</p>", "<p>Kids Printed T-Shirt</p>\n      <p>₹399</p>"),
    ("<p>formal shoes</p>\n      <p>$699</p>", "<p>Formal Leather Shoes</p>\n      <p>₹799</p>"),
    ('<img src="images/Bags1.jpg" alt=""></div>\n      <p>Men\'s Solid T-shirt</p>\n      <p>$699</p>', '<img src="images/Bags1.jpg" alt="Leather crossbody bag"></div>\n      <p>Leather Crossbody Bag</p>\n      <p>₹299</p>'),
    ('<img src="images/Watches2.jpg" alt=""></div>\n      <p>Men\'s Solid T-shirt</p>\n      <p>$699</p>', '<img src="images/Watches2.jpg" alt="Classic wristwatch"></div>\n      <p>Classic Wristwatch</p>\n      <p>₹1199</p>'),
    ('<img src="images/Sunglasses2.jpg" alt=""></div>\n      <p>Men\'s Solid T-shirt</p>\n      <p>$699</p>', '<img src="images/Sunglasses2.jpg" alt="Aviator sunglasses"></div>\n      <p>Aviator Sunglasses</p>\n      <p>₹199</p>'),
    ('<img src="images/Caps2.jpg" alt=""></div>\n      <p>Men\'s Solid T-shirt</p>\n      <p>$699</p>', '<img src="images/Caps2.jpg" alt="Baseball cap"></div>\n      <p>Baseball Cap</p>\n      <p>₹99</p>'),
]

CATEGORY_REPLACEMENTS = [
    ("<p>Starting From $399</p>", "<p>Starting From ₹399</p>"),
    ("<p>Starting From $599</p>", "<p>Starting From ₹599</p>"),
    ("<p>Starting From $199</p>", "<p>Starting From ₹199</p>"),
    ("<p>Starting From $499</p>", "<p>Starting From ₹499</p>"),
    ("<p>Starting From $99</p>", "<p>Starting From ₹99</p>"),
]

FOOTER_LINKS = [
    ('<li><a href="">About Us</a></li>', '<li><a href="about.html">About Us</a></li>'),
    ('<li><a href="">Contact Us</a></li>', '<li><a href="contact.html">Contact Us</a></li>'),
    ('<li><a href="">Sign in</a></li>', '<li><a href="login.html">Sign In</a></li>'),
    ('<li><a href="">View Cart</a></li>', '<li><a href="cart.html">View Cart</a></li>'),
    ('<li><a href="">My Wishlist</a></li>', '<li><a href="wishlist.html">My Wishlist</a></li>'),
    ('<h5><a href="">About</a></h5>', '<h5><a href="about.html">About</a></h5>'),
    ('<h5><a href="">My Account</a></h5>', '<h5><a href="login.html">My Account</a></h5>'),
]


def update_deal_block(block: str) -> str:
    match = re.search(r'class="btn-cart" data-id="(\d+)"', block)
    if not match:
        return block

    product = DEAL_PRODUCTS[match.group(1)]
    block = re.sub(
        r'<h5 class="Product-heading">.*?</h5>',
        f'<h5 class="Product-heading">{product["name"]}</h5>',
        block,
        count=1,
    )
    block = re.sub(
        r'<span class="product-category">.*?</span>',
        f'<span class="product-category">{product["category"]}</span>',
        block,
        count=1,
    )
    block = re.sub(
        r'<span class="new-price">.*?</span>',
        f'<span class="new-price">₹{product["new"]}</span>',
        block,
        count=1,
    )
    block = re.sub(
        r'<span class="old-price">.*?</span>',
        f'<span class="old-price">₹{product["old"]}</span>',
        block,
        count=1,
    )
    block = re.sub(
        r'href="product\.html\?id=\d+\s+"',
        f'href="product.html?id={match.group(1)}"',
        block,
    )
    block = re.sub(
        r'href="product\.html\?id=(\d+)""',
        r'href="product.html?id=\1"',
        block,
    )
    return block


def update_deals(html: str) -> str:
    pattern = re.compile(r'<div class="product-item">.*?</div>\s*(?=\n(?:<!-- item|</div>))', re.DOTALL)
    return pattern.sub(lambda m: update_deal_block(m.group(0)), html)


def apply_common(text: str, filename: str) -> str:
    if filename in TITLES:
        text = re.sub(r'<title>.*?</title>', f'<title>{TITLES[filename]}</title>', text, count=1)

    for old, new in COMMON_REPLACEMENTS:
        if new is None:
            continue
        text = text.replace(old, new)

    for old, new in FOOTER_LINKS:
        text = text.replace(old, new)

    text = re.sub(r'href="product\.html\?id=(\d+)\s+"', r'href="product.html?id=\1"', text)

    for old, new in CATEGORY_REPLACEMENTS:
        text = text.replace(old, new)

    if filename in ('index.html', 'product.html'):
        for old, new in TRENDING_REPLACEMENTS:
            if old and new:
                text = text.replace(old, new)

    if 'product-item' in text:
        text = update_deals(text)

    text = re.sub(r'\.jpg"width=', '.jpg" width=', text)
    text = re.sub(r'\.jpeg"width=', '.jpeg" width=', text)
    text = re.sub(r'\.avif"width=', '.avif" width=', text)

    return text


def fix_contact_html(text: str) -> str:
    text = text.replace(
        '<input type="text" placeholder="E-mail">',
        '<input type="email" placeholder="Email">',
    )
    text = text.replace(
        '<textarea name="" id="" rows="5" cols="30">Your Message</textarea>',
        '<textarea name="message" id="message" rows="5" cols="30" placeholder="Your Message"></textarea>',
    )
    return text


def fix_blog_html(text: str) -> str:
    text = text.replace(
        '<p> Ladipisicing elit. Voluptates, nostrum?eveniet iure adipisci facilis accusantium accusamus perspiciatis, ipsum?</p>',
        '<p>Discover the latest trends in fashion, styling tips, and seasonal wardrobe essentials from the Styra team.</p>',
    )
    text = text.replace('<h3>Lorem ipsum dolor sit.</h3>', '<h3>Style Guide: Fresh Looks for the Season</h3>')
    return text


def fix_index_category_card(text: str) -> str:
    return text.replace(
        """      <article class="category-card">
        <a href="#" class="card-link">

        <div class="img-box">
          <img src="images/WomenCollection.jpg" alt=""></div>
          <p>Women's Collection</p>
          <p>Starting From ₹599</p>
          
      </article>""",
        """      <article class="category-card">
        <a href="#" class="card-link">
        <div class="img-box">
          <img src="images/WomenCollection.jpg" alt="Women's fashion collection"></div>
          <p>Women's Collection</p>
          <p>Starting From ₹599</p>
          </a>
      </article>""",
    )


def main():
    html_files = list(ROOT.glob('*.html'))
    for path in html_files:
        text = path.read_text(encoding='utf-8')
        text = apply_common(text, path.name)

        if path.name == 'contact.html':
            text = fix_contact_html(text)
        if path.name == 'blog.html':
            text = fix_blog_html(text)
        if path.name == 'index.html':
            text = fix_index_category_card(text)
        if path.name == 'product.html':
            text = text.replace(
                '<h4 id="product-price">$139.00</h4>',
                '<h4 id="product-price">₹699</h4>',
            )
            text = text.replace(
                "<h4 id=\"product-name\">Men's Fashion Tshirt</h4>",
                "<h4 id=\"product-name\">Men's Solid T-Shirt</h4>",
            )
            text = text.replace(
                '<h6 id="product-category">Home/T-shirt</h6>',
                '<h6 id="product-category">Home / Clothing</h6>',
            )

        path.write_text(text, encoding='utf-8')
        print(f'Updated {path.name}')


if __name__ == '__main__':
    main()
