# Neopets-Shop-Autopricer
Tampermonkey userscript that helps with pricing items in your shop.
It uses Jellyneo’s Item Database to collect the most recent average price. Additionally, you can apply a discount by changing the variable “discount” on line 16 (default is 0.05, which equals 5% off).

![20240610-0057-15 1136227-ezgif com-video-to-gif-converter](https://github.com/ramsestone/Neopets-Shop-Autopricer/assets/74755255/0617558c-cdaf-491d-9b39-909e3c4208c9)

## Disclaimer
**I'm not responsible for anything that happens to your account.** This script should be safe to use since it doesn’t send anything to Neopets’ servers, as you still have to click the "update" button manually.

## Installation

1. You need to install Tampermonkey or Greasemonkey (if you’re using Firefox).
2. Copy the raw content of 'shop-autopricer.js'.
3. Go to your userscripts dashboard and create a new script.
4. Paste the code you copied in step 2, save changes, and you're done!

Alternatively, you can just drag and drop **'shop-autopricer.js'** to your Tampermonkey dashboard to install it.

Once installed, you'll find new buttons in your shop. The first time, you'll receive a request to accept **cross-origin resources**. This is necessary for the script to send a request to Jellyneo. Click on 'Always allow'.
