/**
 * Unit + smoke orchestrator.
 * Run: npm test
 *
 * Hypotheses (testability):
 * T1 — van futtatható npm test
 * T2 — unit suite-ok zöldek (node:test)
 * T3 — domain / security / envelope / store lefedve
 * T4 — smoke:clean továbbra is zöld
 * T5 — testScoreTarget=10 a summary-ben
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const LOG = path.join(ROOT, 'debug-c04d6a.log');

function logDebug(
    hypothesisId: string,
    message: string,
    data: Record<string, unknown>
) {
    const line =
        JSON.stringify({
            sessionId: 'c04d6a',
            runId: 'testability-10',
            hypothesisId,
            location: 'scripts/run-tests.ts',
            message,
            data,
            timestamp: Date.now(),
        }) + '\n';
    fs.appendFileSync(LOG, line, 'utf8');
}

function listUnitTests(): string[] {
    const dir = path.join(ROOT, 'tests', 'unit');
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.test.ts'))
        .map((f) => path.join('tests', 'unit', f))
        .sort();
}

function run(cmd: string, args: string[]): { status: number; stdout: string; stderr: string } {
    const r = spawnSync(cmd, args, {
        cwd: ROOT,
        encoding: 'utf8',
        shell: true,
        env: { ...process.env, SOCIAL_DATA_STORE: process.env.SOCIAL_DATA_STORE || 'local' },
    });
    return {
        status: r.status ?? 1,
        stdout: r.stdout || '',
        stderr: r.stderr || '',
    };
}

function main() {
    const unitFiles = listUnitTests();
    logDebug('T1', 'npm test runner start', {
        unitFileCount: unitFiles.length,
        unitFiles: unitFiles.map((f) => f.replace(/\\/g, '/')),
    });

    if (unitFiles.length < 5) {
        throw new Error(`Expected >=5 unit files, got ${unitFiles.length}`);
    }

    const unit = run('npx', ['--yes', 'tsx', '--test', ...unitFiles]);
    process.stdout.write(unit.stdout);
    process.stderr.write(unit.stderr);

    // node:test prints "# pass N" / "# fail N"
    const passMatch = unit.stdout.match(/# pass\s+(\d+)/);
    const failMatch = unit.stdout.match(/# fail\s+(\d+)/);
    const testsMatch = unit.stdout.match(/# tests\s+(\d+)/);
    const unitPass = Number(passMatch?.[1] || 0);
    const unitFail = Number(failMatch?.[1] || 0);
    const unitTests = Number(testsMatch?.[1] || unitPass + unitFail);

    logDebug('T2', 'unit test results', {
        status: unit.status,
        unitTests,
        unitPass,
        unitFail,
    });

    const expectedSuites = [
        'socialDomain',
        'gameDomain',
        'apiSecurity',
        'apiEnvelope',
        'socialStore',
        'architecture',
        'firebaseAuthHygiene',
    ];
    const covered = expectedSuites.filter((name) =>
        unitFiles.some((f) => f.replace(/\\/g, '/').includes(name))
    );
    logDebug('T3', 'suite coverage', { covered, expected: expectedSuites });

    if (unit.status !== 0 || unitFail > 0) {
        throw new Error(`Unit tests failed (fail=${unitFail}, status=${unit.status})`);
    }
    if (unitPass < 15) {
        throw new Error(`Expected >=15 passing assertions/tests, got ${unitPass}`);
    }
    if (covered.length < expectedSuites.length) {
        throw new Error(`Missing suites: ${expectedSuites.filter((s) => !covered.includes(s)).join(', ')}`);
    }

    const smoke = run('npx', ['--yes', 'tsx', 'scripts/smoke-clean.ts']);
    process.stdout.write(smoke.stdout);
    process.stderr.write(smoke.stderr);
    logDebug('T4', 'smoke:clean after unit', { status: smoke.status });

    if (smoke.status !== 0) {
        throw new Error('smoke:clean failed');
    }

    let smokeJson: Record<string, unknown> = {};
    try {
        const line = smoke.stdout
            .trim()
            .split(/\r?\n/)
            .filter(Boolean)
            .pop();
        smokeJson = JSON.parse(line || '{}');
    } catch {
        /* ignore */
    }

    const summary = {
        ok: true,
        testScoreTarget: 10,
        unitFileCount: unitFiles.length,
        unitTests,
        unitPass,
        unitFail,
        suites: covered,
        smokeOk: smokeJson.ok === true,
        apiScoreTarget: smokeJson.apiScoreTarget,
        securityScoreTarget: smokeJson.securityScoreTarget,
    };
    logDebug('T5', 'testability summary', summary);
    console.log(JSON.stringify(summary));
}

try {
    main();
} catch (e: any) {
    logDebug('T5', 'testability failed', { error: String(e?.message || e) });
    console.error(e);
    process.exit(1);
}
