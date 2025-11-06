// data-manager.js
class DataManager {
    constructor() {
        this.storageKeys = {
            personnel: 'fomd_personnel_data',
            users: 'fomd_user_accounts'
        };
        this.init();
    }

    init() {
        // Initialize with default data if no data exists
        if (!this.getPersonnel().length) {
            this.setPersonnel(this.getDefaultPersonnel());
        }
        if (!this.getUsers().length) {
            this.setUsers(this.getDefaultUsers());
        }
    }

    // Personnel data management
    getPersonnel() {
        const data = localStorage.getItem(this.storageKeys.personnel);
        return data ? JSON.parse(data) : [];
    }

    setPersonnel(personnel) {
        localStorage.setItem(this.storageKeys.personnel, JSON.stringify(personnel));
        return true;
    }

    addPersonnel(personnel) {
        const allPersonnel = this.getPersonnel();
        const newId = allPersonnel.length > 0 ? Math.max(...allPersonnel.map(p => p.id)) + 1 : 1;
        personnel.id = newId;
        allPersonnel.push(personnel);
        return this.setPersonnel(allPersonnel);
    }

    updatePersonnel(updatedPersonnel) {
        const allPersonnel = this.getPersonnel();
        const index = allPersonnel.findIndex(p => p.id === updatedPersonnel.id);
        if (index !== -1) {
            allPersonnel[index] = updatedPersonnel;
            return this.setPersonnel(allPersonnel);
        }
        return false;
    }

    deletePersonnel(id) {
        const allPersonnel = this.getPersonnel();
        const filtered = allPersonnel.filter(p => p.id !== id);
        return this.setPersonnel(filtered);
    }

    // User data management
    getUsers() {
        const data = localStorage.getItem(this.storageKeys.users);
        return data ? JSON.parse(data) : [];
    }

    setUsers(users) {
        localStorage.setItem(this.storageKeys.users, JSON.stringify(users));
        return true;
    }

    addUser(user) {
        const allUsers = this.getUsers();
        const newId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;
        user.id = newId;
        user.lastLogin = '';
        allUsers.push(user);
        return this.setUsers(allUsers);
    }

    updateUser(updatedUser) {
        const allUsers = this.getUsers();
        const index = allUsers.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            allUsers[index] = updatedUser;
            return this.setUsers(allUsers);
        }
        return false;
    }

    deleteUser(id) {
        const allUsers = this.getUsers();
        const filtered = allUsers.filter(u => u.id !== id);
        return this.setUsers(filtered);
    }

    // Default data
    getDefaultPersonnel() {
        return [
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
    }

    getDefaultUsers() {
        return [
            {
                id: 1,
                username: "manager",
                password: "manager123",
                fullName: "John Manager",
                status: "approved",
                userLevel: "Manager",
                lastLogin: ""
            },
            {
                id: 2,
                username: "assistant",
                password: "assistant123",
                fullName: "Sarah Assistant",
                status: "approved",
                userLevel: "Assistant Manager",
                lastLogin: ""
            },
            {
                id: 3,
                username: "secretary",
                password: "secretary123",
                fullName: "David Secretary",
                status: "approved",
                userLevel: "Secretary",
                lastLogin: ""
            },
            {
                id: 4,
                username: "supervisor",
                password: "supervisor123",
                fullName: "Lisa Supervisor",
                status: "approved",
                userLevel: "Section Manager",
                lastLogin: ""
            },
            {
                id: 5,
                username: "guest",
                password: "guest123",
                fullName: "Guest User",
                status: "approved",
                userLevel: "Guest",
                lastLogin: ""
            },
            {
                id: 999,
                username: "admin",
                password: "admin123",
                fullName: "System Administrator",
                status: "approved",
                userLevel: "Administrator",
                lastLogin: ""
            }
        ];
    }

    // Export/Import functionality
    exportData() {
        const data = {
            personnel: this.getPersonnel(),
            users: this.getUsers(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.personnel && data.users) {
                this.setPersonnel(data.personnel);
                this.setUsers(data.users);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    clearAllData() {
        localStorage.removeItem(this.storageKeys.personnel);
        localStorage.removeItem(this.storageKeys.users);
        this.init(); // Restore default data
        return true;
    }

    // Check if storage is working
    testStorage() {
        try {
            const testKey = 'fomd_storage_test';
            localStorage.setItem(testKey, 'test');
            const result = localStorage.getItem(testKey) === 'test';
            localStorage.removeItem(testKey);
            return result;
        } catch (error) {
            console.error('Storage test failed:', error);
            return false;
        }
    }
}

// Create global instance
window.dataManager = new DataManager();