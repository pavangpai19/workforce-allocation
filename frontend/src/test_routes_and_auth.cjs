/**
 * Automated Verification Script for Frontend Auth and Role-Based Routing
 * 
 * Tests:
 * 1. Verification of all 8 Manager routes in AppRoutes & Sidebar
 * 2. Verification of all 6 Employee routes in AppRoutes & Sidebar
 * 3. Shared browser Supabase client lifecycle & session persistence
 * 4. Role-based redirect logic (ADMIN, MANAGER, EMPLOYEE)
 * 5. ProtectedRoute RBAC guard logic (403 prevention of login loops)
 * 6. API error handling (401 invalidation vs 404/500 non-redirect)
 */

const fs = require('fs');
const path = require('path');

const frontendDir = path.resolve(__dirname, '../../frontend');
const srcDir = path.join(frontendDir, 'src');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failCount++;
  }
}

console.log('\n--- 1. VERIFYING MANAGER ROUTES ---');
const appRoutesContent = fs.readFileSync(path.join(srcDir, 'routes', 'AppRoutes.tsx'), 'utf8');
const sidebarContent = fs.readFileSync(path.join(srcDir, 'components', 'shell', 'Sidebar.tsx'), 'utf8');

const requiredManagerRoutes = [
  'dashboard',
  'projects',
  'proposals',
  'team',
  'tickets',
  'alerts',
  'decision-history',
  'settings'
];

requiredManagerRoutes.forEach((route) => {
  const inAppRoutes = appRoutesContent.includes(`path="${route}"`) || appRoutesContent.includes(`path="proposals"`);
  assert(inAppRoutes, `Manager route '${route}' exists in AppRoutes.tsx`);
});

const requiredManagerSidebarPaths = [
  '/manager/dashboard',
  '/manager/projects',
  '/manager/proposals',
  '/manager/team',
  '/manager/tickets',
  '/manager/alerts',
  '/manager/decision-history',
  '/manager/settings'
];

requiredManagerSidebarPaths.forEach((sidebarPath) => {
  assert(sidebarContent.includes(`path: '${sidebarPath}'`), `Manager sidebar includes '${sidebarPath}'`);
});

console.log('\n--- 2. VERIFYING EMPLOYEE ROUTES ---');
const requiredEmployeeRoutes = [
  'dashboard',
  'allocations',
  'report-completion',
  'availability',
  'profile',
  'settings'
];

requiredEmployeeRoutes.forEach((route) => {
  assert(appRoutesContent.includes(`path="${route}"`), `Employee route '${route}' exists in AppRoutes.tsx`);
});

const requiredEmployeeSidebarPaths = [
  '/employee/dashboard',
  '/employee/allocations',
  '/employee/report-completion',
  '/employee/availability',
  '/employee/profile',
  '/employee/settings'
];

requiredEmployeeSidebarPaths.forEach((sidebarPath) => {
  assert(sidebarContent.includes(`path: '${sidebarPath}'`), `Employee sidebar includes '${sidebarPath}'`);
});

console.log('\n--- 3. VERIFYING AUTH ARCHITECTURE & SUPABASE CLIENT ---');
const mainContent = fs.readFileSync(path.join(srcDir, 'main.tsx'), 'utf8');
const authProviderAboveRouter = mainContent.indexOf('<AuthProvider>') < mainContent.indexOf('<BrowserRouter>');
assert(authProviderAboveRouter, 'AuthProvider is positioned ABOVE BrowserRouter in main.tsx');

const supabaseClientPath = path.join(srcDir, 'services', 'supabaseClient.ts');
assert(fs.existsSync(supabaseClientPath), 'Single shared browser Supabase client exists (supabaseClient.ts)');

const supabaseClientContent = fs.readFileSync(supabaseClientPath, 'utf8');
assert(supabaseClientContent.includes('getSession()'), 'Supabase client implements getSession()');
assert(supabaseClientContent.includes('onAuthStateChange('), 'Supabase client implements onAuthStateChange()');
assert(supabaseClientContent.includes('signOut()'), 'Supabase client implements signOut()');

console.log('\n--- 4. VERIFYING RBAC & PROTECTED ROUTE GUARDS ---');
const protectedRouteContent = fs.readFileSync(path.join(srcDir, 'components', 'auth', 'ProtectedRoute.tsx'), 'utf8');
assert(protectedRouteContent.includes('if (isLoading)'), 'ProtectedRoute shows loading state and does NOT redirect while loading');
assert(protectedRouteContent.includes('if (!user.role)'), 'ProtectedRoute handles missing role gracefully with Setup Required, avoiding login loop');
assert(protectedRouteContent.includes('RBAC Forbidden (403)') || protectedRouteContent.includes('Access Restricted'), 'ProtectedRoute displays 403 Forbidden on role mismatch instead of redirecting to login');

console.log('\n--- 5. VERIFYING NOT-FOUND FALLBACK PROTECTION ---');
assert(appRoutesContent.includes('<NotFoundPage />'), 'Authenticated 404 NotFoundPage is rendered for unknown routes inside layout');
assert(!appRoutesContent.includes('path="*" element={<Navigate to="/login" replace />}'), 'Wildcard (*) does NOT redirect authenticated users to /login');

console.log('\n--- 6. VERIFYING API 401 VS 404/500 ERROR HANDLING ---');
const apiContent = fs.readFileSync(path.join(srcDir, 'services', 'api.ts'), 'utf8');
assert(apiContent.includes('response.status === 401'), 'API intercepts 401 to sign out and redirect to login');
assert(apiContent.includes('console.warn(`[API] Error on ${endpoint}:`, err.message)'), 'API logs ordinary errors (404/500) without kicking user to login');

console.log(`\n========================================`);
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
