# Import QRCode from pyqrcode 
import pyqrcode 
from pyqrcode import QRCode 


# String which represent the QR code 
s = "http://192.168.99.100/JustShareIt/dashboard"

# Generate QR code 
url = pyqrcode.create(s) 

# Create and save the png file naming "myqr.png" 
url.svg("../static/img/qrcode/qr.svg", scale = 8) 
