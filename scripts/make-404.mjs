// GitHub Pages serves one 404.html for every unknown path, and it has no rewrite rules.
// Build it from the main site's index.html so deep links like /about still load the site,
// and send anything under /portal/ to the portal app, which restores the original URL.
import { readFileSync, writeFileSync } from 'node:fs'

const html = readFileSync('dist/index.html', 'utf8')
const redirect = `<script>
      ;(function () {
        var l = location
        if (l.pathname === '/portal' || l.pathname.indexOf('/portal/') === 0) {
          l.replace('/portal/?p=' + encodeURIComponent(l.pathname + l.search + l.hash))
        }
      })()
    </script>`

if (!html.includes('<head>')) throw new Error('dist/index.html has no <head> to inject into')
writeFileSync('dist/404.html', html.replace('<head>', `<head>\n    ${redirect}`))
console.log('wrote dist/404.html')
