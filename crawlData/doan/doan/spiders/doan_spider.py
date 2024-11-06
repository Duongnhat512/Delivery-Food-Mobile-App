import scrapy


class DoanSpiderSpider(scrapy.Spider):
    name = "doan_spider"
    allowed_domains = ["shopeefood.vn"]
    start_urls = ["https://shopeefood.vn/ho-chi-minh/danh-sach-dia-diem-giao-tan-noi"]

    def parse(self, response):
        pass
