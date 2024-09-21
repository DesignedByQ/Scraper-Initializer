import uuid
from datetime import datetime

class Product:

    supplier = "Amazon"
    eventID = uuid.uuid4()
    date = datetime.now()

    def __init__(self, index, product_id, title, price, image_url, product_url, product_type, affiliate_link):
        self.index = index
        self.product_id = product_id
        self.title = title
        self.price = price
        self.image_url = image_url
        self.product_url = product_url
        self.product_type = product_type
        self.affiliate_link = affiliate_link