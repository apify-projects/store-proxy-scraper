## What is Proxy Scraper?

This online proxy scraper searches a number of different free-proxy websites and scrapes all of them. Then, optionally, it can test each of those proxies for you on a specified target and timeout, then only return back the proxies which pass the test. 

## Why use Proxy Scraper?
There are lots of free public proxies available out there, such as [Geonode](https://geonode.com/free-proxy-list/) and [free-proxy-list.net](https://free-proxy-list.net/). All proxies listed on these sites vary in terms quality, speed, and security. Some of them are painfully slow, while others don't work at all.

This proxy scraper tool is the best way to quickly obtain a list of working public proxies. It uses multithreading to run its automated tests in true concurrency while it scrapes multiple proxies simultaneously, and has a straightforward configuration process, fast runtimes, and reliable outputs. 

Proxy Scraper performs two key tasks every time you run it:
- It scrapes all currently available proxies from 17 different free proxy websites and APIs
- It individually tests each proxy

This makes the process of retrieving data from free proxy websites much more accessible, as it removes the need to check each proxy manually.

## Just need to scrape the web using proxies?
If you only want to use proxy servers for web scraping, [Apify Proxy](https://apify.com/proxy) gives you both residential and datacenter proxies, intelligent proxy rotation, and a large pool of IP addresses. Even better, if you run your web scrapers on the Apify platform, our industry-leading browser fingerprinting research will make your scraping bots indistinguishable from humans.

## How to use Proxy Scraper

1. Choose which proxies to use while scraping the proxies.
2. Select 'true' or 'false' to choose whether or not to test the proxies and only return the ones that pass.
3. Select 'true' or 'false' to choose whether or not to run the actor in debug mode.
4. Choose the name of the key-value store in which to save a .txt of the proxies.
5. Select your preferred 'build', 'timeout', and 'memory' options.
6. Click Start.
7. View and download your data in any of the available formats.

## What are Proxy Scraper's limitations?
Currently, Proxy Scraper can find anywhere from 20-60 reliable proxies out of the 2,500 that it scrapes every run. In the future, Proxy Scraper will scrape proxies from more than just the 17 sources currently being used.

## How much does it cost to use Proxy Scraper?
With an Apify Free plan, you can run the scraper 400 times (about 10 times a day to get a fresh list of working proxies). You get 4,000 runs with a Personal plan, and 40,000 runs with a Team plan. Check out [Apify pricing](https://apify.com/pricing) to see which plan is best for you.

## Input example
```JSON
{
    "testProxies": true,
    "testTimeout": 7,
    "testTarget": "https://google.com",
    "kvStoreName": "reliable-proxies-store",
    "pushToKvStore": true,
    "datasetName": "test-dataset"
}
```

## Output example
The output will be an array of objects looking like this:

```JSON
{
  "host": "164.27.6.74", // string
  "port": 8080, // number
  "full": "164.27.6.74:8080" // string
}
```

## What's happening under the hood?
1. All of the current proxies from these free proxy resources are added to the request queue (with certain filters applied):

-   https://free-proxy-list.net/
-   https://www.sslproxies.org/
-   https://www.us-proxy.org/
-   https://www.socks-proxy.net/
-   https://proxylist.geonode.com
-   https://geonode.com/free-proxy-list/
-   https://spys.one/en/
-   https://vpnoverview.com/privacy/anonymous-browsing/free-proxy-servers/
-   https://hidemy.name/en/proxy-list/
-   https://www.proxynova.com/proxy-server-list/
-   https://free-proxy-list.com/
-   https://anonymouse.cz/proxy-list/
-   https://www.coderduck.com/free-proxy-list
-   https://www.proxyrack.com/free-proxy-list/
-   https://www.proxy-list.download
-   https://www.proxyscan.io/
-   http://pubproxy.com

2. Each site is scraped, and the results are stored temporarily in a global state

3. Each scraped proxy is tested by making a request to a target URL specified by you with a specific timeout set. If the request fails, the proxy is removed from the list.

4. All duplicate results are cleaned from the list. 

5. The proxies are finally pushed to the dataset.
