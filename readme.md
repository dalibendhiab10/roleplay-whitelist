# Discord Bot Role Checker

This is a sample Node.js and Lua project that demonstrates how to create a Discord bot using Discord.js and connect it with a Lua script on a game server to check if a player has a specific role.

## Discord Bot (Node.js)

### Prerequisites

- Node.js (>=12.0.0)
- npm

### Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies:

npm install


### Configuration

Create a `.env` file in the root of the project with the following content:

DISCORD_GUILD_ID=YOUR_DISCORD_GUILD_ID
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
DISCORD_ROLE_ID=YOUR_DISCORD_ROLE_ID


Replace `YOUR_DISCORD_GUILD_ID`, `YOUR_DISCORD_BOT_TOKEN`, and `YOUR_DISCORD_ROLE_ID` with the actual values from your Discord server and bot.

### Running the Bot

node app.js


The bot will now be active and connected to your Discord server.

## Lua Script (Player Connecting)

### Prerequisites

- A game server with Lua scripting support

### Usage

The `server.lua` file contains an example script that runs when a player is connecting to your game server. It communicates with the Discord bot's API to check if the player has the required role on the Discord server.

1. Create a new file named `server.lua` on your game server.
2. Copy the content of the provided `server.lua` into the new file.

### Configuration

Ensure that your game server is configured to support Lua scripting and has the necessary modules enabled for making HTTP requests.

In the `server.lua` file, update the `apiUrl` variable with the URL of your Discord bot's API, where the bot is running and listening for role-check requests.

### Full Example of server.lua

```lua
-- server.lua

-- Replace this with your actual bot API URL
local apiUrl = "http://localhost:9090/check-role/"

-- Function to make an HTTP request to the bot's API
local function makeApiRequest(playerSteamID)
    local req = http.request(apiUrl .. playerSteamID, function(res)
        local data = ""
        res.onData(function(chunk)
            data = data .. chunk
        end)

        res.onEnd(function()
            local result = json.decode(data)
            if result and result.hasRole then
                -- Player has the required role on the Discord server
                print("Player with SteamID " .. playerSteamID .. " has the required role.")
                -- Continue with your player connecting logic here (e.g., allow the player to join the game)
            else
                -- Player does not have the required role on the Discord server
                print("Player with SteamID " .. playerSteamID .. " does not have the required role.")
                -- Take appropriate actions for non-whitelisted players (e.g., kick or deny access)
            end
        end)
    end)

    req:onError(function(err)
        print("Error making API request: " .. err)
        -- Handle the error appropriately
    end)

    req:done()
end

AddEventHandler("playerConnecting", function(name, setKickReason, deferrals)
    local player = source
    local identifiers = GetPlayerIdentifiers(player)
    deferrals.defer()
    Wait(0)
    deferrals.update("🚀 • Verifying your SteamID")
    Wait(Config.Wait.steamId)

    local steamID
    for _, v in pairs(identifiers) do
        if string.find(v, "steam") then
            steamID = v
            break
        end
    end

    if not steamID then
        deferrals.done("We could not find your SteamID. Please ensure that Steam is running.")
    end

    deferrals.update("💡 • Checking your presence in the whitelist...")
    Wait(Config.Wait.whitelist)

    -- Make the API request to check if the player has the required role
    makeApiRequest(steamID)

    -- Continue with the rest of your player connecting logic in the API request callback
end)
Additional Notes
Ensure that your Discord bot has the necessary permissions on your server to access member information and roles.
Handle errors and edge cases appropriately in both the Discord bot and the Lua script.
Feel free to customize and expand upon this project to suit your specific requirements.
```
Happy coding!


Please make sure to adjust the `YOUR_DISCORD_GUILD_ID`, `YOUR_DISCORD_BOT_TOKEN`, and `YOUR_DISCORD_ROLE_ID` placeholders in the `.env` file and update the `apiUrl` in the `server.lua` file with the appropriate URL for your Discord bot's API.