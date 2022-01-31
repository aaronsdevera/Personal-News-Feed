module.exports = function (eleventyConfig) {
  // Copy the `css` directory to the output
  eleventyConfig.addPassthroughCopy('src/css');

  // Watch the `css` directory for changes
  eleventyConfig.addWatchTarget('src/css');

  // Copy the `assets` directory to the output
  eleventyConfig.addPassthroughCopy('src/assets');

  // Watch the `assets` directory for changes
  eleventyConfig.addWatchTarget('src/assets');
};