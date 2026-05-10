import { createConfig } from "../dist/shared-config.js";

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

    if (ruleName.startsWith("@")) {
        const [scope, name] = ruleName.split("/");

        return scope && name ? `${scope}/${name}` : null;
    }

    const [pluginName] = ruleName.split("/");

    return pluginName ?? null;
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

    if (processor.startsWith("@")) {
        const [scope, name] = processor.split("/");

        return scope && name ? `${scope}/${name}` : null;
    }

    const [pluginName] = processor.split("/");

    return pluginName ?? null;
};

const configs = createConfig();

/** @type {{ name: string; plugins: string[] }[]} */
const findings = [];

for (const config of configs) {
    const plugins = config.plugins;

    if (plugins === undefined || plugins === null) {
        continue;
    }

    const declaredPluginNames = Object.keys(plugins);

    if (declaredPluginNames.length === 0) {
        continue;
    }

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

    const unusedPlugins = declaredPluginNames.filter(
        (pluginName) => !usedPluginNamespaces.has(pluginName)
    );

    if (unusedPlugins.length > 0) {
        findings.push({
            name: config.name ?? "(unnamed config block)",
            plugins: unusedPlugins,
        });
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
