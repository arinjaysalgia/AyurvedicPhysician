#!/bin/bash
lsof -ti:4321 | xargs kill -9 2>/dev/null
echo "Dev server stopped."
