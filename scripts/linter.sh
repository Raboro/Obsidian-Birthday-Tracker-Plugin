#!/bin/bash

echo -e "\ntry to fix all issues if present"

bun run biome:write

git commit -am "refactor(GHActionbot): :art: formatted & linting & organized imports with biome"

echo -e "\ncheck all issues fixed"

bun run biome:ci
biome_exit_code=$?

if [ $biome_exit_code -ne 0 ]; then
    echo "Biome errors still exist. Exiting."
    exit 1
fi