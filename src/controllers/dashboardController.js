import path from 'path';
import fs from 'fs/promises';
import config from '../config/config.js';
import { populateTemplate } from '../util/template.util.js';

export const viewDashboard = async (req, res) => {
  const { email,joinDate } = req.user;
  const user = email.slice(0, email.indexOf('@'));
  const filePath = path.join(config.dir.views, 'dashboard.html');
  try {
    const data = await fs.readFile(filePath);
    let dashboardPage = populateTemplate(data.toString(), {
      user,
      email,
      joinDate,
    });    
    res.writeHead(200, {"Content-Type": "text/html",});
    res.end(dashboardPage);
  } catch (err) {
    console.log(err)
    res.writeHead(500,{"Content-Type": "application/json"});
    res.end(JSON.stringify({error: "Internal Server Error"}));
  }
}