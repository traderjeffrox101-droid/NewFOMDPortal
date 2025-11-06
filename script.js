// Sample data for demonstration
let personnelData = [
    {
        id: 1,
        familyName: "Smith",
        firstName: "John",
        middleName: "Michael",
        idNumber: "EMP001",
        dateHired: "2020-01-15",
        employmentStatus: "Regular",
        currentPosition: "Department Head",
        workStatus: "Active",
        sectionAssignment: "PF1 Line Maintenance"
    }
];

// User accounts
let userAccounts = [
    {
        id: 1,
        username: "manager",
        password: "manager123",
        fullName: "John Manager",
        status: "approved",
        userLevel: "Manager"
    },
    {
        id: 2,
        username: "assistant",
        password: "assistant123",
        fullName: "Sarah Assistant",
        status: "approved",
        userLevel: "Assistant Manager"
    },
    {
        id: 3,
        username: "secretary",
        password: "secretary123",
        fullName: "David Secretary",
        status: "approved",
        userLevel: "Secretary"
    },
    {
        id: 4,
        username: "supervisor",
        password: "supervisor123",
        fullName: "Lisa Supervisor",
        status: "approved",
        userLevel: "Section Manager"
    },
    {
        id: 5,
        username: "guest",
        password: "guest123",
        fullName: "Guest User",
        status: "approved",
        userLevel: "Guest"
    },
    {
        id: 999,
        username: "admin",
        password: "admin123",
        fullName: "System Administrator",
        status: "approved",
        userLevel: "Administrator"
    }
];

// DOM Elements
const loginSection = document.getElementById('login-section');
const userDashboard = document.getElementById('user-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const adminLoginForm = document.getElementById('admin-login-form');
const personnelForm = document.getElementById('personnel-form');
const createUserForm = document.getElementById('create-user-form');
const adminLoginModal = document.getElementById('admin-login-modal');
const personnelModal = document.getElementById('personnel-modal');
const createUserModal = document.getElementById('create-user-modal');
const adminIcon = document.getElementById('admin-icon');
const addPersonnelBtn = document.getElementById('add-personnel-btn');
const createUserBtn = document.getElementById('create-user-btn');
const refreshHistoryBtn = document.getElementById('refresh-history-btn');
const accessAdminBtn = document.getElementById('access-admin-btn');
const backToUserBtn = document.getElementById('back-to-user-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const loginError = document.getElementById('login-error');
const adminLoginError = document.getElementById('admin-login-error');
const personnelTableBody = document.getElementById('personnel-table-body');
const adminPersonnelTableBody = document.getElementById('admin-personnel-table-body');
const userManagementTableBody = document.getElementById('user-management-table-body');
const userNameSpan = document.getElementById('user-name');
const userLevelDisplay = document.getElementById('user-level-display');
const userDashboardTitle = document.getElementById('user-dashboard-title');
const currentDateTimeElement = document.getElementById('current-datetime');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Current user state
let currentUser = null;
let isAdmin = false;
let editingPersonnelId = null;
let fromUserPage = false;

// Initialize datetime
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    if (currentDateTimeElement) {
        currentDateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Update datetime every second
setInterval(updateDateTime, 1000);
updateDateTime();

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing event listeners');
    
    // FORM SUBMISSIONS
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    if (personnelForm) {
        personnelForm.addEventListener('submit', handlePersonnelSubmit);
    }
    
    if (createUserForm) {
        createUserForm.addEventListener('submit', handleCreateUserSubmit);
    }
    
    // BUTTON CLICKS
    if (adminIcon) {
        adminIcon.addEventListener('click', showAdminLoginModal);
    }
    
    if (addPersonnelBtn) {
        addPersonnelBtn.addEventListener('click', showAddPersonnelModal);
    }
    
    if (createUserBtn) {
        createUserBtn.addEventListener('click', showCreateUserModal);
    }
    
    if (refreshHistoryBtn) {
        refreshHistoryBtn.addEventListener('click', renderUserManagementTable);
    }
    
    if (accessAdminBtn) {
        accessAdminBtn.addEventListener('click', accessAdminDashboard);
    }
    
    if (backToUserBtn) {
        backToUserBtn.addEventListener('click', backToUserPage);
    }

    // TAB FUNCTIONALITY
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Render appropriate tables when tabs are clicked
            if (tabId === 'user-management') {
                renderUserManagementTable();
            } else if (tabId === 'personnel-management') {
                renderAdminPersonnelTable();
            }
        });
    });

    // MODAL CLOSE BUTTONS
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    // CLOSE MODAL WHEN CLICKING OUTSIDE
    window.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) {
            closeAllModals();
        }
        if (e.target === personnelModal) {
            closeAllModals();
        }
        if (e.target === createUserModal) {
            closeAllModals();
        }
    });

    // NAVIGATION LINKS
    const logoutUser = document.getElementById('logout-link-user');
    const logoutAdmin = document.getElementById('logout-link-admin');
    
    if (logoutUser) {
        logoutUser.addEventListener('click', handleLogout);
    }
    
    if (logoutAdmin) {
        logoutAdmin.addEventListener('click', handleLogout);
    }

    // INITIALIZE DATA DISPLAY
    renderPersonnelTable();
    renderAdminPersonnelTable();
    renderUserManagementTable();
});

