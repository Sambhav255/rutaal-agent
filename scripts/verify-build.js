#!/usr/bin/env node

/**
 * Build verification script to check if routes are generated correctly
 * This helps debug Vercel deployment issues
 */

const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', '.cursor', 'debug.log');
const serverEndpoint = 'http://127.0.0.1:7243/ingest/c4acd6e7-1082-4d91-b710-9236f5bae6ec';

function log(level, message, data = {}) {
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    location: 'verify-build.js',
    message,
    level,
    data,
    runId: 'build-verify',
    hypothesisId: 'H1'
  };

  // Write to file
  try {
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  } catch (e) {
    console.error('Failed to write log:', e);
  }

  // Also send via HTTP (non-blocking)
  fetch(serverEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logEntry)
  }).catch(() => {});
}

function checkRouteGeneration() {
  log('info', 'Starting build verification', {});
  
  const nextDir = path.join(__dirname, '..', '.next');
  const serverAppDir = path.join(nextDir, 'server', 'app');
  
  // Check if .next directory exists
  if (!fs.existsSync(nextDir)) {
    log('error', '.next directory not found', { nextDir });
    return false;
  }
  
  log('info', '.next directory exists', { nextDir });
  
  // Check if server/app directory exists
  if (!fs.existsSync(serverAppDir)) {
    log('error', 'server/app directory not found', { serverAppDir });
    return false;
  }
  
  log('info', 'server/app directory exists', { serverAppDir });
  
  // Check for root route files
  const rootRouteFiles = [
    'index.html',
    'index.rsc',
    'index.meta',
    'page.js'
  ];
  
  const missingFiles = [];
  const foundFiles = [];
  
  rootRouteFiles.forEach(file => {
    const filePath = path.join(serverAppDir, file);
    if (fs.existsSync(filePath)) {
      foundFiles.push(file);
      const stats = fs.statSync(filePath);
      log('info', `Found root route file`, { file, size: stats.size });
    } else {
      missingFiles.push(file);
      log('error', `Missing root route file`, { file });
    }
  });
  
  // Check for page directory
  const pageDir = path.join(serverAppDir, 'page');
  if (fs.existsSync(pageDir)) {
    log('info', 'page directory exists', { pageDir });
    const pageFiles = fs.readdirSync(pageDir);
    log('info', 'page directory contents', { files: pageFiles });
  } else {
    log('error', 'page directory not found', { pageDir });
  }
  
  // Check routes manifest
  const routesManifest = path.join(nextDir, 'routes-manifest.json');
  if (fs.existsSync(routesManifest)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(routesManifest, 'utf8'));
      log('info', 'Routes manifest found', { 
        staticRoutes: manifest.staticRoutes?.length || 0,
        dynamicRoutes: manifest.dynamicRoutes?.length || 0
      });
      
      const rootRoute = manifest.staticRoutes?.find(r => r.page === '/');
      if (rootRoute) {
        log('info', 'Root route found in manifest', { route: rootRoute });
      } else {
        log('error', 'Root route NOT found in manifest', { 
          availableRoutes: manifest.staticRoutes?.map(r => r.page) || []
        });
      }
    } catch (e) {
      log('error', 'Failed to parse routes manifest', { error: e.message });
    }
  } else {
    log('error', 'routes-manifest.json not found', { routesManifest });
  }
  
  if (missingFiles.length > 0) {
    log('error', 'Build verification failed - missing files', { 
      missingFiles,
      foundFiles 
    });
    return false;
  }
  
  log('info', 'Build verification passed', { foundFiles });
  return true;
}

// Run verification
const success = checkRouteGeneration();
process.exit(success ? 0 : 1);
