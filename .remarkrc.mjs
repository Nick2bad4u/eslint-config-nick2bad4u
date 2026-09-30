import { createRepositoryConfig } from "remark-config-nick2bad4u";

/**
 * @type {import("remark-config-nick2bad4u").RemarkConfig}
 */
const remarkConfig = await createRepositoryConfig(
    new URL(".", import.meta.url),
    {
        plugins: [
            // [myRemarkPlugin, myOptions], // your plugin override here
        ],
        settings: {
            // Overrides here: rule: "*", // your settings override here
        },
    }
);

export default remarkConfig;