// Functions
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt:', username);
    
    // Check if user exists in approved accounts
    const user = userAccounts.find(acc => 
        acc.username === username && acc.password === password && acc.status === 'approved'
    );
    
    if (user) {
        currentUser = user;
        isAdmin = user.userLevel === 'Administrator';
        
        console.log('Login successful:', user.username, 'Level:', user.userLevel);
        
        if (loginError) loginError.style.display = 'none';
        
        // Update last login
        user.lastLogin = new Date().toISOString().split('T')[0];
        
        if (isAdmin) {
            showAdminDashboard();
        } else {
            redirectToUserPage();
        }
    } else {
        console.log('Login failed - user not found or not approved');
        if (loginError) {
            loginError.style.display = 'block';
            loginError.textContent = 'Invalid username or password. Please try again.';
        }
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    const adminUsername = document.getElementById('admin-username').value;
    const adminPassword = document.getElementById('admin-password').value;
    
    console.log('Admin login attempt:', adminUsername);
    
    // Check if admin exists
    const adminUser = userAccounts.find(acc => 
        acc.username === adminUsername && acc.password === adminPassword && 
        acc.status === 'approved' && acc.userLevel === 'Administrator'
    );
    
    if (adminUser) {
        isAdmin = true;
        currentUser = adminUser;
        
        console.log('Admin login successful');
        
        if (adminLoginError) adminLoginError.style.display = 'none';
        closeAllModals();
        showAdminDashboard();
    } else {
        console.log('Admin login failed');
        if (adminLoginError) {
            adminLoginError.style.display = 'block';
            adminLoginError.textContent = 'Invalid administrator credentials. Please try again.';
        }
    }
}

function handleCreateUserSubmit(e) {
    e.preventDefault();
    console.log('Creating new user...');
    
    const username = document.getElementById('create-username').value;
    const password = document.getElementById('create-password').value;
    const fullName = document.getElementById('create-fullname').value;
    const userLevel = document.getElementById('create-user-level').value;
    
    // Validate required fields
    if (!username || !password || !fullName || !userLevel) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Check if username already exists
    const usernameExists = userAccounts.some(acc => acc.username === username);
    
    if (usernameExists) {
        alert('Username already exists. Please choose a different username.');
        return;
    }
    
    // Generate unique ID
    const newId = userAccounts.length > 0 ? Math.max(...userAccounts.map(user => user.id)) + 1 : 1;
    
    // Create user
    const newUser = {
        id: newId,
        username: username,
        password: password,
        fullName: fullName,
        status: 'approved',
        userLevel: userLevel,
        lastLogin: ''
    };
    
    // Add to user accounts
    userAccounts.push(newUser);
    
    // Update UI
    renderUserManagementTable();
    
    // Show success message
    alert(`✅ SUCCESS! User "${username}" has been created with "${userLevel}" access level.`);
    
    // Close modal and reset form
    closeAllModals();
    createUserForm.reset();
}

