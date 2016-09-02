import re
import sys
import requests
from lxml import html
from tinydb import TinyDB, Query


def fetch_data(location, query):
  url = "https://www.leboncoin.fr/annonces/offres/%s/?th=1&q=%s" % (location, query)
  print 'GET %s' % url
  page = requests.get(url)
  tree = html.fromstring(page.content)
  result = tree.xpath("//a[contains(concat(' ',normalize-space(@class),' '), 'list_item')]")
  return result


def isPresent(result, db):
  m = re.search('\/([0-9]+).htm', result.xpath('@href')[0])
  Result = Query()
  return (len(db.search(Result.id == m.group(1))) != 0)


def filter_new_result(results, db):
  return [result for result in results if not isPresent(result, db)]


def notify_new_result(result):
  print "%s %s" % ('https:' + result.xpath('@href')[0], result.xpath('@title')[0])


def save_result(result, db):
  m = re.search('\/([0-9]+).htm', result.xpath('@href')[0])
  db.insert({'id': m.group(1), 'url': result.xpath('@href')[0], 'title': result.xpath('@title')[0]})

if __name__ == '__main__':
  if len(sys.argv) != 3:
    print "usage: lbc ile_de_france Triban%20520"
  db = TinyDB('lbc.db.json')
  for new_result in filter_new_result(fetch_data(sys.argv[1], sys.argv[2]), db):
    notify_new_result(new_result)
    save_result(new_result, db)
