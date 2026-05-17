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

/**
 * @param {unknown} processor
 *
 * @returns {string | null}
 */
const getProcessorNamespace = (processor) => {
    if (typeof processor !== "string" || !processor.includes("/")) {
        return null;
    }

    return getNamespaceFromIdentifier(processor);
};

/**
 * @param {unknown} language
 *
 * @returns {string | null}
 */
const getLanguageNamespace = (language) => {
    if (typeof language !== "string" || !language.includes("/")) {
        return null;
    }

    return getNamespaceFromIdentifier(language);
};

/**
 * @param {import("eslint").Linter.Config} config
 *
 * @returns {Set<string>}
 */
const getUsedPluginNamespaces = (config) => {
    const usedPluginNamespaces = new Set();

    const rules = config.rules ?? {};

    for (const ruleName of Object.keys(rules)) {
        const namespace = getRuleNamespace(ruleName);

        if (namespace !== null) {
            usedPluginNamespaces.add(namespace);
        }
    }

    const processorNamespace = getProcessorNamespace(config.processor);

    if (processorNamespace !== null) {
        usedPluginNamespaces.add(processorNamespace);
    }

    const languageNamespace = getLanguageNamespace(config.language);

    if (languageNamespace !== null) {
        usedPluginNamespaces.add(languageNamespace);
    }

    return usedPluginNamespaces;
};

const configs = createConfig();
const globallyUsedPluginNamespaces = new Set();

for (const config of configs) {
    const usedPluginNamespaces = getUsedPluginNamespaces(config);

    for (const namespace of usedPluginNamespaces) {
        globallyUsedPluginNamespaces.add(namespace);
    }
}

/** @type {{ name: string; plugins: string[] }[]} */
const findings = [];

for (const config of configs) {
    const plugins = config.plugins;

    if (plugins !== undefined && plugins !== null) {
        const declaredPluginNames = Object.keys(plugins);

        if (declaredPluginNames.length > 0) {
            const usedPluginNamespaces = getUsedPluginNamespaces(config);

            const unusedPlugins = declaredPluginNames.filter(
                (pluginName) =>
                    !usedPluginNamespaces.has(pluginName) &&
                    !globallyUsedPluginNamespaces.has(pluginName)
            );

            if (unusedPlugins.length > 0) {
                findings.push({
                    name: config.name ?? "(unnamed config block)",
                    plugins: unusedPlugins,
                });
            }
        }
    }
}

if (findings.length === 0) {
    console.log(
        "✅ No obviously-unused plugin declarations found in config blocks."
    );
    process.exit(0);
}

console.error(
    "❌ Found config blocks with plugin declarations that appear unused:"
);

for (const finding of findings) {
    console.error(`  • ${finding.name}`);

    for (const pluginName of finding.plugins) {
        console.error(`      - ${pluginName}`);
    }
}

process.exit(1);
