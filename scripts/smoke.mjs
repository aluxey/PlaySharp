/* global URL, console, fetch, process */

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const repoRoot = process.cwd();
const apiPort = Number(process.env.SMOKE_API_PORT ?? 3101);
const webPort = Number(process.env.SMOKE_WEB_PORT ?? 3100);
const apiOrigin = `http://127.0.0.1:${apiPort}`;
const apiBaseUrl = `${apiOrigin}/api`;
const webOrigin = `http://127.0.0.1:${webPort}`;

await verifyBuildArtifacts();
await runCommand(
  'npm',
  ['run', 'prisma:generate', '--workspace', '@playsharp/api'],
  'Prisma client generation',
);

const apiServer = startServer('api', ['run', 'start', '--workspace', '@playsharp/api'], {
  API_PORT: String(apiPort),
  PORT: String(apiPort),
  WEB_APP_URL: webOrigin,
  NODE_ENV: 'production',
});

let webServer = null;

try {
  await waitForServer(apiServer, 'API health check', async () => {
    const response = await fetch(`${apiBaseUrl}/health`);
    assert.equal(response.status, 200, 'API health should return HTTP 200');

    const payload = await response.json();
    assert.equal(payload.status, 'ok');
    assert.equal(payload.service, 'api');
  });

  webServer = startServer(
    'web',
    [
      'run',
      'start',
      '--workspace',
      '@playsharp/web',
      '--',
      '--hostname',
      '127.0.0.1',
      '--port',
      String(webPort),
    ],
    {
      API_BASE_URL: apiBaseUrl,
      NODE_ENV: 'production',
      PORT: String(webPort),
    },
  );

  await waitForServer(webServer, 'web home page', async () => {
    const response = await fetch(webOrigin);
    assert.equal(response.status, 200, 'Home page should return HTTP 200');

    const html = await response.text();
    assert.ok(
      html.includes('Learn faster when the app remembers your game.'),
      'Home page should render the landing hero',
    );
  });

  await runChecks();
  console.log('Smoke checks passed for API health, core web routes, and the quiz journey.');
} finally {
  await stopServer(webServer);
  await stopServer(apiServer);
}

async function runChecks() {
  const contentResponse = await fetch(`${apiBaseUrl}/content/games`);
  assert.equal(contentResponse.status, 200, 'Content games should return HTTP 200');

  const contentPayload = await contentResponse.json();
  const games = contentPayload?.data?.games;
  assert.ok(Array.isArray(games) && games.length >= 2, 'Content games should include seeded games');

  const gameNames = games.map((game) => game.game).sort();
  assert.deepEqual(gameNames, ['blackjack', 'poker']);

  await expectPage('/login', 'Welcome back');
  await expectPage('/register', 'Build your training profile');
  await expectPage('/lessons', 'Master Your Game');
  await expectPage('/quiz', 'Answer fast, learn faster');
  await expectDashboardRedirect();
  await expectAdminGuestGate();
  await expectAuthenticatedQuizJourney();
}

