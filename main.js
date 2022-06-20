// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;

// ... puppeteer code

// URL of the page we want to scrape
const url = "https://app.wodify.com/WOD/WOD.aspx";

const puppeteer = require('puppeteer');
//test commit 234234


async function main() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const cookiesString = await fs.readFile('cookies.json');
const cookies2 = JSON.parse(cookiesString);
await page.setCookie(...cookies2);
  await page.setViewport({width: 1200, height: 720});
  await page.goto('https://app.wodify.com/WOD/WOD.aspx', { waitUntil: 'networkidle0' }); // wait until page load
  
  /*
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
*/
/*
 const data = await page.evaluate(() => {
    let results = [];

    let items = document.getElementsByClassName('component_show_wrapper');
    console.log(items);
    /*
    items.forEach(item => {
         results.push({
            name: item.querySelector('component_name').innerHTML,
            title: item.querySelector('component_comment').innerHTML,
        });
        
    });
    
  
return results;
    
});

*/
const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('.component_comment'))
    return tds.map(td => {
       var txt = td.innerHTML;
       //return txt.replace(/<a [^>]+>[^<]*<\/a>/g, '').trim();
       return txt;
    });
});

//You will now have an array of strings
console.log('data' + data[0]);

//scrapeData(data);
    let exercise_name = await page.$$eval('.component_name', names => names.map(name => name.textContent));
    let percentages = await page.$$eval('.component_comment', exercises => exercises.map(exercises => exercises.textContent));

    console.log('names' + exercise_name);
    console.log('percentages' + percentages);

    await fs.writeFile('results.json', JSON.stringify(percentages, null, 2));


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
// Invoke the above function
