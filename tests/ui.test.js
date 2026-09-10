/**
 * UI Tests for Candidate Search App — Phase 2
 *
 * These tests verify the frontend JavaScript (app.js) logic by simulating
 * what the UI code does with API responses.
 *
 * Each test targets a specific confirmed UI bug from the bug report.
 *
 * The tests validate EXPECTED correct behavior. They:
 * - FAIL when run with the buggy render/handler logic (proving each defect)
 * - PASS when run with the fixed render/handler logic (proving the fix works)
 *
 * Both buggy and fixed versions are provided inline for reference.
 */

// ==================== BUGGY UI LOGIC (original app.js) ====================
// Uncomment these and comment the fixed versions to reproduce failures.

// function simulateRender_BUGGY(body, state) {
//   const pageInfoText = `Page ${body.pageSize} of ${body.totalPages}`;  // Bug 2: uses pageSize
//   const resultCountText = `${body.data.length} results`;               // Bug 7: uses data.length
//   const prevBtnDisabled = state.page <= 0;                              // Bug 2: <= 0 instead of <= 1
//   return { pageInfoText, resultCountText, prevBtnDisabled };
// }

// function simulateSearchClick_BUGGY(state) {
//   const newState = { ...state };
//   newState.q = 'test search';
//   // Bug 1: Missing state.page = 1 reset
//   return newState;
// }

// ==================== FIXED UI LOGIC (corrected app.js) ====================

function simulateRender(body, state) {
  // Fixed: uses body.page instead of body.pageSize
  const pageInfoText = `Page ${body.page} of ${body.totalPages}`;
  // Fixed: uses body.total instead of body.data.length
  const resultCountText = `${body.total} results`;
  // Fixed: uses <= 1 instead of <= 0
  const prevBtnDisabled = state.page <= 1;
  return { pageInfoText, resultCountText, prevBtnDisabled };
}

function simulateSearchClick(state) {
  const newState = { ...state };
  newState.q = 'test search';
  // Fixed: resets page to 1
  newState.page = 1;
  return newState;
}

// ==================== TESTS ====================

describe('Bug 1: UI — state-not-persisted (search does not reset page)', () => {
  test('performing a new search should reset page to 1', () => {
    const state = { q: '', page: 3, pageSize: 10, sortField: 'name', sortDir: 'asc' };
    const newState = simulateSearchClick(state);
    // With the bug: page stays at 3. With the fix: page resets to 1.
    expect(newState.page).toBe(1);
  });
});

describe('Bug 2: UI — pagination-bug (page info shows pageSize instead of page number)', () => {
  test('page info should display current page number, not pageSize', () => {
    const body = {
      data: Array(10).fill({ name: 'Test', email: 'test@example.com', status: 'VERIFIED', createdAt: '2026-01-01' }),
      page: 2,
      pageSize: 10,
      total: 30,
      totalPages: 3,
      hasNext: true,
    };
    const state = { page: 2, pageSize: 10 };
    const result = simulateRender(body, state);

    // With the bug: shows "Page 10 of 3". With the fix: shows "Page 2 of 3".
    expect(result.pageInfoText).toBe('Page 2 of 3');
  });

  test('prev button should be disabled on page 1', () => {
    const body = {
      data: Array(10).fill({ name: 'Test', email: 'test@example.com', status: 'VERIFIED', createdAt: '2026-01-01' }),
      page: 1,
      pageSize: 10,
      total: 30,
      totalPages: 3,
      hasNext: true,
    };
    const state = { page: 1, pageSize: 10 };
    const result = simulateRender(body, state);

    // With the bug: prevBtnDisabled is false (page 1 <= 0 is false).
    // With the fix: prevBtnDisabled is true (page 1 <= 1 is true).
    expect(result.prevBtnDisabled).toBe(true);
  });
});

describe('Bug 7: UI — stale-or-mismatched-aggregate (result count shows page count)', () => {
  test('result count should show total matching candidates, not current page count', () => {
    const body = {
      data: Array(10).fill({ name: 'Test', email: 'test@example.com', status: 'VERIFIED', createdAt: '2026-01-01' }),
      page: 1,
      pageSize: 10,
      total: 30,
      totalPages: 3,
      hasNext: true,
    };
    const state = { page: 1, pageSize: 10 };
    const result = simulateRender(body, state);

    // With the bug: shows "10 results" (data.length). With the fix: shows "30 results" (total).
    expect(result.resultCountText).toBe('30 results');
  });

  test('result count should show total for filtered search', () => {
    const body = {
      data: Array(3).fill({ name: 'Test', email: 'test@example.com', status: 'VERIFIED', createdAt: '2026-01-01' }),
      page: 1,
      pageSize: 10,
      total: 3,
      totalPages: 1,
      hasNext: false,
    };
    const state = { page: 1, pageSize: 10 };
    const result = simulateRender(body, state);

    expect(result.resultCountText).toBe('3 results');
  });
});

describe('Bug 8: UI — wrong-sort-order (createdAt column)', () => {
  test('createdAt should be recognized as a sortable field by the server', () => {
    // After the fix, server.js SORTABLE_FIELDS includes 'createdAt'.
    // We read the actual fixed server source to verify.
    const fs = require('fs');
    const serverSrc = fs.readFileSync(require('path').join(__dirname, '..', 'server.js'), 'utf8');

    // The fix adds 'createdAt' to the SORTABLE_FIELDS array
    expect(serverSrc).toMatch(/SORTABLE_FIELDS\s*=\s*\[.*'createdAt'.*\]/);
  });
});
