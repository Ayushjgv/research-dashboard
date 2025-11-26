const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/faculty_portal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Enhanced Schemas with User Authentication
const userSchema = new mongoose.Schema({
    id: Number,
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    department: String,
    designation: String,
    profileImage: String,
    phone: String,
    bio: String,
    researchInterests: [String],
    qualifications: [String],
    joinDate: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'faculty' } // faculty, admin
});

const facultySchema = new mongoose.Schema({
    id: Number,
    name: String,
    designation: String,
    department: String,
    email: String,
    phone: String,
    qualifications: [String],
    research_interests: [String],
    publications: Number,
    citations: Number,
    h_index: Number,
    projects: Number,
    profile_image: String,
    join_date: Date,
    google_scholar_id: String,
    scopus_id: String,
    bio: String,
    office_address: String,
    website: String,
    teaching_subjects: [String],
    awards: [String],
    education: [{
        degree: String,
        institution: String,
        year: Number
    }],
    experience: [{
        position: String,
        organization: String,
        duration: String
    }]
});

const publicationSchema = new mongoose.Schema({
    id: Number,
    title: String,
    authors: [String],
    journal: String,
    year: Number,
    doi: String,
    citations: Number,
    faculty_ids: [Number],
    abstract: String,
    keywords: [String],
    type: String,
    volume: String,
    issue: String,
    pages: String,
    publisher: String,
    impact_factor: Number
});

const departmentSchema = new mongoose.Schema({
    name: String,
    code: String,
    faculty_count: Number,
    publications_count: Number,
    citations_count: Number,
    h_index_avg: Number,
    head_of_department: String,
    established_year: Number,
    description: String
});

const projectSchema = new mongoose.Schema({
    id: Number,
    title: String,
    faculty_ids: [Number],
    funding_agency: String,
    amount: Number,
    duration: String,
    status: String,
    description: String
});

const User = mongoose.model('User', userSchema);
const Faculty = mongoose.model('Faculty', facultySchema);
const Publication = mongoose.model('Publication', publicationSchema);
const Department = mongoose.model('Department', departmentSchema);
const Project = mongoose.model('Project', projectSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, department, designation, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            id: Math.floor(Math.random() * 100000),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            department,
            designation,
            phone,
            profileImage: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=1A949B&color=fff&size=200`
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                department: newUser.department,
                designation: newUser.designation,
                profileImage: newUser.profileImage
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                department: user.department,
                designation: user.designation,
                profileImage: user.profileImage,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ id: req.user.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                department: user.department,
                designation: user.designation,
                profileImage: user.profileImage,
                phone: user.phone,
                bio: user.bio,
                researchInterests: user.researchInterests,
                qualifications: user.qualifications,
                joinDate: user.joinDate,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, phone, bio, researchInterests, qualifications } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { id: req.user.userId },
            {
                firstName,
                lastName,
                phone,
                bio,
                researchInterests,
                qualifications
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                department: updatedUser.department,
                designation: updatedUser.designation,
                profileImage: updatedUser.profileImage,
                phone: updatedUser.phone,
                bio: updatedUser.bio,
                researchInterests: updatedUser.researchInterests,
                qualifications: updatedUser.qualifications
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
});

// Existing routes (unchanged)
app.get('/api/faculty', async (req, res) => {
    try {
        const { page = 1, limit = 10, department, search, designation } = req.query;
        let query = {};
        
        if (department && department !== 'all') query.department = department;
        if (designation && designation !== 'all') query.designation = designation;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { research_interests: { $regex: search, $options: 'i' } },
                { 'education.institution': { $regex: search, $options: 'i' } }
            ];
        }
        
        const faculty = await Faculty.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ publications: -1 });
            
        const total = await Faculty.countDocuments(query);
        
        res.json({
            faculty,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/faculty/:id', async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ id: parseInt(req.params.id) });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
        
        const publications = await Publication.find({ faculty_ids: parseInt(req.params.id) })
            .sort({ year: -1, citations: -1 });
            
        const projects = await Project.find({ faculty_ids: parseInt(req.params.id) });
        
        res.json({
            faculty,
            publications,
            projects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/publications', async (req, res) => {
    try {
        const { page = 1, limit = 10, year, type, faculty_id } = req.query;
        let query = {};
        
        if (year) query.year = parseInt(year);
        if (type && type !== 'all') query.type = type;
        if (faculty_id) query.faculty_ids = parseInt(faculty_id);
        
        const publications = await Publication.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ citations: -1, year: -1 });
            
        const total = await Publication.countDocuments(query);
        
        res.json({
            publications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/publications/top', async (req, res) => {
    try {
        const publications = await Publication.find()
            .sort({ citations: -1 })
            .limit(5);
        res.json(publications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/departments', async (req, res) => {
    try {
        const departments = await Department.find().sort({ faculty_count: -1 });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const totalFaculty = await Faculty.countDocuments();
        const totalPublications = await Publication.countDocuments();
        const totalCitations = await Faculty.aggregate([
            { $group: { _id: null, total: { $sum: "$citations" } } }
        ]);
        
        const departmentStats = await Department.find();
        const designations = await Faculty.aggregate([
            { $group: { _id: "$designation", count: { $sum: 1 } } }
        ]);
        
        const topFaculty = await Faculty.find()
            .sort({ publications: -1 })
            .limit(5);
            
        const recentPublications = await Publication.find()
            .sort({ year: -1 })
            .limit(5);
        
        res.json({
            totalFaculty,
            totalPublications,
            totalCitations: totalCitations[0]?.total || 0,
            departmentStats,
            designations,
            topFaculty,
            recentPublications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/chart-data', async (req, res) => {
    try {
        const departmentData = await Department.find();
        const facultyByDept = await Faculty.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
        
        const publicationsByYear = await Publication.aggregate([
            { $group: { _id: "$year", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        
        res.json({
            departmentData,
            facultyByDept,
            publicationsByYear
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const { q, field = 'all' } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Search query required' });
        }
        
        let query = {};
        
        switch (field) {
            case 'tname':
                query = { name: { $regex: q, $options: 'i' } };
                break;
            case 'tdesignation':
                query = { designation: { $regex: q, $options: 'i' } };
                break;
            case 'tdepartment':
                query = { department: { $regex: q, $options: 'i' } };
                break;
            case 'texpertise':
                query = { research_interests: { $regex: q, $options: 'i' } };
                break;
            default:
                query = {
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { designation: { $regex: q, $options: 'i' } },
                        { department: { $regex: q, $options: 'i' } },
                        { research_interests: { $regex: q, $options: 'i' } }
                    ]
                };
        }
        
        const faculty = await Faculty.find(query).limit(50);
        const publications = await Publication.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { authors: { $regex: q, $options: 'i' } },
                { journal: { $regex: q, $options: 'i' } }
            ]
        }).limit(50);
        
        res.json({
            faculty,
            publications,
            facultyCount: faculty.length,
            publicationsCount: publications.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/faculty/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/faculty-profile.html'));
});

app.get('/department/:name', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/department.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/search.html'));
});

app.get('/faculty', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/faculty-list.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/register.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/user-profile.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
});
