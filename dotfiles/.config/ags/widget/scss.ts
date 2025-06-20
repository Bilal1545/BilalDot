import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import option from './options.js';

export default function Scss() {

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

  // 1. Sadece option.scss varsa işle
  if (!option.scss) {
    print("SCSS ayarı yok.");
    return;
  }

  // 2. SCSS objesini düzleştir
  const flat = flatten(option.scss);

  // 3. SCSS içeriğini oluştur
  const scssContent = toScssVars(flat);

  // 4. Cache dizini ve dosya yolunu ayarla
  const cacheDir = GLib.build_filenamev([GLib.get_home_dir(), '.cache', 'bilaldot']);
  const filePath = GLib.build_filenamev([cacheDir, 'ags.scss']);

  // 5. Dizin yoksa oluştur
  GLib.mkdir_with_parents(cacheDir, 0o755);

  // 6. Dosyayı yaz
  const file = Gio.File.new_for_path(filePath);
  const outputStream = file.replace(null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
  outputStream.write_all(scssContent, null);
  outputStream.close(null);
}
