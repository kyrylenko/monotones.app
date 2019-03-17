module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{html,js,css,mp3,gif,svg}"
  ],
  swDest: "build/service-worker-custom.js",
  maximumFileSizeToCacheInBytes: "5242880",
  clientsClaim: true,
  navigateFallback: '/index.html',
  navigateFallbackBlacklist: [/^\/_/,/\/[^\/]+\.[^\/]+$/],
  globIgnores: ["**/service-worker.js",
    "**/precache-manifest*"]
};