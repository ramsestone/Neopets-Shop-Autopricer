# Neopets Shop Autopricer

**Neopets Shop Autopricer** is a Tampermonkey userscript for Neopets. This script helps you automatically price items in your shop using the most recent average prices from Jellyneo’s Item Database.

![20240610-0057-15 1136227-ezgif com-video-to-gif-converter](https://github.com/ramsestone/Neopets-Shop-Autopricer/assets/74755255/ab1a8497-509c-464f-a5eb-319b7e402144)

## Disclaimer
I'm not responsible for any actions taken against your account as a result of using this script. Use at your own risk. This script is designed to be safe, as it does not send any data to Neopets' servers; you still need to manually click a button.

## Features
- Automatically fetches the most recent average prices from Jellyneo’s Item Database.
- Allows you to apply a discount to the fetched prices.

## Installation
### Step 1: Install Tampermonkey
If you haven't already, you'll need to install Tampermonkey. Follow the instructions for your browser:

- [Tampermonkey for Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
- [Tampermonkey for Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)
- [Tampermonkey for Safari](https://tampermonkey.net/?ext=dhdg&browser=safari)
- [Tampermonkey for Microsoft Edge](https://tampermonkey.net/?ext=dhdg&browser=edge)

### Step 2: Install the Script
1. Copy the raw content of `shop-autopricer.js`.
2. Open the Tampermonkey dashboard by clicking on the Tampermonkey icon in your browser toolbar and selecting 'Dashboard'.
3. Click on the 'Add a new script' button (a '+' icon).
4. Delete any content in the editor and paste the copied script code.
5. Save the script by clicking on the 'File' menu and selecting 'Save' (or pressing `Ctrl+S`).

Alternatively, you can drag and drop `shop-autopricer.js` directly into your Tampermonkey dashboard to install it.

### Step 3: Using the Script
1. Go to your shop on Neopets.
2. You will find new buttons added by the script.
3. The first time you use the script, you’ll receive a request to accept cross-origin resources. This is necessary for the script to send a request to Jellyneo. Click on ‘Always allow’.
4. The script will fetch the latest prices and apply the discount if set.

## Notes
- Ensure you are logged into Neopets for the script to function correctly.
- You can change the discount by modifying the variable “discount” on line 16 of the script (default is 0.05, which equals 5% off).

## Contributing
Feel free to submit issues or pull requests to improve the script.
