#!/bin/bash

echo -e "\ntry to fix all issues if present"

bun run lint:fix

git commit -am "refactor(GHActionbot): :art: formatted & linting & organized imports with biome"

echo -e "\ncheck all issues fixed"

bun run lint
eslint_exit_code=$?

if [ $eslint_exit_code -ne 0 ]; then
    echo "Eslint errors still exist. Exiting."
    exit 1
fi