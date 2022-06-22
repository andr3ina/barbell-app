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
var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var year = date_ob.getFullYear();
 
var date = month + "/" + day + "/" + year;

async function main() {

  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  try{
  const cookiesString = await fs.readFile('cookies.json');
  const cookies2 = JSON.parse(cookiesString);
  await page.setCookie(...cookies2);
}catch{
  
}
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
    page.type('#AthleteTheme_wtLayoutNormal_block_wtSubNavigation_W_Utils_UI_wt3_block_wtDateInputFrom',date),
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







// Invoke the above function
