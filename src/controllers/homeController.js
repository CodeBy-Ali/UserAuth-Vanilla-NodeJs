import fs from 'fs/promises';
import path  from 'path';
import  config  from '../config/config.js';

export const viewHomePage = async (req, res) => {
  const filePath = path.join(config.dir.views, 'home.html');
  try {
    const homePage = await fs.readFile(filePath);
    res.writeHead(200, {"Content-Type": "text/html",}); 
    res.end(homePage);
  } catch (err) {
    res.writeHead(500,{"Content-Type": "application/json"});
    res.end(JSON.stringify({error: "Internal Server Error"}));
  }
}


 
 