async function expectAuthenticatedQuizJourney() {
  const email = `smoke-${Date.now()}-${Math.random().toString(36).slice(2)}@playsharp.test`;
  const authPayload = await expectJson(`${apiBaseUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Smoke Test User',
      email,
      password: 'smoke-test-password',
    }),
  });
  const accessToken = authPayload?.data?.session?.accessToken;

  assert.ok(
    typeof accessToken === 'string' && accessToken.length > 0,
    'Register should return an access token',
  );

  await expectAdminForbidden(accessToken);

  const quizPayload = await expectJson(`${apiBaseUrl}/quiz/daily?game=poker`);
  const quiz = quizPayload?.data?.quiz;
  assert.ok(quiz, 'Daily quiz should return quiz data');

  const correctChoice = quiz.question.choices.find((choice) => choice.isCorrect);
  assert.ok(correctChoice, 'Daily quiz should expose one correct choice');

  const attemptPayload = await expectJson(`${apiBaseUrl}/quiz/attempts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      game: quiz.game,
      answers: [
        {
          themeSlug: quiz.themeSlug,
          questionSlug: quiz.question.slug,
          selectedChoiceLabel: correctChoice.label,
        },
      ],
    }),
  });
  const attempt = attemptPayload?.data?.attempt;

  assert.ok(attempt, 'Quiz attempt should return result data');
  assert.equal(attempt.score, 1, 'Quiz attempt should score the correct answer');
  assert.equal(attempt.correctAnswers, 1, 'Quiz attempt should count one correct answer');
  assert.equal(attempt.totalQuestions, 1, 'Quiz attempt should report one submitted question');
  assert.equal(attempt.answers[0]?.isCorrect, true, 'Feedback should mark the answer as correct');
  assert.ok(
    typeof attempt.answers[0]?.explanation === 'string' &&
      attempt.answers[0].explanation.length > 0,
    'Feedback should include an explanation',
  );

  const lessonResponse = await fetch(`${webOrigin}/lessons/${quiz.game}/${quiz.themeSlug}`);
  assert.equal(
    lessonResponse.status,
    200,
    'Theme lesson route should render after the quiz attempt',
  );

  const lessonHtml = await lessonResponse.text();
  assert.ok(
    lessonHtml.includes(quiz.themeName),
    'Theme lesson route should include the quiz theme name',
  );

  const statsPayload = await expectJson(`${apiBaseUrl}/stats/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const overview = statsPayload?.data?.overview;

  assert.ok(overview, 'Progress overview should return after a completed quiz attempt');
  assert.ok(
    overview.summary.questionsAnswered >= 1,
    'Progress overview should count the completed answer',
  );
  assert.ok(
    overview.themesToImprove.some((theme) => theme.themeSlug === quiz.themeSlug),
    'Progress overview should include the quiz theme',
  );

  const progressResponse = await fetch(`${webOrigin}/progress`, {
    headers: {
      Cookie: `playsharp_access_token=${accessToken}`,
    },
    redirect: 'manual',
  });
  assert.equal(
    progressResponse.status,
    200,
    'Progress page should render for the authenticated user',
  );

  const progressHtml = await progressResponse.text();
  assert.ok(
    progressHtml.includes('Your Progress'),
    'Progress page should render the progress heading',
  );
  assert.ok(
    progressHtml.includes('Questions Answered'),
    'Progress page should render the overview stats',
  );
}

async function expectPage(pathname, text) {
  const response = await fetch(`${webOrigin}${pathname}`);
  assert.equal(response.status, 200, `${pathname} should return HTTP 200`);

  const html = await response.text();
  assert.ok(html.includes(text), `${pathname} should include "${text}"`);
}

async function expectDashboardRedirect() {
  const response = await fetch(`${webOrigin}/dashboard`, { redirect: 'manual' });
  assert.ok(
    response.status === 307 || response.status === 308,
    `Dashboard should redirect for guests, got HTTP ${response.status}`,
  );

  const location = response.headers.get('location');
  assert.ok(location, 'Dashboard redirect should include a location header');

  const redirectUrl = new URL(location, webOrigin);
  assert.equal(redirectUrl.pathname, '/login');
  assert.equal(redirectUrl.searchParams.get('next'), '/dashboard');
}

async function expectAdminGuestGate() {
  const response = await fetch(`${webOrigin}/admin`);
  assert.equal(response.status, 200, 'Admin page should render a guest access gate');

  const html = await response.text();
  assert.ok(
    html.includes('Admin sign-in required'),
    'Admin guest gate should explain the sign-in requirement',
  );
  assert.ok(
    html.includes('/login?next=%2Fadmin'),
    'Admin guest gate should link to the login route',
  );
}

async function expectAdminForbidden(accessToken) {
  const apiError = await expectErrorJson(`${apiBaseUrl}/admin/overview`, 403, 'AUTH_FORBIDDEN', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  assert.equal(apiError.error, 'Forbidden');

  const pageResponse = await fetch(`${webOrigin}/admin`, {
    headers: {
      Cookie: `playsharp_access_token=${accessToken}`,
    },
  });
  assert.equal(pageResponse.status, 200, 'Admin page should render an access denied state');

  const pageHtml = await pageResponse.text();
  assert.ok(pageHtml.includes('Admins only'), 'Admin page should explain the role restriction');
}

async function expectJson(url, options) {
  const response = await fetch(url, options);
  assert.ok(response.ok, `${url} should return a successful HTTP response, got ${response.status}`);

  return response.json();
}

async function expectErrorJson(url, status, code, options) {
  const response = await fetch(url, options);
  assert.equal(response.status, status, `${url} should return HTTP ${status}`);

  const payload = await response.json();
  assert.equal(payload.code, code, `${url} should return error code ${code}`);

  return payload;
}

function startServer(name, args, extraEnv) {
  const server = {
    name,
    child: spawn('npm', args, {
      cwd: repoRoot,
      env: {
        ...process.env,
        ...extraEnv,
      },
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
    stdout: '',
    stderr: '',
  };

  server.child.stdout.on('data', (chunk) => {
    server.stdout = appendOutput(server.stdout, chunk);
  });
  server.child.stderr.on('data', (chunk) => {
    server.stderr = appendOutput(server.stderr, chunk);
  });

  return server;
}

function appendOutput(existing, chunk) {
  const next = `${existing}${chunk.toString()}`;
  return next.length > 8000 ? next.slice(-8000) : next;
}

async function waitForServer(server, label, check) {
  const timeoutAt = Date.now() + 60_000;
  let lastError = null;

  while (Date.now() < timeoutAt) {
    if (server.child.exitCode !== null) {
      throw new Error(`${server.name} exited before ${label}.\n${formatLogs(server)}`);
    }

    try {
      await check();
      return;
    } catch (error) {
      lastError = error;
      await delay(1_000);
    }
  }

  throw new Error(
    `Timed out waiting for ${label}.${lastError instanceof Error ? `\n${lastError.message}` : ''}\n${formatLogs(server)}`,
  );
}

async function stopServer(server) {
  if (!server || server.child.exitCode !== null) {
    return;
  }

  try {
    process.kill(-server.child.pid, 'SIGTERM');
  } catch {
    return;
  }

  await Promise.race([
    new Promise((resolveClose) => {
      server.child.once('exit', resolveClose);
    }),
    delay(5_000).then(() => {
      try {
        process.kill(-server.child.pid, 'SIGKILL');
      } catch {
        return;
      }
    }),
  ]);
}

async function runCommand(command, args, label) {
  await new Promise((resolveCommand, rejectCommand) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      env: process.env,
      stdio: 'inherit',
    });

    child.once('error', rejectCommand);
    child.once('exit', (code) => {
      if (code === 0) {
        resolveCommand();
        return;
      }

      rejectCommand(new Error(`${label} failed with exit code ${code ?? 'unknown'}.`));
    });
  });
}

function formatLogs(server) {
  const stdout = server.stdout.trim();
  const stderr = server.stderr.trim();

  if (!stdout && !stderr) {
    return 'No process output captured.';
  }

  return [
    `[${server.name} stdout]`,
    stdout || '(empty)',
    `[${server.name} stderr]`,
    stderr || '(empty)',
  ].join('\n');
}

async function verifyBuildArtifacts() {
  const missing = [];

  await access(resolve(repoRoot, 'apps/api/dist/apps/api/src/main.js')).catch(() => {
    missing.push('apps/api/dist/apps/api/src/main.js');
  });
  await access(resolve(repoRoot, 'apps/web/.next/BUILD_ID')).catch(() => {
    missing.push('apps/web/.next/BUILD_ID');
  });

  if (missing.length > 0) {
    throw new Error(
      `Smoke tests require existing build output. Run \`npm run build\` first. Missing: ${missing.join(', ')}`,
    );
  }
}
