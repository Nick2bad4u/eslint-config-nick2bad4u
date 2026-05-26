import { existsSync } from "node:fs";
import { relative, resolve } from "node:path";

import { ESLint } from "eslint";

const DEFAULT_TARGETS = ["src/preset.ts"];
const HELP_TEXT = `Usage: npm run lint:config-effective -- [options] [file...]

Print a compact summary of ESLint's effective flat config for one or more files.

Options:
  --json      Print machine-readable JSON.
  --rules     Include the full effective rule list.
  --help      Show this help text.
`;

/**
 * @typedef {"error" | "off" | "unknown" | "warn"} RuleSeverityLabel
 */

/**
 * @typedef {{
 *     readonly format: "json" | "text";
 *     readonly showRules: boolean;
 *     readonly targets: string[];
 * }} CliOptions
 */

/**
 * @typedef {{
 *     readonly counts: {
 *         readonly error: number;
 *         readonly off: number;
 *         readonly total: number;
 *         readonly unknown: number;
 *         readonly warn: number;
 *     };
 *     readonly globals: string[];
 *     readonly languageOptions: {
 *         readonly ecmaVersion: string;
 *         readonly parser: string;
 *         readonly parserOptions: string[];
 *         readonly sourceType: string;
 *     };
 *     readonly linterOptions: string[];
 *     readonly plugins: string[];
 *     readonly processor: string;
 *     readonly rules?: Record<string, RuleSeverityLabel>;
 *     readonly rulesByNamespace: Record<string, number>;
 *     readonly settings: string[];
 *     readonly target: string;
 * }} ConfigSurface
 */

/**
 * @param {unknown} value
 *
 * @returns {value is Record<string, unknown>}
 */
const isRecord = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * @param {unknown} value
 *
 * @returns {string[]}
 */
const getRecordKeys = (value) => (isRecord(value) ? Object.keys(value) : []);

/**
 * @param {readonly string[]} values
 *
 * @returns {string[]}
 */
const sortStrings = (values) =>
    [...values].sort((left, right) => left.localeCompare(right));

/**
 * @param {unknown} value
 *
 * @returns {string}
 */
const stringifyValue = (value) => {
    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }

    if (value === undefined) {
        return "(undefined)";
    }

    if (value === null) {
        return "(null)";
    }

    return "(object)";
};

/**
 * @param {unknown} value
 *
 * @returns {string}
 */
const getDisplayName = (value) => {
    if (typeof value === "string") {
        return value;
    }

    if (!isRecord(value)) {
        return stringifyValue(value);
    }

    const meta = value["meta"];

    if (isRecord(meta) && typeof meta["name"] === "string") {
        return meta["name"];
    }

    if (typeof value["name"] === "string") {
        return value["name"];
    }

    return "(object)";
};

/**
 * @param {string} identifier
 *
 * @returns {string}
 */
const getNamespaceFromIdentifier = (identifier) => {
    const parts = identifier.split("/");
    const [firstPart, secondPart] = parts;

    if (!firstPart) {
        return "eslint";
    }

    if (firstPart.startsWith("@") && parts.length >= 3 && secondPart) {
        return `${firstPart}/${secondPart}`;
    }

    return firstPart;
};

/**
 * @param {string} ruleName
 *
 * @returns {string}
 */
const getRuleNamespace = (ruleName) =>
    ruleName.includes("/") ? getNamespaceFromIdentifier(ruleName) : "eslint";

/**
 * @param {unknown} ruleConfig
 *
 * @returns {RuleSeverityLabel}
 */
const getRuleSeverity = (ruleConfig) => {
    const severity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

    if (severity === 0 || severity === "off") {
        return "off";
    }

    if (severity === 1 || severity === "warn") {
        return "warn";
    }

    if (severity === 2 || severity === "error") {
        return "error";
    }

    return "unknown";
};

/**
 * @param {Record<string, RuleSeverityLabel>} rules
 *
 * @returns {Record<string, number>}
 */
const countRulesByNamespace = (rules) => {
    /** @type {Record<string, number>} */
    const counts = {};

    for (const ruleName of Object.keys(rules)) {
        const namespace = getRuleNamespace(ruleName);
        counts[namespace] = (counts[namespace] ?? 0) + 1;
    }

    return Object.fromEntries(
        Object.entries(counts).sort((left, right) => {
            const [, leftCount] = left;
            const [, rightCount] = right;

            if (rightCount !== leftCount) {
                return rightCount - leftCount;
            }

            return left[0].localeCompare(right[0]);
        })
    );
};

/**
 * @param {Record<string, RuleSeverityLabel>} rules
 *
 * @returns {ConfigSurface["counts"]}
 */
const countRuleSeverities = (rules) => {
    const counts = {
        error: 0,
        off: 0,
        total: Object.keys(rules).length,
        unknown: 0,
        warn: 0,
    };

    for (const severity of Object.values(rules)) {
        counts[severity] += 1;
    }

    return counts;
};

/**
 * @param {string[]} args
 *
 * @returns {CliOptions}
 *
 * @throws {Error} If an unknown option is provided.
 */
