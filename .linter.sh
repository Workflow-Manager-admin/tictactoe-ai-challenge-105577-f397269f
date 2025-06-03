#!/bin/bash
cd /home/kavia/workspace/code-generation/tictactoe-ai-challenge-105577-f397269f/tic_tac_toe
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

