#!/usr/bin/env python

import sys
import csv
import re
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from geocode.google import Geocoder

from localsettings import GOOGLE_API_KEY
from countries import COUNTRY_NAMES

db = MongoClient().inno2017
geocoder = Geocoder(GOOGLE_API_KEY)


def parse_date(date_str):
    match = re.match(r'(\d\d?)/(\d\d?)/(\d\d\d\d)', date_str)
    if match:
        return "%s-%s-%s" % (match.group(3), match.group(2), match.group(1))
    return None

def get_geocache(city, state, country):
    query = {
        "city": city,
        "country": country
    }
    if state:
        query["state"] = state
    return db.geocache.find_one(query)

def geocode(city, state, country):
    query = {
        "address": city,
        "country": COUNTRY_NAMES[country]
    }
    if state:
        query['administrative_area'] = state
    result = geocoder.geocode(**query)
    if result.is_success():
        location = result.get_location()
        return [float(x) for x in location]
    return None

def get_location(record):
    kwargs = {
        "city": record["Billing City"],
        "state": record["Billing State"],
        "country": record["Billing Country"]
    }
    cache = get_geocache(**kwargs)
    if cache:
        print "found geocache for %s" % repr(kwargs)
        return cache["location"]
    location = geocode(**kwargs)
    if location:
        kwargs["location"] = location
        db.geocache.insert_one(kwargs)
        return location
    return None

def insert(row):
    location = get_location(row)
    if not location:
        print "Invalid location %s" % repr(row)
        return
    record = {
        "_id": row["Account ID"],
        "account_status": row["Account Status"],
        "status": row["Status"],
        "it_owner": row["IT Owner"],
        "hr_owner": row["HR Owner"],
        "account_owner": row["Account Owner"],
        "account_manager": row["Account Manager"],
        "director": row["Director"],

        "account_name": row["Account Name"],
        "sales_segment": row["Sales Segment"],

        "location": {
          "city": row["Billing City"],
          "state": row["Billing State"],
          "country": row["Billing Country"],
          "latlng": location
        },
        "renewal_date": parse_date(row["Renewal Due Date"]),
        "industry": row["Top Level NAICS"],
        "site": row["Site Slug"],
        "product": row["Product: Product Name"],
        "monthly_value": float(row["Monthly Contract Value"])
    }
    try:
        db.accounts.insert_one(record)
        print "Inserted", row["Account Name"]
    except DuplicateKeyError:
        print "%s is already loaded" % row["Account Name"]


def load_csv(filename):
    data = []
    with open(filename) as f:
        reader = csv.DictReader(f)
        for row in reader:
            insert(row)

if __name__ == '__main__':
    load_csv(sys.argv[1])
