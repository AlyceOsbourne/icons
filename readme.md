## Features

- **Easy Integration**: Seamlessly add SVG icons to your Obsidian notes.
- **Dynamic Loading**: Dynamically load icons directly from the `packs` folder within your Obsidian vault.

## Getting Started

To leverage the power of custom SVG icons within Obsidian, you'll need to install the plugin using Obsidian's BRAT (Beta Reviewer's Advanced Toolkit). Follow these steps to get started:

### Installation using BRAT

1. Open Obsidian and go to `Settings`.
2. Navigate to `Community plugins` and disable `Safe mode`.
3. Click on `Browse` and then switch to the `BRAT` tab.
4. Search for the **Icons** plugin and install it.

### Using SVG Packs

To use icons, you must first download your desired SVG packs. Here's how to prepare them:

#### Downloading SVG Packs

1. Choose an SVG pack from a reputable source such as:
   - [FontAwesome](https://fontawesome.com)
   - [Material Icons](https://material.io/resources/icons/)
   - [Feather Icons](https://feathericons.com)

#### Adding SVG Packs to Your Project

1. Extract the downloaded SVG pack.
2. Locate the `packs` folder in your Obsidian vault's plugin directory. Create one if it doesn't exist.
3. Copy the extracted SVG files into the `packs` folder.

Your directory structure should now resemble:

```plaintext
.obsidian/
└── plugins/
    └── icons/
        └── packs/
            ├── pack1/
            │   ├── icon1.svg
            │   ├── icon2.svg
            │   └── ...
            └── pack2/
                ├── icon1.svg
                └── icon2.svg
```

### Configuring Icons

To utilize icons within your notes:

1. **Icon Tag**: Use the following syntax to embed an icon:
   - Syntax: \`:pack|name:\`
     - `pack`: Specifies the folder name inside the `packs` directory.
     - `name`: Specifies the filename of the SVG icon (excluding the `.svg` extension).

Embedding this tag in your notes allows inline display of icons. For setting a note's icon in the file explorer, add this to your front matter:

```yaml
icon: ":pack|name:"
```

This configuration will set the desired icon for your note.