function handlePersonnelSubmit(e) {
    e.preventDefault();
    console.log('Handling personnel submission...');
    
    const personnel = {
        familyName: document.getElementById('family-name').value,
        firstName: document.getElementById('first-name').value,
        middleName: document.getElementById('middle-name').value,
        idNumber: document.getElementById('id-number').value,
        dateHired: document.getElementById('date-hired').value,
        employmentStatus: document.getElementById('employment-status').value,
        currentPosition: document.getElementById('current-position').value,
        workStatus: document.getElementById('work-status').value,
        sectionAssignment: document.getElementById('section-assignment').value
    };
    
    // Validate required fields
    if (!personnel.familyName || !personnel.firstName || !personnel.idNumber || !personnel.dateHired || 
        !personnel.employmentStatus || !personnel.currentPosition || !personnel.workStatus || !personnel.sectionAssignment) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (editingPersonnelId) {
        // Update existing personnel
        personnel.id = editingPersonnelId;
        updatePersonnel(personnel);
        alert('Personnel record updated successfully!');
    } else {
        // Add new personnel
        addPersonnel(personnel);
        alert('Personnel record added successfully!');
    }
    
    closeAllModals();
    resetPersonnelForm();
}

function handleLogout(e) {
    e.preventDefault();
    currentUser = null;
    isAdmin = false;
    fromUserPage = false;
    showLoginSection();
    if (userDashboard) userDashboard.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'none';
    if (loginForm) loginForm.reset();
}

function showLoginSection() {
    if (loginSection) loginSection.style.display = 'flex';
    if (userDashboard) userDashboard.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'none';
    
    if (loginError) loginError.style.display = 'none';
}

function showAdminLoginModal() {
    if (adminLoginModal) {
        adminLoginModal.style.display = 'flex';
        if (adminLoginForm) adminLoginForm.reset();
        if (adminLoginError) adminLoginError.style.display = 'none';
    }
}

function showAddPersonnelModal() {
    console.log('Showing add personnel modal');
    if (personnelModal) {
        document.getElementById('personnel-modal-title').textContent = 'Add Personnel';
        editingPersonnelId = null;
        personnelModal.style.display = 'flex';
        if (personnelForm) personnelForm.reset();
    }
}

function showCreateUserModal() {
    console.log('Showing create user modal');
    if (createUserModal) {
        createUserModal.style.display = 'flex';
        if (createUserForm) createUserForm.reset();
    }
}

function closeAllModals() {
    if (adminLoginModal) adminLoginModal.style.display = 'none';
    if (personnelModal) personnelModal.style.display = 'none';
    if (createUserModal) createUserModal.style.display = 'none';
    resetPersonnelForm();
}

function resetPersonnelForm() {
    if (personnelForm) personnelForm.reset();
    editingPersonnelId = null;
}

function showUserDashboard() {
    if (loginSection) loginSection.style.display = 'none';
    if (userDashboard) userDashboard.style.display = 'block';
    if (adminDashboard) adminDashboard.style.display = 'none';
    
    if (userNameSpan && currentUser) userNameSpan.textContent = currentUser.fullName;
    if (userLevelDisplay && currentUser) userLevelDisplay.textContent = currentUser.userLevel;
    
    // Show admin access button for admin users
    if (accessAdminBtn && currentUser && currentUser.userLevel === 'Administrator') {
        accessAdminBtn.style.display = 'inline-block';
    } else if (accessAdminBtn) {
        accessAdminBtn.style.display = 'none';
    }
    
    // Update dashboard title based on user level
    if (userDashboardTitle && currentUser) {
        switch(currentUser.userLevel) {
            case 'Manager':
                userDashboardTitle.textContent = 'Manager Dashboard';
                break;
            case 'Assistant Manager':
                userDashboardTitle.textContent = 'Assistant Manager Dashboard';
                break;
            case 'Secretary':
                userDashboardTitle.textContent = 'Secretary Dashboard';
                break;
            case 'Section Manager':
                userDashboardTitle.textContent = 'Section Manager Dashboard';
                break;
            case 'Guest':
                userDashboardTitle.textContent = 'Guest Dashboard';
                break;
            default:
                userDashboardTitle.textContent = 'User Dashboard';
        }
    }
    
    renderPersonnelTable();
}

