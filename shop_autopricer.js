// ==UserScript==
// @name         Shop Autopricer
// @version      1.0
// @description  Adds buttons that automatically checks for price of items based on JN Item Database and pass the info to the price input on your shop.
// @author       ramsestone
// @match        *://www.neopets.com/market.phtml?type=your*
// @match        *://www.neopets.com/market.*
// @match        *://www.neopets.com/market.phtml?order_by=id&type=your&lim=*
// @match        *://www.neopets.com/market_your.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var price_inputs = [];
var item_names = [];
var links_to_JN = [];
var item_prices = [];
var item_dicts = [];
const discount = 0.025 // How much in % apply based on JN price

const updateButton = document.getElementById('market-your-update');
var table = document.querySelector("#market-your-app > div > table")
if(table == null){
    table = document.querySelector("#content > table > tbody > tr > td.content > form > table > tbody")
    }
const rows = table.getElementsByTagName("tr")


function get_item_info() {
  for (i = 1; i < rows.length; i++) {
    const row = rows[i]
    //Saves all input fields on a list
    var price_input = row.querySelector(".market-your__cost-field > input");

    //Saves all item names in a list with the same index as their respective input feild
    var item_name = row.querySelector(".market-your-item__name").textContent
    // document.querySelector("#market-your-app > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > span > div > div.market-your-item__info > span.market-your-item__name")

    //Creates a search string for JN
    var name_for_link = item_name.replaceAll(" ", "+")
    var link = `https://items.jellyneo.net/search/?name=${name_for_link}&name_type=3`

    //Creates a dictionary
    item_dicts.push({
      "Item Name": item_name,
      "Link to JN": link,
      "Input Object": price_input
    })
  }
}

async function getPrice(link, input_objcet){
  const price = new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: 'GET',
      url: link,
      onload: function (response) {
        var allhtml = response.responseText
        var parsed_html = new DOMParser().parseFromString(allhtml, "text/html")
        var og_price = parsed_html.getElementsByClassName("price-history-link")[0].textContent
        var price = og_price.replace(",", "").replace(" NP", "")
        var price = parseInt(price) - (parseInt(price) * discount)
        var price = Math.round(price - (price * discount))
        var primerosDigitos = price.toString().slice(0, -2) + "00";
        resolve(primerosDigitos)
      }
    })
  })
  input_objcet.value = await price
  updateButton.disabled = false;
}

// Inject the custom CSS rules with !important flags to override site defaults
const customStyles = document.createElement('style');
customStyles.innerHTML = `
    .custom-skeuomorphic-btn {
        /* Force the green gradient over site defaults */
        background: linear-gradient(to bottom, #52c234 0%, #28841a 100%) !important;

        /* Force structural styling */
        border: 2px solid #1a1a1a !important;
        border-radius: 16px !important;
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.8),
                    inset 0 4px 4px rgba(255, 255, 255, 0.4) !important;

        /* Typography and layout */
        color: #111 !important;
        font-weight: bold !important;
        padding: 2px 10px !important;
        margin-left: 5px !important;
        cursor: pointer !important;

        /* Strip default OS/Browser button appearances */
        -webkit-appearance: none !important;
        appearance: none !important;

        transition: filter 0.1s !important;
    }

    .custom-skeuomorphic-btn:active {
        filter: brightness(0.85) !important;
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.8) !important;
    }
`;
document.head.appendChild(customStyles);

// 1. Encapsulated scanning function
// This function must scan the DOM from scratch every time it runs.
function getFreshItems() {
    const freshItems = [];

    // CRITICAL: We query the rows INSIDE the function so we always get the live DOM nodes.
    // Assuming your rows are standard table rows inside #market-your-app
    const rows = document.querySelectorAll('#market-your-app table tbody tr');

    // i = 1 skips the header row
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const priceInput = row.querySelector(".market-your__cost-field > input");
        const nameElement = row.querySelector(".market-your-item__name");

        // Safety validation to prevent null pointer exceptions
        if (priceInput && nameElement) {
            const itemName = nameElement.textContent.trim();
            const nameForLink = itemName.replaceAll(" ", "+");
            const link = `https://items.jellyneo.net/search/?name=${nameForLink}&name_type=3`;

            // Push to the local array, not a global one
            freshItems.push({
                "Item Name": itemName,
                "Link to JN": link,
                "Input Object": priceInput
            });
        }
    }

    return freshItems; // Returns the newly built array
}

// 2. Injection logic
function injectCustomButtons() {
    // Obtain the updated items directly from the live DOM
    const currentItems = getFreshItems();

    for (let i = 0; i < currentItems.length; i++) {
        const currentRow = currentItems[i];
        const targetInput = currentRow["Input Object"];
        const link = currentRow["Link to JN"];

        // Anti-duplication check: Is our custom button already next to this input?
        if (targetInput && targetInput.parentNode && !targetInput.parentNode.querySelector('.custom-skeuomorphic-btn')) {

            const priceButton = document.createElement("button");
            priceButton.classList.add('custom-skeuomorphic-btn');
            priceButton.innerHTML = "💲";

            targetInput.parentNode.appendChild(priceButton);

            priceButton.onclick = (e) => {
                e.preventDefault();
                // Pass the fresh targetInput to your existing async function
                getPrice(link, targetInput);
            };
        }
    }
}

// 3. Execute immediately on first load
injectCustomButtons();

// 4. Attach the MutationObserver to the main stable container
const tableContainer = document.querySelector('#market-your-app');

if (tableContainer) {
    const observer = new MutationObserver(() => {
        // When the app updates, wait 300ms for rendering to finish, then inject again
        setTimeout(() => {
            injectCustomButtons();
        }, 300);
    });

    observer.observe(tableContainer, {
        childList: true,
        subtree: true
    });

} else {
    console.error('Observer container #market-your-app was not found.');
}