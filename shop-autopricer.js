// ==UserScript==
// @name         Shop Autopricer
// @version      1.0
// @description  Adds buttons that automatically checks for price of items based on JN Item Database and pass the info to the price input on your shop.
// @author       ramsestone
// @match        *://*.neopets.com/market.phtml*
// @match        *://*.neopets.com/market_your.phtml*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var price_inputs = [];
var item_names = [];
var links_to_JN = [];
var item_prices = [];
var item_dicts = [];
const discount = 0.05 // How much in % apply based on JN price
const rows = document.querySelector("#content > table > tbody > tr > td.content > form:nth-child(14) > table").getElementsByTagName("tr")

//Creates a new column on all rows
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (i == 0 || i == rows.length -1) {
    const new_colum = document.createElement("td")
    new_colum.setAttribute('align', 'center')
    new_colum.setAttribute('bgcolor', '#dddd77')
    row.appendChild(new_colum)
  }
  else {
    const new_colum = document.createElement("td")
    new_colum.setAttribute('align', 'center')
    new_colum.setAttribute('bgcolor', '#ffffcc')
    row.appendChild(new_colum)
  }
}
//Adds content to each new column
var last_column = rows[0].lastChild
var text = document.createElement("b")
text.textContent = "Get Prices"
last_column.appendChild(text)
for (let i = 1; i < rows.length -3; i++) {
  const row = rows[i];
  let last_column = row.lastChild
  let button = document.createElement("button")
  button.innerHTML = "Get Price"
  button.style.marginBlock = "10px"
  last_column.appendChild(button)

  button.onclick = e => {
    e.preventDefault()
    let item = item_dicts[i - 1]
    item["Item Price"].then(price => {
      item["Input Object"].value = price.toString()
    })
  }
}
const check_all_prices = document.createElement("button");
check_all_prices.innerHTML = "Get All Prices";
check_all_prices.style.marginBlock = "10px";
var last_column = rows[rows.length - 1].lastChild
last_column.appendChild(check_all_prices)

check_all_prices.onclick = e => {
    e.preventDefault()
    input_prices(item_dicts)
}

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

    //Gets prices from JN
    const get_prices = (link) => {
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'GET',
          url: link,
          onload: function (response) {
            var allhtml = response.responseText
            var parsed_html = new DOMParser().parseFromString(allhtml, "text/html")
            var og_price = parsed_html.getElementsByClassName("price-history-link")[0].textContent
            var price = og_price.replace(",", "").replace(" NP", "")
            var price = parseInt(price) - (parseInt(price) * discount)
            resolve(Math.round(price))
          }
        })
      })
    }

    //Creates a dictionary
    item_dicts.push({
      "Item Name": item_name,
      "Link to JN": link,
      "Input Object": price_input,
      "Item Price": get_prices(link).then(price => {
        return price.toString()
      })
    })
  }

}

function input_prices(item_dicts){
  for (let i = 0; i < item_dicts.length; i++) {
    const current_item = item_dicts[i];
    current_item["Item Price"].then(price => {
      current_item["Input Object"].value = price.toString()
    })
  }
}



get_item_info()