function redirectToUserPage() {
    if (!currentUser) return;
    
    switch(currentUser.userLevel) {
        case 'Manager':
            window.location.href = 'manager-page.html';
            break;
        case 'Assistant Manager':
            window.location.href = 'assistant-manager-page.html';
            break;
        case 'Secretary':
            window.location.href = 'office-secretary-page.html';
            break;
        case 'Section Manager':
            window.location.href = 'section-supervisor-page.html';
            break;
        case 'Guest':
            window.location.href = 'guest-page.html';
            break;
        default:
            showUserDashboard();
    }
}

function showAdminDashboard() {
    console.log('Showing admin dashboard');
    if (loginSection) loginSection.style.display = 'none';
    if (userDashboard) userDashboard.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';
    
    // Show back to user button if coming from user page
    if (backToUserBtn) {
        if (fromUserPage) {
            backToUserBtn.style.display = 'inline-block';
        } else {
            backToUserBtn.style.display = 'none';
        }
    }
    
    // Render all admin tables
    renderAdminPersonnelTable();
    renderUserManagementTable();
}

function accessAdminDashboard() {
    fromUserPage = true;
    showAdminDashboard();
}

function backToUserPage() {
    fromUserPage = false;
    showUserDashboard();
}

// Personnel management functions
function addPersonnel(personnel) {
    personnel.id = personnelData.length > 0 ? Math.max(...personnelData.map(p => p.id)) + 1 : 1;
    personnelData.push(personnel);
    renderAdminPersonnelTable();
    renderPersonnelTable();
}

function updatePersonnel(updatedPersonnel) {
    const index = personnelData.findIndex(p => p.id === updatedPersonnel.id);
    if (index !== -1) {
        personnelData[index] = updatedPersonnel;
        renderAdminPersonnelTable();
        renderPersonnelTable();
    }
}

function deletePersonnel(id) {
    if (confirm('Are you sure you want to delete this personnel record?')) {
        personnelData = personnelData.filter(p => p.id !== id);
        renderAdminPersonnelTable();
        renderPersonnelTable();
        alert('Personnel record deleted successfully!');
    }
}

function updateUserLevel(userId, newLevel) {
    const userIndex = userAccounts.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        userAccounts[userIndex].userLevel = newLevel;
        renderUserManagementTable();
        alert(`User level updated to ${newLevel}.`);
    }
}

function revokeUserAccess(userId) {
    const user = userAccounts.find(u => u.id === userId);
    if (user) {
        if (confirm(`Are you sure you want to revoke access for ${user.username}?`)) {
            user.status = 'revoked';
            renderUserManagementTable();
            alert(`Access revoked for ${user.username}.`);
        }
    }
}

function restoreUserAccess(userId) {
    const user = userAccounts.find(u => u.id === userId);
    if (user) {
        if (confirm(`Are you sure you want to restore access for ${user.username}?`)) {
            user.status = 'approved';
            renderUserManagementTable();
            alert(`Access restored for ${user.username}.`);
        }
    }
}

// Render functions
function renderPersonnelTable() {
    if (!personnelTableBody) return;
    
    const sortedPersonnel = [...personnelData].sort((a, b) => 
        a.familyName.localeCompare(b.familyName)
    );
    
    personnelTableBody.innerHTML = '';
    
    if (sortedPersonnel.length === 0) {
        personnelTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">No personnel records found</td>
            </tr>
        `;
        return;
    }
    
    sortedPersonnel.forEach(personnel => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${personnel.familyName}, ${personnel.firstName} ${personnel.middleName}</td>
            <td>${personnel.idNumber}</td>
            <td>${formatDate(personnel.dateHired)}</td>
            <td>${personnel.employmentStatus}</td>
            <td>${personnel.currentPosition}</td>
            <td>${personnel.workStatus}</td>
            <td>${personnel.sectionAssignment}</td>
        `;
        personnelTableBody.appendChild(row);
    });
}

