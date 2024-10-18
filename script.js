// Global variable to track edit mode and the student being edited
let editMode = false;
let editingStudentID = null;

// Event listener for form submission
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const studentName = document.getElementById('studentName').value;
    const studentID = document.getElementById('studentID').value;
    const emailID = document.getElementById('emailID').value;
    const contactNo = document.getElementById('contactNo').value;

    // Validate the form inputs
    if (validateForm(studentName, studentID, emailID, contactNo)) {
        // Check if we are editing an existing student or adding a new one
        if (editMode) {
            updateStudentRecord(studentName, studentID, emailID, contactNo);
        } else {
            addStudentRecord(studentName, studentID, emailID, contactNo);
            saveToLocalStorage(studentName, studentID, emailID, contactNo);
        }

        document.getElementById('registrationForm').reset(); // Reset the form
        editMode = false; // Reset edit mode after submission
    }
});

// Validate form inputs
function validateForm(name, id, email, contact) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // Email validation
    const contactPattern = /^\d{10}$/; // 10-digit phone number pattern

    if (!name) {
        alert('Student Name is required.');
        return false;
    }

    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (!contactPattern.test(contact)) {
        alert('Contact No. must be a 10-digit number.');
        return false;
    }

    return true;
}

// Restrict input in Student ID field
document.getElementById('studentID').addEventListener('input', function() {
    const studentIDField = document.getElementById('studentID');
    const inputValue = studentIDField.value.toUpperCase(); // Automatically convert letters to uppercase
    const validCharacters = inputValue.replace(/[^0-9A-Z]/g, ''); // Allow only numbers and uppercase letters

    if (validCharacters.length > 10) {
        studentIDField.value = validCharacters.substring(0, 10); // Limit to 10 characters
    } else {
        studentIDField.value = validCharacters;
    }
});

// Add new student record to the table
function addStudentRecord(name, id, email, contact) {
    const table = document.querySelector('#studentTable tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${name}</td>
        <td>${id}</td>
        <td>${email}</td>
        <td>${contact}</td>
        <td>
            <button class="action-btn edit-btn" onclick="editRecord(this)">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteRecord(this)">Delete</button>
        </td>
    `;

    table.appendChild(row);
}

// Save student record to localStorage
function saveToLocalStorage(name, id, email, contact) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    // Check if the student ID already exists
    if (students.some(student => student.id === id)) {
        alert('Student ID must be unique.');
        return;
    }
    students.push({ name, id, email, contact });
    localStorage.setItem('students', JSON.stringify(students));
}

// Delete student record
function deleteRecord(button) {
    const row = button.parentElement.parentElement;
    const studentID = row.children[1].innerText; // Get Student ID from the row
    row.remove();

    
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(student => student.id !== studentID); 
    localStorage.setItem('students', JSON.stringify(students)); 
}

function editRecord(button) {
    const row = button.parentElement.parentElement;
    const studentName = row.children[0].innerText;
    const studentID = row.children[1].innerText;
    const emailID = row.children[2].innerText;
    const contactNo = row.children[3].innerText;

    // Populate the form fields with the current student data
    document.getElementById('studentName').value = studentName;
    document.getElementById('studentID').value = studentID;
    document.getElementById('emailID').value = emailID;
    document.getElementById('contactNo').value = contactNo;

    
    editMode = true;
    editingStudentID = studentID; 
}


function updateStudentRecord(name, id, email, contact) {
    // Update the record in the table
    const table = document.querySelector('#studentTable tbody');
    const rows = Array.from(table.rows);

    const rowToUpdate = rows.find(row => row.children[1].innerText === editingStudentID);
    if (rowToUpdate) {
        rowToUpdate.children[0].innerText = name;
        rowToUpdate.children[1].innerText = id;
        rowToUpdate.children[2].innerText = email;
        rowToUpdate.children[3].innerText = contact;
    }

    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.map(student => {
        if (student.id === editingStudentID) {
            return { name, id, email, contact };
        }
        return student;
    });
    localStorage.setItem('students', JSON.stringify(students));
}


document.addEventListener('DOMContentLoaded', function() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.forEach(student => {
        addStudentRecord(student.name, student.id, student.email, student.contact);
    });
});
