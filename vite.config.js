import { defineConfig, loadEnv } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function publicHtmlEnv(env) {
  const replace = (html) =>
    html.replace(/%(VITE_[A-Z0-9_]+)%/g, (m, key) => env[key] ?? m);

  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
    });

  let outDir;
  let publicDir;
  return {
    name: 'public-html-env',
    configResolved(c) {
      outDir = c.build.outDir;
      publicDir = c.publicDir;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '').split('?')[0]);
        if (!url.endsWith('.html')) return next();
        const file = path.join(publicDir, url);
        if (!file.startsWith(publicDir) || !fs.existsSync(file)) return next();
        res.setHeader('Content-Type', 'text/html');
        res.end(replace(fs.readFileSync(file, 'utf8')));
      });
    },
    closeBundle() {
      for (const f of walk(publicDir)) {
        const out = path.join(outDir, path.relative(publicDir, f));
        if (fs.existsSync(out)) fs.writeFileSync(out, replace(fs.readFileSync(f, 'utf8')));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [publicHtmlEnv(env)],
    // Relative URLs so the built site works on GitHub Pages project sites
    // (e.g. …/S3-Chem/) as well as at domain root and on Vite dev server.
    base: './',
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('elementsDetail')) return 'elements-detail';
            if (id.includes('eitController') || id.includes('eitMobileController')) return 'eit-controller';
            if (id.includes('elementsIndex') || id.includes('elementShells')) return 'elements-index';
            if (id.includes('elementsData')) return 'elements-data';
            if (id.includes('threeRenderer')) return 'three-renderer';
            if (id.includes('tutorialController')) return 'tutorial';
            if (id.includes('uiController')) return 'ui-controller';
            if (id.includes('toolContentFactories')) return 'tool-content';
            if (id.includes('chapterDrawOverlay')) return 'chapter-overlays';
            if (id.includes('toolsModalController') || id.includes('chemToolContent') || id.includes('chemToolInteractions')) {
              return 'tools-bundle';
            }
            if (id.includes('worksheetHubController')) return 'worksheet-hub';
            if (id.includes('summaryHubController')) return 'summary-hub';
          },
        },
      },
    },
    server: {
      headers: {
        // iPad Safari can aggressively cache; ensure refresh pulls latest dev bundle.
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      proxy: {
        // Proxy all /api/chem requests to the chemistry API server
        '/api/chem': {
          target: 'http://10.0.0.149:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/chem/, ''),
        },
      },
    },
  };
});
