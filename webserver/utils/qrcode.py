# Import QRCode from pyqrcode 
import pyqrcode 
from pyqrcode import QRCode 

class GenerateQRCode:

    def __init__(self):

        pass

    def store_code(self, url):

        # Generate QR code 
        qrcode = pyqrcode.create(url)
        
        # Create and save the png file naming "myqr.png" 
        qrcode.svg("./static/img/qrcode/qr.svg", scale = 10)