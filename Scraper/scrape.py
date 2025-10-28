import logging
import json
import requests
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s — %(levelname)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

API_URL = "http://127.0.0.1:5000/jobs"

def save_job_to_api(job):
    """Send job to backend API."""
    try:
        response = requests.post(API_URL, json=job)
        if response.status_code == 201:
            logging.info(f"✅ Saved: {job['title']} at {job['company']}")
        elif response.status_code == 409:
            logging.info(f"⚠️ Skipped duplicate: {job['title']} at {job['company']}")
        else:
            logging.warning(f"⚠️ Failed to save {job['title']}: {response.text}")
    except Exception as e:
        logging.error(f"❌ Error saving job '{job.get('title', 'unknown')}': {e}")

def scrape_jobs():
    logging.info("🚀 Starting scraper...")

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    url = "https://www.actuarylist.com/"
    logging.info(f"🌐 Opening URL: {url}")
    driver.get(url)

    # Wait for JS to populate __NEXT_DATA__
    time.sleep(5)

    logging.info("📦 Extracting job data from window.__NEXT_DATA__...")
    data = driver.execute_script("return window.__NEXT_DATA__?.props?.pageProps;")

    if not data or "filteredJobs" not in data:
        logging.error("❌ Could not find job data in window.__NEXT_DATA__")
        driver.quit()
        return

    jobs = data["filteredJobs"]
    logging.info(f"🧾 Found {len(jobs)} jobs on this page")

    for idx, job in enumerate(jobs, start=1):
        try:
            title = job.get("position", "N/A")
            company = job.get("company", "N/A")
            location = job.get("cities", ["Unknown"])[0] if job.get("cities") else "Unknown"
            country = job.get("countries", {}).get("label", "Unknown")
            job_type = ", ".join(job.get("sectors", [])) if job.get("sectors") else "N/A"
            tags = ", ".join(job.get("tags", [])) if job.get("tags") else "N/A"
            posting_date = job.get("created_at", "N/A")

            job_data = {
                "title": title,
                "company": company,
                "location": f"{location}, {country}",
                "job_type": job_type,
                "tags": tags,
                "posting_date": posting_date,
            }

            logging.info(f"({idx}) Extracted: {title} — {company} — {location}, {country}")
            save_job_to_api(job_data)
        except Exception as e:
            logging.error(f"❌ Error parsing job #{idx}: {e}")

    driver.quit()
    logging.info("🏁 Scraper finished successfully!")

if __name__ == "__main__":
    scrape_jobs()
