#!/bin/bash
cd "/Users/yuxianggu/Desktop/trae project/mindplay"
# Open new Terminal tab and run the server
osascript -e 'tell application "Terminal" to do script "cd \"/Users/yuxianggu/Desktop/trae project/mindplay\" && npm run dev"'
# Wait for server to start
sleep 3
# Open browser
open "http://localhost:3000"
