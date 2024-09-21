from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException
import time

# Set up ChromeDriver path
CHROMEDRIVER_PATH = 'C:/Users/henry/Downloads/chromedriver-win64/chromedriver-win64/chromedriver.exe'

# Configure Chrome options
options = Options()
#options.add_argument('--headless')  # Run in headless mode (no GUI)
options.add_argument('--disable-gpu')  # Disable GPU acceleration
options.add_argument('--no-sandbox')  # Bypass OS security model
options.add_argument('--window-size=1920,1080')  # Set window size
options.add_argument("--remote-debugging-port=9222")
options.add_argument('--disable-extensions')  # Disable extensions

# Optional: Increase the timeouts
options.page_load_strategy = 'eager'

# Path to your Chrome profile
chrome_profile_path = "C:/Users/henry/AppData/Local/Google/Chrome/User Data"
options.add_argument(f"user-data-dir={chrome_profile_path}")

# Function to initialize the WebDriver with retries
def init_driver():
    for attempt in range(3):  # Retry up to 3 times
        try:
            service = Service(CHROMEDRIVER_PATH)
            driver = webdriver.Chrome(service=service, options=options)
            return driver
        except WebDriverException as e:
            print(f"WebDriver initialization failed (attempt {attempt + 1}/3): {e}")
            time.sleep(5)  # Wait before retrying
    raise Exception("Failed to initialize WebDriver after multiple attempts. Try closing all open web browsers before running again!")

def get_affiliate_link(amazon_url):
    driver = None
    try:
        driver = init_driver()

        # Provide the Amazon product URL
        driver.get(amazon_url)

        # Wait for the SiteStripe bar to load
        wait = WebDriverWait(driver, 15)

        # Select the short link from the SiteStripe
        try:
            # Wait until the SiteStripe Text link is clickable
            text_link = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[@title='Text']")))
            text_link.click()
            time.sleep(1)  # Allow time for the link to be selected

            # Wait until the short link textarea is visible
            short_link_textarea = wait.until(EC.visibility_of_element_located((By.XPATH, "//textarea[@id='amzn-ss-text-shortlink-textarea']")))
            short_link = short_link_textarea.get_attribute("value")
            
            print("Short Affiliate Link:", short_link)

            return short_link
            
        except Exception as e:
            print(f"Failed to retrieve short affiliate link: {e}")

    except Exception as e:
        print(f"An error occurred: {e}")
    
    finally:
        # Ensure that the WebDriver is closed properly
        if driver:
            driver.quit()

