const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/*.{ts,html}'),
    join(__dirname, '../../libs/**/*.{ts,html}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
