import requests

class APIRequest:

    def __init__(self):
        
        self.BASE_URL = "http://192.168.99.100:5000/api"
        self.headers = {
            'Content-Type': "application/x-www-form-urlencoded",
            'cache-control': "no-cache"
        }
    
    def get(self, url, querystring):

        response = requests.request("GET", self.BASE_URL + url, headers=self.headers, params=querystring)
        return response.json()
    
    def post(self, url, querystring):

        response = requests.request("POST", self.BASE_URL + url, headers=self.headers, params=querystring)
        return response.json()
    
    def delete(self, url, querystring):

        response = requests.request("DELETE", self.BASE_URL + url, headers=self.headers, params=querystring)
        return response.json()