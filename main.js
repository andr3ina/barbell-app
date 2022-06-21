// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const ff = require("fs");
const fs = require("fs").promises;
var express = require('express')
var app = express()
// ... puppeteer code
var result;
// URL of the page we want to scrape
const url = "https://app.wodify.com/WOD/WOD.aspx";

const puppeteer = require('puppeteer');


var http = require('http');

http.createServer(function (req, res) {
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello World!' + result);
}).listen(8080);

async function main() {

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const cookiesString = await fs.readFile('cookies.json');
  const cookies2 = JSON.parse(cookiesString);
  await page.setCookie(...cookies2);
  await page.setViewport({width: 1200, height: 720});
  await page.goto('https://app.wodify.com/WOD/WOD.aspx', { waitUntil: 'networkidle0' }); // wait until page load
  
  const path = "cookies.json";

  if (ff.existsSync(path)) {
    // path exists
    console.log("exists:", path);
  } else {
    
  //LOGIN
    
    
  await page.type('#Input_UserName', 'andri_sira@hotmail.com');
  await page.type('#Input_Password', 'osopolar');
  // click and wait for navigation

  await Promise.all([
    page.evaluate( () => document.getElementById("Checkbox1").checked = true),

    page.click('.signin-btn'),

    page.waitForNavigation({ waitUntil: 'networkidle0' }),

  ]);
  
  await Promise.all([
    page.select('#AthleteTheme_wtLayoutNormal_block_wtSubNavigation_wtcbDate', '30450'),
    //page.$eval('#AthleteTheme_wtLayoutNormal_block_wtSubNavigation_wttxtDate', el => el.value = '06/13/2022'),
    page.evaluate( () => document.getElementById("AthleteTheme_wtLayoutNormal_block_wtSubNavigation_wttxtDate").value = ""),
    page.evaluate( () => document.getElementById("AthleteTheme_wtLayoutNormal_block_wtSubNavigation_W_Utils_UI_wt3_block_wtDateInputFrom").value = ""),
    page.type('#AthleteTheme_wtLayoutNormal_block_wtSubNavigation_wttxtDate', ''),
    page.type('#AthleteTheme_wtLayoutNormal_block_wtSubNavigation_W_Utils_UI_wt3_block_wtDateInputFrom','06/20/2022'),
    page.keyboard.press('Enter'),
  ]);


  console.log("DOES NOT exist:", path);
  }

const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('.component_comment'))
    return tds.map(td => {
       var txt = td.innerHTML;
       //return txt.replace(/<a [^>]+>[^<]*<\/a>/g, '').trim();
       return txt;
    });
});

//You will now have an array of strings
//console.log('data' + data);

let exercise_name = await page.$$eval('.component_name', names => names.map(name => name.textContent));
//let percentages = await page.$$eval('.component_comment', exercises => exercises.map(exercises => exercises.textContent));

var arrayPercentages = [];
var i = 0;
data.forEach(percentage_weight => 
  {
    arrayPercentages.push([exercise_name[i], percentage_weight.match(/[0-9]+%\s?/g, '')]);
    i += 1;
  });


console.table('arrayPercentages' + arrayPercentages);
result = arrayPercentages;
await fs.writeFile('results.json', JSON.stringify(arrayPercentages, null, 2));


const cookies = await page.cookies();
await fs.writeFile('cookies.json', JSON.stringify(cookies, null, 2));
//browser.close()
}

main();



// Async function which scrapes the data
async function scrapeData(content) {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = content;
    // Load HTML we fetched in the previous line
    console.log(data);
    const $ = cheerio.load(content);
    // Select all the list items in plainlist class
    const listItems = $(".component_show_wrapper div");
    // Stores data for all countries
    const countries = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction
      const country = { name: "", iso3: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.name = $(el).children("component_name").text();
      country.iso3 = $(el).children("component_comment").text();
      // Populate countries array with country data
      countries.push(country);
    });
    // Logs countries array to the console
    console.dir(countries);
    // Write countries array in countries.json file
    fs.writeFile("coutries.json", JSON.stringify(countries, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data to file");
    });
  } catch (err) {
    console.error(err);
  }
}





      app.get('/results', function (req, res) {
        JSON.stringify(result);
      console.log(JSON.stringify(result));
      res.send(result);
      })
// Invoke the above function
