const express = require('express');
const app = express();
const port = 9090;
const bot = require('./bot');
require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/check-role/:userId', async (req, res) => {
    const { userId } = req.params;
    const guild = bot.guilds.cache.get(process.env.DISCORD_GUILD_ID);
    const roleId = process.env.DISCORD_ROLE_ID;
  
    if (!guild) {
      return res.status(404).send('Guild not found');
    }
  
    try {
      const member = await guild.members.fetch(userId);

      if (!member) {
        return res.status(404).send('Member not found');
      }
    
      const role = guild.roles.cache.get(roleId);
      if (!role) {
        return res.status(404).send('Role not found');
      }
    
      const hasRole = member.roles.cache.has(roleId);
      return res.json({ hasRole });
      
    } catch (error) {
      return res.status(404).send('Member not found');
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
