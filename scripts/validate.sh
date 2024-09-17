#!/bin/bash

ends_not_with_period() {
    local string="$1"
    if [ "${string: -1}" == "." ]; then
        return 0
    else
        return 1
    fi
}

package_name=$(node -pe "require('./package.json').name")
manifest_id=$(node -pe "require('./manifest.json').id")
package_description=$(node -pe "require('./package.json').description")
manifest_description=$(node -pe "require('./manifest.json').description")

echo -e "\nvalidate that package.json and manifest.json names are equal"

if [ "$package_name" != "$manifest_id" ]; then
    echo "Name mismatch between package.json and manifest.json. Exiting."
    exit 1
fi

echo "validate that package.json and manifest.json descriptions are equal"

if [ "$package_description" != "$manifest_description" ]; then
    echo "Description mismatch between package.json and manifest.json. Exiting."
    exit 1
fi

echo "validate that names and descriptions are not empty"

if [ -z "$package_name" ] || [ -z "$package_description" ]; then
    echo "Name or description is empty in package.json. Exiting."
    exit 1
fi

echo "validate that discription not contains'obsidian' and 'plugin'"

if [ "$package_description" == "obsidian" ] || [ "$package_description" == "plugin" ]; then
    echo "Description in package.json contains obsidian or plugin, which is bad"
    exit 1
fi

echo -e "validate that descripltion ends with '.'\n"

if ! ends_not_with_period "$package_description"; then
    echo "Description not ending with '.'"
    exit 1
fi