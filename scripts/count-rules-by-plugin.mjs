import { createConfig } from "../dist/shared-config.js";

/**
 * @param {string} identifier
 *
 * @returns {string | null}
 */
const getNamespaceFromIdentifier = (identifier) => {
    const parts = identifier.split("/");

    if (parts.length === 0) {
        return null;
    }

    const [firstPart, secondPart] = parts;

    if (!firstPart) {
        return null;
    }

    if (firstPart.startsWith("@")) {
        if (parts.length >= 3 && secondPart) {
            return `${firstPart}/${secondPart}`;
        }

        return firstPart;
    }

    return firstPart;
};

/**
 * @param {string} ruleName
 *
 * @returns {string | null}
 */
const getRuleNamespace = (ruleName) => {
    if (typeof ruleName !== "string" || ruleName.length === 0) {
        return null;
    }

    if (!ruleName.includes("/")) {
        return null;
    }

    return getNamespaceFromIdentifier(ruleName);
};

const configs = createConfig();

/** @type {Map<string, number>} */
const namespaceCounts = new Map();

for (const config of configs) {
    const rules = config.rules ?? {};

    for (const ruleName of Object.keys(rules)) {
        const namespace = getRuleNamespace(ruleName);

        if (namespace === null) {
            continue;
        }

        namespaceCounts.set(
            namespace,
            (namespaceCounts.get(namespace) ?? 0) + 1
        );
    }
}

const sortedCounts = [...namespaceCounts.entries()].sort((left, right) => {
    const [, leftCount] = left;
    const [, rightCount] = right;

    if (rightCount !== leftCount) {
        return rightCount - leftCount;
    }

    return left[0].localeCompare(right[0]);
});

for (const [namespace, count] of sortedCounts) {
    console.log(String(count).padStart(4), namespace);
}
