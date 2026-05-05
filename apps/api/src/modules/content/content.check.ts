import { buildContentCatalogManifest, loadContentCatalog } from './content.loader';

async function main() {
  const catalog = await loadContentCatalog();
  const manifest = buildContentCatalogManifest(catalog);

  console.log(
    `Content OK: ${manifest.gameCount} games, ${manifest.themeCount} themes, ${manifest.lessonCount} lessons, ${manifest.questionCount} questions, version ${manifest.version}.`,
  );
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
