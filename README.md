# Obsidian-Birthday-Tracker-Plugin

[![Latest Release](https://img.shields.io/github/v/release/Raboro/Obsidian-Birthday-Tracker-Plugin?include_prereleases&sort=semver&style=for-the-badge)](https://github.com/Raboro/Obsidian-Birthday-Tracker-Plugin/releases/latest) [![Total Downloads](https://img.shields.io/github/downloads/Raboro/Obsidian-Birthday-Tracker-Plugin/total?style=for-the-badge)](https://github.com/Raboro/Obsidian-Birthday-Tracker-Plugin/releases/latest)
[![Linter Workflow Status](https://img.shields.io/github/actions/workflow/status/Raboro/Obsidian-Birthday-Tracker-Plugin/linter.yml?branch=master&logo=github&style=for-the-badge)](https://github.com/Raboro/Obsidian-Birthday-Tracker-Plugin/actions/workflows/linter.yml)
[![Release Workflow Status](https://img.shields.io/github/actions/workflow/status/Raboro/Obsidian-Birthday-Tracker-Plugin/release.yml?branch=master&logo=github&style=for-the-badge)](https://github.com/Raboro/Obsidian-Birthday-Tracker-Plugin/actions/workflows/release.yml)

This plugin allows you to keep track of all birthdays of your family and friends.

![Demo image](assets/demoPlugin.png)

## Using
You need a file containing all the birthday data.
To find this file you need to add the location in the settings. After that you can add your persons with:
``name=<name of the person>; birthday=<date of their birth>`` \
For example: ``name=Peter Rudolf; birthday=17/08/2033``.
You need the add all those persons line after line:
```
name=Peter Rudolf; birthday=17/08/2033
name=Hans Ap; birthday=01/05/2004
name=Mats Mattis; birthday=21/03/1999
```

After that you can click on the ribbon icon or use the command to trigger the plugin. \
You will receive a notice for all persons who have birthday today and get in a separate view an overview over all persons sorted by their next birthday.

### Year View
You can also use the **Year View** to get an overview over all birthdays. You can also click on the names to get more infomation of this person.

![image](https://github.com/Raboro/Obsidian-Birthday-Tracker-Plugin/assets/88288557/9b2a1915-3e2a-42e7-ba94-e6140b484ff4)


## Settings
You can set a date formatting. The default is: ``DD/MM/YYYY``. This is needed to collect your dates and display them. Also you can set the location of the file containing the birthday data. This must include `.md` as postfix. The default value is: `birthdayNode.md`

![Demo settings](assets/demoSettings.png)
