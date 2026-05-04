import { loadContentCatalog } from './content.loader';

async function main() {
  const catalog = await loadContentCatalog();
  const themeCount = catalog.reduce((total, game) => total + game.themes.length, 0);
  const lessonCount = catalog.reduce(
    (total, game) => total + game.themes.reduce((sum, theme) => sum + theme.lessons.length, 0),
    0,
  );
  const questionCount = catalog.reduce(
    (total, game) => total + game.themes.reduce((sum, theme) => sum + theme.questions.length, 0),
    0,
  );

  console.log(
    `Content OK: ${catalog.length} games, ${themeCount} themes, ${lessonCount} lessons, ${questionCount} questions.`,
  );
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
