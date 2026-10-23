/* global __dirname */
const fs = require('node:fs');
const path = require('node:path');

// Executar sobre uma exportação concluída; não lê .env nem inclui arquivos fora dos assets públicos.
function prepareOfflineAssets(directory) {
  const root = path.resolve(directory);
  if (!fs.existsSync(path.join(root, 'index.html'))) throw Error('Informe a pasta de uma exportação web concluída.');
  const assets = [];
  for (const category of ['user', 'stations']) {
    const folder = path.join(root, 'assets/src/assets', category);
    if (!fs.existsSync(folder)) throw Error(`Exportação sem fotos locais de ${category}.`);
    for (const name of fs.readdirSync(folder).sort()) {
      const file = path.join(folder, name);
      if (/\.(webp|png|jpe?g)$/i.test(name) && fs.lstatSync(file).isFile()) assets.push(`/assets/src/assets/${category}/${name}`);
    }
  }
  if (!assets.length) throw Error('Nenhuma foto local encontrada.');
  const manifest = { version: 1, assets };
  fs.writeFileSync(path.join(root, 'offline-assets.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}
module.exports = { prepareOfflineAssets };
if (require.main === module) {
  try { const result = prepareOfflineAssets(process.argv[2] || 'dist'); console.log(`Manifesto offline: ${result.assets.length} fotos locais.`); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
