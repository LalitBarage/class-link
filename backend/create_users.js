async function createUsers() {
  try {
    console.log("Creating Admin...");
    let res = await fetch('http://localhost:4000/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: { firstname: "Admin", lastname: "User" },
        email: "admin@test.com",
        password: "password123"
      })
    });
    console.log("Admin response status:", res.status);
    let data = await res.json();
    console.log("Admin response:", data);
  } catch (e) {
    console.log("Admin error:", e.message);
  }

  try {
    console.log("Creating Faculty...");
    let res = await fetch('http://localhost:4000/faculty/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: { firstname: "Faculty", middlename: "Middle", lastname: "User" },
        email: "faculty@test.com",
        mobileno: "1234567890",
        facultyId: "FAC001",
        qualification: "Ph.D",
        designation: "Professor",
        department: "Computer Science",
        password: "password123"
      })
    });
    console.log("Faculty response status:", res.status);
    let data = await res.json();
    console.log("Faculty response:", data);
  } catch (e) {
    console.log("Faculty error:", e.message);
  }

  try {
    console.log("Creating Student...");
    let res = await fetch('http://localhost:4000/student/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: { firstname: "Student", middlename: "Middle", lastname: "User" },
        email: "student@test.com",
        mobileno: "0987654321",
        rollno: 1,
        prnno: "PRN001",
        year: "2024",
        division: "A",
        department: "Computer Science",
        parentfullname: { firstname: "Parent", lastname: "User" },
        parentemail: "parent@test.com",
        parentmobileno: "1122334455",
        password: "password123"
      })
    });
    console.log("Student response status:", res.status);
    let data = await res.json();
    console.log("Student response:", data);
  } catch (e) {
    console.log("Student error:", e.message);
  }
}

createUsers();