function renderAdminPersonnelTable() {
    if (!adminPersonnelTableBody) return;
    
    const sortedPersonnel = [...personnelData].sort((a, b) => 
        a.familyName.localeCompare(b.familyName)
    );
    
    adminPersonnelTableBody.innerHTML = '';
    
    if (sortedPersonnel.length === 0) {
        adminPersonnelTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center;">No personnel records found</td>
            </tr>
        `;
        return;
    }
    
    sortedPersonnel.forEach(personnel => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${personnel.familyName}, ${personnel.firstName} ${personnel.middleName}</td>
            <td>${personnel.idNumber}</td>
            <td>${formatDate(personnel.dateHired)}</td>
            <td>${personnel.employmentStatus}</td>
            <td>${personnel.currentPosition}</td>
            <td>${personnel.workStatus}</td>
            <td>${personnel.sectionAssignment}</td>
            <td>
                <button class="btn btn-primary btn-small" onclick="showEditPersonnelModal(${personnel.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="deletePersonnel(${personnel.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        adminPersonnelTableBody.appendChild(row);
    });
}

function renderUserManagementTable() {
    if (!userManagementTableBody) return;
    
    userManagementTableBody.innerHTML = '';
    
    if (userAccounts.length === 0) {
        userManagementTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center;">No user accounts found</td>
            </tr>
        `;
        return;
    }
    
    userAccounts.forEach(user => {
        const statusBadge = user.status === 'approved' ? 
            '<span class="status-badge status-active">Active</span>' : 
            '<span class="status-badge status-revoked">Revoked</span>';
        
        const userLevelBadge = getUserLevelBadge(user.userLevel);
        const lastLogin = user.lastLogin ? formatDate(user.lastLogin) : 'Never';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td><span class="password-field">${user.password}</span></td>
            <td>${userLevelBadge}</td>
            <td>${statusBadge}</td>
            <td>${lastLogin}</td>
            <td>
                <select class="user-level-select" onchange="updateUserLevel(${user.id}, this.value)" style="padding: 5px; margin-right: 10px;">
                    <option value="Manager" ${user.userLevel === 'Manager' ? 'selected' : ''}>Manager</option>
                    <option value="Assistant Manager" ${user.userLevel === 'Assistant Manager' ? 'selected' : ''}>Assistant Manager</option>
                    <option value="Secretary" ${user.userLevel === 'Secretary' ? 'selected' : ''}>Secretary</option>
                    <option value="Section Manager" ${user.userLevel === 'Section Manager' ? 'selected' : ''}>Section Manager</option>
                    <option value="Guest" ${user.userLevel === 'Guest' ? 'selected' : ''}>Guest</option>
                </select>
                ${user.status === 'approved' ? 
                    `<button class="btn btn-danger btn-small" onclick="revokeUserAccess(${user.id})">
                        <i class="fas fa-ban"></i> Revoke
                    </button>` :
                    `<button class="btn btn-success btn-small" onclick="restoreUserAccess(${user.id})">
                        <i class="fas fa-check-circle"></i> Restore
                    </button>`
                }
            </td>
        `;
        userManagementTableBody.appendChild(row);
    });
}

function getUserLevelBadge(userLevel) {
    if (!userLevel) return '-';
    
    const levelClass = userLevel.toLowerCase().replace(' ', '-');
    return `<span class="user-level-badge level-${levelClass}">${userLevel}</span>`;
}

function showEditPersonnelModal(id) {
    const personnel = personnelData.find(p => p.id === id);
    if (personnel) {
        document.getElementById('personnel-modal-title').textContent = 'Edit Personnel';
        editingPersonnelId = id;
        
        document.getElementById('family-name').value = personnel.familyName;
        document.getElementById('first-name').value = personnel.firstName;
        document.getElementById('middle-name').value = personnel.middleName;
        document.getElementById('id-number').value = personnel.idNumber;
        document.getElementById('date-hired').value = personnel.dateHired;
        document.getElementById('employment-status').value = personnel.employmentStatus;
        document.getElementById('current-position').value = personnel.currentPosition;
        document.getElementById('work-status').value = personnel.workStatus;
        document.getElementById('section-assignment').value = personnel.sectionAssignment;
        
        if (personnelModal) personnelModal.style.display = 'flex';
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Make functions globally available for onclick handlers
window.showEditPersonnelModal = showEditPersonnelModal;
window.deletePersonnel = deletePersonnel;
window.updateUserLevel = updateUserLevel;
window.revokeUserAccess = revokeUserAccess;
window.restoreUserAccess = restoreUserAccess;