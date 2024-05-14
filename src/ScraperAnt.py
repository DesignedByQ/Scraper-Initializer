import requests
from bs4 import BeautifulSoup
import json
import csv
import os
import uuid
from datetime import datetime
import http.client

load_items_page1 = 0
times_requested = 0
category_counter = 1


# Set asos category ID in URL
cid = ''
footwear_cid = 4209
accessories_cid = 4210
coats_and_jackets_cid = 3606


# Store all the items found in the categories
all_items = []
all_items_qty = len(all_items)


# Get request and formatting of data 
def get_data(): 

    try:

        conn = http.client.HTTPSConnection("api.scrapingant.com")
        conn.request("GET", f"/v2/general?url=https%3A%2F%2Fwww.asos.com%2Fapi%2Fproduct%2Fsearch%2Fv2%2Fcategories%2F{cid}%3Foffset%3D{load_items_page1}%26store%3DCOM%26lang%3Den-GB%26currency%3DGBP%26rowlength%3D3%26channel%3Ddesktop-web%26country%3DGB%26keyStoreDataversion%3Dh7g0xmn-38%26advertisementsPartnerId%3D100712%26advertisementsOptInConsent%3Dfalse%26limit%3D72&x-api-key=48453b2313eb4fc3940d2ef80e5a837c")
        res = conn.getresponse()
        html_string = res.read().decode("utf-8")
        soup = BeautifulSoup(html_string, "html.parser")
        pre_tag_content = soup.find("pre").text
        #print(soup)
        return pre_tag_content

    except Exception as e:
        print(f'Failed with get request to proxy: {e}')
        return None
    
    
# Loop through all 3 catergoies and get data
while category_counter <= 3:

    if category_counter == 1:

        cid = footwear_cid
        print('footwear loop')

    elif category_counter == 2:

        cid = accessories_cid
        print('accessories loop')

    else:

        cid = coats_and_jackets_cid
        print('coats_and_jackets loop')

    # Loop through the category pages
    while times_requested <= 35:
         
        # Response from get request
        response_data = get_data()

        if response_data and response_data is not None:
            print("Response data is true")
            try:
                # Convert data to JSON (dict)
                data = json.loads(response_data)

                # Set the current qty
                previous_all_items_qty = all_items_qty
                
                # Append data to list
                all_items.extend(data.get('products', []))

                # Update the qty
                all_items_qty = len(all_items)

                # Check if there are anymore items in the catergory
                if all_items_qty == previous_all_items_qty:
                    print("No more items in the category to scrape")
                    break

                print(len(all_items))

            except json.JSONDecodeError as e:
                print(f'Failed to parse JSON data: {e}')

        else:
            print(f'Response data is empty or none')
            break

        # Increment pages
        load_items_page1 += 72
        times_requested += 1

    # Reset values for the next loop
    load_items_page1 = 0
    times_requested = 0


    # Filter out products where the "name" contains both "black" and "leather" in the string and doesn't include "faux"
    filtered_products = [product for product in all_items if 'black' in product['name'].lower() and 'leather' in product['name'].lower() and 'faux' not in product['name'].lower()]

    print('*******')
    print('Filtered products from list')
    print(len(filtered_products))
    print('*******')

    supplier = ''
    eventID = ''
    date = ''

    if filtered_products:
        # Accessing 'imageUrl' of the first item in filtered_products
        supplier = filtered_products[0].get('imageUrl')[7:11]
        eventID = uuid.uuid4()
        date = datetime.now()
    else:
        print("No filtered products found.")

    
    # Directory path
    directory = 'files/'

    # Create directory if it doesn't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # File path
    file_path = os.path.join(directory, 'Products.csv')
    new_file_path = os.path.join(directory, 'New Products.csv')

    # Create empty CSV files if they don't exist
    if not os.path.exists(file_path):
        with open(file_path, 'a', newline='') as csvfile:
            pass  # File created

    if not os.path.exists(new_file_path):
        with open(new_file_path, 'w', newline='') as csvfile:
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
            writer.writerow(["ID", "Name", "Price", "ImageURL", "ProductType", "DateTime", "EventID", "Supplier", "ProductURL"])  # Write header

        for product in filtered_products:

            try:
                # Extract product data
                product_id = product.get("id", "")
                name = product.get("name", "")
                price = product.get("price", {}).get("current", {}).get("text", "")
                image_url = product.get("imageUrl", "")
                product_url = product.get("url", "")

                product_type = ""
                if category_counter == 1:
                    product_type = 'footwear'
                elif category_counter == 2:
                    product_type = 'accessories'
                else:
                    product_type = 'coatsandjackets'
    
                # Include event data
                date_time = date
                event_id = eventID
                vendor = supplier
                
                # Check if the product_id already exists in the existing_product_ids set
                if product_id not in existing_product_ids:
                    # Write product data to CSV file
                    writer.writerow([product_id, name, price, image_url, product_type, date_time, event_id, vendor, product_url])
                    
                    # Add the product_id to the existing_product_ids set
                    # existing_product_ids.add(product_id)

            except Exception as e:
                print(f"Error writing product to CSV: {e}")

    # Open CSV file in write mode to write new products
    with open(new_file_path, "w", newline="") as csvfile:
        # Define CSV writer
        writer = csv.writer(csvfile)

        # If the file is empty or doesn't exist
        if not file_exists or csvfile.tell() == 0:
            # Write a header row 
            writer.writerow(["ID", "Name", "Price", "ImageURL", "ProductType", "DateTime", "EventID", "Supplier", "ProductURL"])  # Write header

        # Write new products to CSV file
        for product in filtered_products:
            try:
                # Extract product data
                product_id = product.get("id", "")
                name = product.get("name", "")
                price = product.get("price", {}).get("current", {}).get("text", "")
                image_url = product.get("imageUrl", "")
                product_url = product.get("url", "")

                product_type = ""
                if category_counter == 1:
                    product_type = 'footwear'
                elif category_counter == 2:
                    product_type = 'accessories'
                else:
                    product_type = 'coatsandjackets'

                # Include event data
                date_time = date
                event_id = eventID
                vendor = supplier

                # Check if the product_id already exists in the existing_product_ids set
                if product_id not in existing_product_ids:
                    # Write product data to new product CSV file
                    writer.writerow([product_id, name, price, image_url, product_type, date_time, event_id, vendor, product_url])

            except Exception as e:
                print(f"Error writing product to CSV for new products: {e}")

    # Increment to change categories
    category_counter += 1

    # Clear array for next category
    all_items = []