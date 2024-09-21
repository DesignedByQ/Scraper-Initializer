import csv
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from Product import Product
import AffiliateLink

# Set up ChromeDriver path
CHROMEDRIVER_PATH = 'C:/Users/henry/Downloads/chromedriver-win64/chromedriver-win64/chromedriver.exe'

# Configure Chrome options
options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('--window-size=1920,1080')

# Initialize WebDriver
service = Service(CHROMEDRIVER_PATH)
driver = webdriver.Chrome(service=service, options=options)

# Store all the items found on Amazon specified category
all_items = []

try:
    # Navigate to the Amazon search results page
    search_query = "mens black genuine leather bag"
    page_number = 1
    url = f"https://www.amazon.co.uk/s?k={'+'.join(search_query.split())}&page={page_number}"

    def get_products_from_url(url):
        # Get page data
        try:
            driver.get(url)
        except Exception as e:
            print(f"Failed to GET page data: {e}")
            return None

        # Initialize WebDriverWait
        wait = WebDriverWait(driver, 10)

        # Wait until product containers are present
        try:
            products = wait.until(EC.presence_of_all_elements_located(
                (By.XPATH, "//div[@data-component-type='s-search-result']")
            ))
        except:
            print("No products found or page load issue.")
            return None

        if not products:
            print("All products have been scraped")
            return None

        return products

    def loop_through_all_pages(products):
        for index, product in enumerate(products, start=1):
            try:
                # Extract Product ID (ASIN)
                product_id = product.get_attribute("data-asin")
                if not product_id:
                    print(f"Product {index}: No ASIN found, skipping.")
                    continue  # Skip if no ASIN is found

                # Extract Product Title
                try:
                    title_element = product.find_element(By.XPATH, ".//h2[@class='a-size-mini a-spacing-none a-color-base s-line-clamp-2']")
                    title = title_element.text
                except:
                    title = "Title not found"

                # Extract Product Price
                try:
                    whole_price = product.find_element(By.XPATH, ".//span[@class='a-price-whole']").text
                    fraction_price = product.find_element(By.XPATH, ".//span[@class='a-price-fraction']").text
                    price = f"{whole_price}.{fraction_price}"
                except:
                    price = "Price not available"

                # Extract Image URL
                try:
                    image_element = product.find_element(By.XPATH, ".//img[contains(@class, 's-image')]")
                    image_url = image_element.get_attribute("src")
                except:
                    image_url = "Image URL not found"

                # Extract Product URL
                try:
                    link_element = product.find_element(By.XPATH, ".//a[@class='a-link-normal s-no-outline']")
                    product_url = link_element.get_attribute("href")
                except:
                    product_url = "Product URL not found"

                # Print extracted information
                print(f"Product {index}:")
                print(f"  ASIN (Product ID): {product_id}")
                print(f"  Title: {title}")
                print(f"  Price: {price}")
                print(f"  Image URL: {image_url}")
                print(f"  Product URL: {product_url}")
                print(f"  Category: accessories")
                print("-" * 60)

                # Build product from data
                accessory = Product(index, product_id, title, price, image_url, product_url, "accessories", None)

                # Add it to a list
                all_items.append(accessory)

            except Exception as e:
                print(f"Error processing product {index}: {e}")
                print("-" * 60)

    # Keep adding items to the list as long as the URL returns data
    while True:
        products = get_products_from_url(url)
        if products is None:
            break

        loop_through_all_pages(products)

        # Update to the next page
        page_number += 1
        url = f"https://www.amazon.co.uk/s?k={'+'.join(search_query.split())}&page={page_number}"
        print(f"Moving to page: {page_number}")

    # Print final results
    print(f"Final list quantity is: {len(all_items)}")

finally:
    # Close the WebDriver
    driver.quit()

if all_items:

    # Filter out products where the "title" contains both "black" and "leather" in the string and doesn't include "faux"
    filtered_products = [
        product for product in all_items 
        if 'black' in product.title.lower() and 'leather' in product.title.lower() and 'genuine' in product.title.lower() and 'faux' not in product.title.lower()
    ]

    # Filter out any duplicate products using their ID
    # Dictionary to track unique product_ids
    unique_products = {}
    for product in filtered_products:
        # Add product to dictionary only if the product_id is not already in the dictionary
        if product['product_id'] not in unique_products:
            unique_products[product['product_id']] = product

    # Extract the filtered products from the dictionary
    filtered_products_no_duplicates = list(unique_products.values())

    # Output the filtered list
    print(filtered_products_no_duplicates)

    print('*' * 60)
    print(f'Filtered products from list: {len(filtered_products)}')
    print('*' * 60)

    # Retrieve the amzn aff link for each filtered product
    for product in filtered_products:
        
        aff_link = AffiliateLink.get_affiliate_link(product.product_url)

        product.affiliate_link = aff_link

    # print(filtered_products[0].supplier)
    # print(filtered_products[0].eventID)
    # print(filtered_products[0].date)

    # Save to csv
    if filtered_products:

        # Directory path
        directory = 'files/'

        # Create directory if it doesn't exist
        if not os.path.exists(directory):
            os.makedirs(directory)

        # File path
        file_path = os.path.join(directory, 'AmazonProducts.csv')

        # Create empty CSV files if they don't exist
        if not os.path.exists(file_path):
            with open(file_path, 'a', newline='') as csvfile:
                pass  # File created
 
        # Read existing product IDs from the CSV file
        existing_product_ids = set()
        file_exists = False

        try:
            with open(file_path, "r") as csvfile:
                reader = csv.reader(csvfile)
                try:
                    next(reader)  # Skip header row
                except StopIteration:
                    pass  # File is empty, no need to skip header row
                for row in reader:
                    existing_product_ids.add(row[0])  # Assuming product ID is in the first column
            file_exists = os.path.exists(file_path)  # True
        except FileNotFoundError:
            pass  # File doesn't exist, no need to read existing IDs


        print('How many existing_product_ids')
        print(len(existing_product_ids))

        # Open CSV file in append mode
        with open(file_path, "a", newline="") as csvfile:
            # Check if the file is empty
            file_empty = os.stat(file_path).st_size == 0

            # Define CSV writer
            writer = csv.writer(csvfile)
            
            # Write a header row if the file is empty or doesn't exist
            if not file_exists or file_empty or csvfile.tell() == 0:
                writer.writerow(["ID", "Name", "Price", "ImageURL", "ProductType", "DateTime", "EventID", "Supplier", "ProductURL", "AffiliateLink"])  # Write header
            
            for product in filtered_products:

                try:
                    # Extract product data
                    product_id = product.product_id
                    name = product.title
                    price = product.price
                    image_url = product.image_url
                    product_url = product.product_url
                    product_type = "accessories"
                    affiliate_link = product.affiliate_link
        
                    # Include event data
                    date_time = product.date
                    event_id = product.eventID
                    vendor = product.supplier
                    
                    # Check if the product_id already exists in the existing_product_ids set
                    if product_id not in existing_product_ids:
                        # Write product data to CSV file
                        writer.writerow([product_id, name, price, image_url, product_type, date_time, event_id, vendor, product_url, affiliate_link])
                        
                        # Add the product_id to the existing_product_ids set
                        existing_product_ids.add(product_id)

                        print(f"{product_id} added to the spreadsheet.")

                except Exception as e:
                    print(f"Error writing product to CSV: {e}")

            print("Finished adding products to CSV.")

else:
    print("All items list is empty")

# Clear array for next category
all_items = []




 #set up code in BE to say if product id from supplier exists in db then dont persist it


