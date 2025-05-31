import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import option from './option.ts';

export default function Scss() {
/**
 * İç içe JS objesini düzleştir: { a: { b: 1 } } → { "a.b": 1 }
 */
function flatten(obj, prefix = '') {
    const result = {};

    for (const key in obj) {
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(result, flatten(value, path));
        } else {
            result[path] = value;
        }
    }

    return result;
}

/**
 * SCSS değişkeni formatına çevir
 */
function toScssVars(flatOptions) {
    return Object.entries(flatOptions).map(([key, value]) => {
        const scssKey = key.replace(/\./g, '-');
        let scssValue;

        if (typeof value === 'boolean')
            scssValue = value ? 'true' : 'false';
        else if (typeof value === 'string')
            scssValue = `"${value}"`;
        else
            scssValue = value;

        return `$${scssKey}: ${scssValue};`;
    }).join('\n');
}

// 1. Option objesini düzleştir
const flat = flatten(option);

// 2. SCSS içeriği oluştur
const scssContent = toScssVars(flat);

// 3. Dosya yolu belirle
const cacheDir = GLib.build_filenamev([GLib.get_home_dir(), '.cache', 'bilaldot']);
const filePath = GLib.build_filenamev([cacheDir, 'ags.scss']);

// 4. Dizin yoksa oluştur
GLib.mkdir_with_parents(cacheDir, 0o755);

const file = Gio.File.new_for_path(filePath);
const outputStream = file.replace(null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
outputStream.write_all(scssContent, null);
outputStream.close(null);
}

