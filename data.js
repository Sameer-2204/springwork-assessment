// In-memory seed data. makeSeed() returns a fresh clone for each student's store.
const FIRST = ['Aarav', 'Vivaan', 'Aditya', 'Ishaan', 'Kabir', 'Ananya', 'Diya', 'Meera', 'Sara', 'Priya',
  'Rohan', 'Karan', 'Neha', 'Pooja', 'Arjun', 'Vikram', 'Sneha', 'Divya', 'Rahul', 'Kavya',
  'Aman', 'Nisha', 'Tarun', 'Ritu', 'Sameer', 'Anjali', 'Manish', 'Swati', 'Gaurav', 'Rekha'];
const LAST = ['Sharma', 'Verma', 'Iyer', 'Nair', 'Gupta', 'Reddy', 'Rao', 'Menon', 'Kapoor', 'Joshi'];
const STATUSES = ['IN_PROGRESS', 'VERIFIED', 'DISCREPANCY', 'AWAITING_INPUT', 'CLOSED'];

function makeSeed() {
  const candidates = [];
  let idCounter = 1;
  for (let i = 0; i < FIRST.length; i++) {
    const first = FIRST[i];
    const last = LAST[i % LAST.length];
    const name = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`;
    const day = String(1 + (i % 28)).padStart(2, '0');
    const month = String(1 + (i % 12)).padStart(2, '0');
    candidates.push({
      id: idCounter++,
      name,
      email,
      status: STATUSES[i % STATUSES.length],
      createdAt: `2026-${month}-${day}`,
    });
  }
  return { candidates, idCounter };
}

module.exports = { makeSeed };
