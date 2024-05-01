Overview
The IconPlugin enhances your Obsidian experience by allowing custom icons to be used in Markdown files and the file explorer based on metadata or specific syntax within your notes. It searches for icon indications within your notes and dynamically replaces them with SVG icons, rendering them inline.

Features
Dynamic Icon Replacement: Automatically replaces specified icon placeholders in Markdown files with SVG icons.
File Explorer Icons: Displays custom icons next to files in the file explorer if specified in the file's frontmatter.
Customizable Icon Sizes and Colors: Icons adjust to the text size and inherit the current text color.
Installation
Download the latest release from the GitHub Releases page.
Extract the plugin into your .obsidian/plugins directory.
Reload Obsidian.
Enable the plugin via Settings > Community Plugins > Browse.
Usage
To use custom icons in your Markdown files, add placeholders in the format :folderName|iconName:. For example, using :flags|us: will render the U.S. flag if it exists in the specified folder within your icon packs.

Including Extra Icon Packs
To include extra icon packs in the IconPlugin:

Prepare your SVG icons and organize them into folders by category or pack name.
Place these folders in the .obsidian/plugins/icons/packs/ directory in your vault.
Reference icons in your notes or frontmatter using the format specified above (:folderName|iconName:).