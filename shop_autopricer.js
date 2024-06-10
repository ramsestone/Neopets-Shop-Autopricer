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
var table = document.querySelector("#content > table > tbody > tr > td.content > form:nth-child(14) > table > tbody")
console.log(table)
if(table == null){
    table = document.querySelector("#content > table > tbody > tr > td.content > form > table > tbody")
    }
const rows = table.getElementsByTagName("tr")


function get_item_info() {
  for (i = 1; i < rows.length - 3; i++) {
    const row = rows[i]
    //Saves all input fields on a list
    var price_input = row.getElementsByTagName("td")[4].querySelector("input");

    //Saves all item names in a list with the same index as their respective input feild
    var item_name = row.getElementsByTagName("td")[0].textContent

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
}


get_item_info()

//Creates and insert a button on the document
for (let i = 0; i < item_dicts.length; i++) {
  const price_button = document.createElement("button")
  price_button.innerHTML = "💲"
  price_button.style.marginLeft = "5px"

  const curent_row = item_dicts[i];
  const parent_node = curent_row["Input Object"].parentNode
  const link = curent_row["Link to JN"]
  const input = curent_row["Input Object"]
  parent_node.appendChild(price_button)

  price_button.onclick = e => {
    e.preventDefault()
    getPrice(link, input)
  }
}