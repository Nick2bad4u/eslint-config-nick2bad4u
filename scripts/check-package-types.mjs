import { execFileSync } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

import { Package, checkPackage } from "@arethetypeswrong/core";
import { getExitCode } from "@arethetypeswrong/cli/internal/getExitCode";
import { typed as renderTypedPackageReport } from "@arethetypeswrong/cli/internal/render";
import { problemAffectsResolutionKind } from "@arethetypeswrong/core/problems";
import { allResolutionKinds } from "@arethetypeswrong/core/utils";
import { untar } from "@andrewbranch/untar.js";

/** @type {import("@arethetypeswrong/core").ResolutionKind[]} */
const ATTW_ESM_ONLY_IGNORED_RESOLUTIONS = ["node10", "node16-cjs"];
const ATTW_REQUIRED_RESOLUTIONS = allResolutionKinds.filter(
    (resolutionKind) =>
        !ATTW_ESM_ONLY_IGNORED_RESOLUTIONS.includes(resolutionKind)
);
const npmPackCommand =
    process.platform === "win32"
        ? {
              args: [
                  "/d",
                  "/s",
                  "/c",
                  "npm pack --json",
              ],
              file: "cmd.exe",
          }
        : {
              args: ["pack", "--json"],
              file: "npm",
          };

/**
 * @typedef {{
 *     readonly filename: string;
 * }} NpmPackResult
 */

/**
 * @param {unknown} value
 *
 * @returns {value is readonly [NpmPackResult, ...NpmPackResult[]]}
 */
const isNpmPackResultList = (value) =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
        (entry) =>
            typeof entry === "object" &&
            entry !== null &&
            "filename" in entry &&
            typeof entry.filename === "string"
    );

/**
 * @returns {Promise<string>}
 */
const packCurrentPackage = async () => {
    const packOutput = execFileSync(npmPackCommand.file, npmPackCommand.args, {
        encoding: "utf8",
        stdio: [
            "ignore",
            "pipe",
            "inherit",
        ],
    });

    /** @type {unknown} */
    const parsedPackOutput = JSON.parse(packOutput);

    if (!isNpmPackResultList(parsedPackOutput)) {
        throw new TypeError("Unexpected npm pack --json output.");
    }

    return parsedPackOutput[0].filename;
};

/**
 * @param {Uint8Array} tarball
 *
 * @returns {Package}
 *
 * @throws {TypeError} If the packed archive is missing package metadata.
 */
const createPackageFromTarballData = (tarball) => {
    const data = untar(Uint8Array.from(gunzipSync(tarball)).buffer);
    const firstFile = data[0];

    if (firstFile === undefined) {
        throw new TypeError("Packed package archive did not contain files.");
    }

    const prefix = firstFile.filename.slice(
        0,
        firstFile.filename.indexOf("/") + 1
    );
    const packageJsonFile = data.find(
        (file) => file.filename === `${prefix}package.json`
    );

    if (packageJsonFile === undefined) {
        throw new TypeError(
            "Packed package archive did not contain package.json."
        );
    }

    /** @type {{ readonly name?: unknown; readonly version?: unknown }} */
    const packageJson = JSON.parse(
        new TextDecoder().decode(packageJsonFile.fileData)
    );

    if (
        typeof packageJson.name !== "string" ||
        typeof packageJson.version !== "string"
    ) {
        throw new TypeError("Packed package.json is missing name or version.");
    }

    /** @type {Record<string, Uint8Array>} */
    const files = {};

    for (const file of data) {
        files[
            `/node_modules/${packageJson.name}/${file.filename.slice(prefix.length)}`
        ] = file.fileData;
    }

    return new Package(files, packageJson.name, packageJson.version);
};

/**
 * @param {import("@arethetypeswrong/core").Analysis} analysis
 *
 * @returns {import("@arethetypeswrong/core").Analysis}
 */
const omitIgnoredResolutionOnlyProblems = (analysis) => ({
    ...analysis,
    problems: analysis.problems.filter((problem) =>
        ATTW_REQUIRED_RESOLUTIONS.some((resolutionKind) =>
            problemAffectsResolutionKind(problem, resolutionKind, analysis)
        )
    ),
});

const packedPackagePath = await packCurrentPackage();

try {
    const tarball = new Uint8Array(await readFile(packedPackagePath));
    const packageAnalysis = await checkPackage(
        createPackageFromTarballData(tarball),
        {}
    );

    if (packageAnalysis.types) {
        console.log(
            await renderTypedPackageReport(
                omitIgnoredResolutionOnlyProblems(packageAnalysis),
                {
                    format: "auto",
                    ignoreResolutions: ATTW_ESM_ONLY_IGNORED_RESOLUTIONS,
                    summary: true,
                }
            )
        );
    }

    process.exitCode = getExitCode(packageAnalysis, {
        ignoreResolutions: ATTW_ESM_ONLY_IGNORED_RESOLUTIONS,
    });
} finally {
    await rm(join(process.cwd(), packedPackagePath), { force: true });
}
