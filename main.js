const obsidian = require('obsidian');
const fs = require('fs');
const path = require('path');

class IconPlugin extends obsidian.Plugin {
    settings = {
        iconProperty: 'icon'
    };

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new IconPluginSettingTab(this.app, this));

        this.app.workspace.onLayoutReady(() => {
            this.app.vault.getMarkdownFiles().forEach((file) => this.update(file));
        });

        this.registerEvent(
            this.app.metadataCache.on('changed', (file) => this.update(file))
        );

        this.registerMarkdownPostProcessor((el, ctx) => {
            const codeNodes = Array.from(el.querySelectorAll('code'));
            codeNodes.forEach(node => {
                const matches = node.textContent.match(/(?<!"):(.+?)(?:\\\|)?\|[^:]+:(?!")/g);
                if (matches) {
                    matches.forEach(match => {
                        const unescapedMatch = match.replace('\\|', '|');  // Unescape the match for further processing
                        const [folder, icon] = unescapedMatch.slice(1, -1).split('|').map(s => s.trim());
                        const iconPath = this.getIconPath(folder, icon);
                        fs.readFile(iconPath, 'utf8', (err, data) => {
                            if (err) {
                                console.error(`Error loading icon: ${err}`);
                                return;
                            }
                            const iconHtml = `<span class="custom-icon">${data}</span>`;
                            node.innerHTML = node.innerHTML.replace(match, iconHtml);
                            node.style.backgroundColor = 'transparent';
                            const svg = node.querySelector('svg');

                            const fontSize = window.getComputedStyle(node.parentElement).fontSize;
                            svg.setAttribute('width', fontSize);
                            svg.setAttribute('height', fontSize);
                            svg.style.fill = 'currentColor';
                        });
                    });
                }
            });
        });

        this.addCommand({
            id: 'open-icon-browser',
            name: 'Browse Icons',
            hotkeys: [{ modifiers: ["Mod", "Shift"], key: "I" }],

            callback: () => this.openIconBrowser()
        });
    }

    async openIconBrowser() {
        const modal = new obsidian.Modal(this.app);
        modal.titleEl.setText('Browse Icons');
        const { contentEl } = modal;
        const searchContainer = contentEl.createEl('div');
        searchContainer.style.position = 'sticky';
        searchContainer.style.top = '0';
        searchContainer.style.zIndex = '10';
        const searchInput = searchContainer.createEl('input', { type: 'text', placeholder: 'Search icons...' });
        searchInput.style.margin = '10px 0';
        searchInput.style.width = 'calc(100% - 20px)';
        const icons = await this.scanIconsFolder();
        const table = contentEl.createEl('table', { cls: 'icon-table' });
        table.style.width = '100%';
        const thead = table.createEl('thead');
        const tbody = table.createEl('tbody');
        const tr = thead.createEl('tr');
        tr.createEl('th').setText('Icon');
        tr.createEl('th').setText('Tag');
        icons.forEach(icon => {
            const tr = tbody.createEl('tr');
            const td = tr.createEl('td');
            td.innerHTML = icon.data;
            const td2 = tr.createEl('td');
            td2.setText(icon.tag);
            tr.onClickEvent(() => {
                navigator.clipboard.writeText(icon.tag);
                new obsidian.Notice('Icon tag copied to clipboard!');
            });
        });
        table.querySelectorAll('svg').forEach(svg => {
            svg.setAttribute('width', '24');
            svg.setAttribute('height', '24');
            svg.style.fill = 'currentColor';
        });
        searchInput.addEventListener('input', () => {
            const value = searchInput.value.toLowerCase();
            tbody.querySelectorAll('tr').forEach(row => {
                const tag = row.children[1].textContent.toLowerCase();
                row.style.display = tag.includes(value) ? '' : 'none';
            });
        });
        modal.contentEl.style.maxHeight = '500px';
        modal.contentEl.style.overflowY = 'auto';
        modal.open();
    }

    async scanIconsFolder() {
        const basePath = this.app.vault.adapter.basePath;
        const iconDirPath = path.join(basePath, '.obsidian/plugins/icons/packs');
        const icons = [];
        try {
            const folders = fs.readdirSync(iconDirPath);
            for (const folder of folders) {
                const files = fs.readdirSync(path.join(iconDirPath, folder));
                files.forEach(file => {
                    if (path.extname(file).toLowerCase() === '.svg') {
                        const data = fs.readFileSync(path.join(iconDirPath, folder, file), 'utf8');
                        icons.push({
                            name: file,
                            data: data,
                            tag: `:${folder} | ${path.basename(file, '.svg')}:`
                        });
                    }
                });
            }
        } catch (err) {
            console.error('Failed to read icons folder:', err);
        }
        return icons;
    }

    update(file) {
        const metadata = this.app.metadataCache.getFileCache(file);
        const element = this.getElement(file);
        if (element && metadata.frontmatter && metadata.frontmatter[this.settings.iconProperty]) {
            this.applyStyles(element, metadata.frontmatter[this.settings.iconProperty]);
        } else if (element) {
            this.removeStyles(element);
        }
    }

    getElement(file) {
        const explorer = this.app.workspace.getLeavesOfType('file-explorer')[0].view;
        if (explorer.fileItems[file.path]) {
            return explorer.fileItems[file.path].el;
        }
        return null;
    }

    applyStyles(element, icon) {
        const titleElement = element.querySelector('.nav-file-title-content');
        if (titleElement) {
            let iconElement = titleElement.querySelector('.custom-icon');
            if (!iconElement) {
                iconElement = document.createElement('span');
                iconElement.className = 'custom-icon';
                titleElement.prepend(iconElement);
            }

            const [folderName, iconName] = icon.slice(1, -1).split('|').map(s => s.trim());

            const iconPath = this.getIconPath(folderName, iconName);
            fs.readFile(iconPath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error loading icon:', err);
                    return;
                }
                iconElement.innerHTML = data;
                const svg = iconElement.querySelector('svg');
                const fontSize = window.getComputedStyle(titleElement).fontSize;
                svg.setAttribute('width', fontSize);
                svg.setAttribute('height', fontSize);
                svg.style.fill = 'currentColor';
            });
        }
    }

    removeStyles(element) {
        const titleElement = element.querySelector('.nav-file-title-content');
        if (titleElement) {
            const iconElement = titleElement.querySelector('.custom-icon');
            if (iconElement) {
                iconElement.remove();
            }
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, this.settings, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    getIconPath(folderName, iconName) {
        const basePath = this.app.vault.adapter.basePath;
        return path.join(basePath, `.obsidian/plugins/icons/packs/${folderName}`, `${iconName}.svg`);
    }
}

class IconPluginSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Icon Plugin Settings'});

        new obsidian.Setting(containerEl)
            .setName('Icon Property Name')
            .setDesc('The frontmatter property name to use for icons.')
            .addText(text => text
                .setPlaceholder('Enter property name')
                .setValue(this.plugin.settings.iconProperty)
                .onChange(async (value) => {
                    this.plugin.settings.iconProperty = value.trim();
                    await this.plugin.saveSettings();
                }));
    }
}

module.exports = IconPlugin;