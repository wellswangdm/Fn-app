// Harness-only Tailwind config. Absolute globs so it works regardless of which
// directory PostCSS resolves from.
import base from '../../../tailwind.config.js'
const ROOT = '/home/user/Fn-app'
export default {
  ...base,
  content: [
    `${ROOT}/tools/cemetery/harness/*.{html,jsx}`,
    `${ROOT}/src/**/*.{js,jsx}`,
  ],
}
