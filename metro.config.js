// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const def = getDefaultConfig(__dirname);

module.exports = {
    ...def,
    transformer: {
        ...def.transformer,
        minifierConfig: {
            keep_classnames: true, // Preserve class names
            keep_fnames: true, // Preserve function names
            mangle: {
                keep_classnames: true, // Preserve class names
                keep_fnames: true // Preserve function names
            }
        },
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true
            }
        })
    }
};
