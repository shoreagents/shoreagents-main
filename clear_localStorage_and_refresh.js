// Clear localStorage and force new anonymous user creation
// Run this in the browser console to clear old anonymous users

console.log('🧹 Clearing old anonymous user from localStorage...');

// Clear the old anonymous user ID
localStorage.removeItem('shoreagents_anonymous_user_id');

console.log('✅ localStorage cleared!');

// Check if it's cleared
const remaining = localStorage.getItem('shoreagents_anonymous_user_id');
if (remaining === null) {
    console.log('✅ Confirmed: localStorage is now empty');
    console.log('🔄 Refresh the page to get a new unique anonymous user');
} else {
    console.log('❌ localStorage still contains:', remaining);
}

// Optional: Clear all localStorage (use with caution)
// localStorage.clear();
// console.log('🧹 All localStorage cleared!');