const parseArguments = (args) => {
    /** @type {string[]} */
    const targets = [];
    /** @type {"json" | "text"} */
    let format = "text";
    let showRules = false;

    for (const argument of args) {
        switch (argument) {
            case "--help": {
                console.log(HELP_TEXT);
                process.exit(0);
            }

            case "--json": {
                format = "json";
                break;
            }

            case "--rules": {
                showRules = true;
                break;
            }

            default: {
                if (argument.startsWith("--")) {
                    throw new Error(`Unknown option: ${argument}`);
                }

                targets.push(argument);
            }
        }
    }

    return {
        format,
        showRules,
        targets: targets.length > 0 ? targets : DEFAULT_TARGETS,
    };
};

/**
 * @param {string} target
 *
 * @returns {string}
 *
 * @throws {Error} If the target file does not exist.
 */
const resolveTarget = (target) => {
    const resolvedTarget = resolve(target);

    if (!existsSync(resolvedTarget)) {
        throw new Error(`Target file does not exist: ${target}`);
    }

    return resolvedTarget;
};

/**
 * @param {unknown} config
 * @param {string} target
 * @param {boolean} showRules
 *
 * @returns {ConfigSurface}
 *
 * @throws {TypeError} If ESLint does not return a config object.
 */
const summarizeConfig = (config, target, showRules) => {
    if (!isRecord(config)) {
        throw new TypeError(`ESLint did not return a config for ${target}.`);
    }

    const languageOptions = isRecord(config["languageOptions"])
        ? config["languageOptions"]
        : {};
    const rulesSource = isRecord(config["rules"]) ? config["rules"] : {};

    /** @type {Record<string, RuleSeverityLabel>} */
    const rules = {};

    for (const [ruleName, ruleConfig] of Object.entries(rulesSource)) {
        rules[ruleName] = getRuleSeverity(ruleConfig);
    }

    const surface = {
        counts: countRuleSeverities(rules),
        globals: sortStrings(getRecordKeys(languageOptions["globals"])),
        languageOptions: {
            ecmaVersion: stringifyValue(languageOptions["ecmaVersion"]),
            parser: getDisplayName(languageOptions["parser"]),
            parserOptions: sortStrings(
                getRecordKeys(languageOptions["parserOptions"])
            ),
            sourceType: stringifyValue(languageOptions["sourceType"]),
        },
        linterOptions: sortStrings(getRecordKeys(config["linterOptions"])),
        plugins: sortStrings(getRecordKeys(config["plugins"])),
        processor: getDisplayName(config["processor"]),
        rulesByNamespace: countRulesByNamespace(rules),
        settings: sortStrings(getRecordKeys(config["settings"])),
        target: relative(process.cwd(), target),
    };

    if (!showRules) {
        return surface;
    }

    return {
        ...surface,
        rules: Object.fromEntries(
            Object.entries(rules).sort(([leftName], [rightName]) =>
                leftName.localeCompare(rightName)
            )
        ),
    };
};

/**
 * @param {ConfigSurface} surface
 */
const printTextSurface = (surface) => {
    console.log(`Effective ESLint config for ${surface.target}`);
    console.log("");
    console.log("Surface:");
    console.log(`  parser: ${surface.languageOptions.parser}`);
    console.log(`  processor: ${surface.processor}`);
    console.log(`  ecmaVersion: ${surface.languageOptions.ecmaVersion}`);
    console.log(`  sourceType: ${surface.languageOptions.sourceType}`);
    console.log(`  plugins: ${surface.plugins.length}`);
    console.log(`  globals: ${surface.globals.length}`);
    console.log(`  settings: ${surface.settings.join(", ") || "(none)"}`);
    console.log(
        `  parserOptions: ${surface.languageOptions.parserOptions.join(", ") || "(none)"}`
    );
    console.log(
        `  linterOptions: ${surface.linterOptions.join(", ") || "(none)"}`
    );
    console.log("");
    console.log("Rules:");
    console.log(`  total: ${surface.counts.total}`);
    console.log(`  error: ${surface.counts.error}`);
    console.log(`  warn: ${surface.counts.warn}`);
    console.log(`  off: ${surface.counts.off}`);
    console.log(`  unknown: ${surface.counts.unknown}`);
    console.log("");
    console.log("Rules by namespace:");

    for (const [namespace, count] of Object.entries(surface.rulesByNamespace)) {
        console.log(`  ${String(count).padStart(4)} ${namespace}`);
    }

    if (surface.rules) {
        console.log("");
        console.log("Effective rules:");

        for (const [ruleName, severity] of Object.entries(surface.rules)) {
            console.log(`  ${severity.padEnd(7)} ${ruleName}`);
        }
    }
};

const options = parseArguments(process.argv.slice(2));
const eslint = new ESLint();

const surfaces = await Promise.all(
    options.targets.map(async (target) => {
        const resolvedTarget = resolveTarget(target);
        const config = await eslint.calculateConfigForFile(resolvedTarget);

        return summarizeConfig(config, resolvedTarget, options.showRules);
    })
);

if (options.format === "json") {
    console.log(JSON.stringify(surfaces, null, 4));
} else {
    for (const [index, surface] of surfaces.entries()) {
        if (index > 0) {
            console.log("");
            console.log("---");
            console.log("");
        }

        printTextSurface(surface);
    }
}
