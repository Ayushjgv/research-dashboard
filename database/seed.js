const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/faculty_portal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Enhanced Schemas
const Faculty = mongoose.model('Faculty', new mongoose.Schema({
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
}));

const Publication = mongoose.model('Publication', new mongoose.Schema({
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
}));

const Department = mongoose.model('Department', new mongoose.Schema({
    name: String,
    code: String,
    faculty_count: Number,
    publications_count: Number,
    citations_count: Number,
    h_index_avg: Number,
    head_of_department: String,
    established_year: Number,
    description: String
}));

const Project = mongoose.model('Project', new mongoose.Schema({
    id: Number,
    title: String,
    faculty_ids: [Number],
    funding_agency: String,
    amount: Number,
    duration: String,
    status: String,
    description: String
}));

// Enhanced sample data
const departments = [
    { 
        name: "Computer Science and Engineering", 
        code: "CSE", 
        faculty_count: 30, 
        publications_count: 1200, 
        citations_count: 25000, 
        h_index_avg: 15,
        head_of_department: "Dr. Rajesh Kumar",
        established_year: 1987,
        description: "Department of Computer Science and Engineering focuses on cutting-edge research in AI, Machine Learning, Data Science, and Software Engineering."
    },
    { 
        name: "Electronics and Communication Engineering", 
        code: "ECE", 
        faculty_count: 25, 
        publications_count: 900, 
        citations_count: 18000, 
        h_index_avg: 12,
        head_of_department: "Dr. Sunil Sharma",
        established_year: 1985,
        description: "Department of Electronics and Communication Engineering specializes in VLSI, Signal Processing, and Communication Systems."
    },
    { 
        name: "Mechanical Engineering", 
        code: "ME", 
        faculty_count: 19, 
        publications_count: 750, 
        citations_count: 15000, 
        h_index_avg: 11,
        head_of_department: "Dr. Anil Verma",
        established_year: 1982,
        description: "Department of Mechanical Engineering focuses on Thermal Engineering, Manufacturing, and Robotics."
    },
    { 
        name: "Civil Engineering", 
        code: "CE", 
        faculty_count: 19, 
        publications_count: 600, 
        citations_count: 12000, 
        h_index_avg: 10,
        head_of_department: "Dr. Vijay Singh",
        established_year: 1980,
        description: "Department of Civil Engineering specializes in Structural Engineering, Environmental Engineering, and Construction Management."
    },
    { 
        name: "Chemical Engineering", 
        code: "CHE", 
        faculty_count: 18, 
        publications_count: 550, 
        citations_count: 11000, 
        h_index_avg: 9,
        head_of_department: "Dr. Sanjay Yadav",
        established_year: 1988,
        description: "Department of Chemical Engineering focuses on Process Engineering, Biotechnology, and Environmental Science."
    },
    { 
        name: "Instrumentation and Control Engineering", 
        code: "ICE", 
        faculty_count: 18, 
        publications_count: 500, 
        citations_count: 9000, 
        h_index_avg: 8,
        head_of_department: "Dr. Rahul Gupta",
        established_year: 1990,
        description: "Department of Instrumentation and Control Engineering specializes in Control Systems, Embedded Systems, and Industrial Automation."
    },
    { 
        name: "Industrial and Production Engineering", 
        code: "IPE", 
        faculty_count: 19, 
        publications_count: 450, 
        citations_count: 8000, 
        h_index_avg: 7,
        head_of_department: "Dr. Rohit Malhotra",
        established_year: 1992,
        description: "Department of Industrial and Production Engineering focuses on Operations Research, Supply Chain Management, and Quality Engineering."
    },
    { 
        name: "Mathematics", 
        code: "MATH", 
        faculty_count: 16, 
        publications_count: 400, 
        citations_count: 7000, 
        h_index_avg: 6,
        head_of_department: "Dr. Akhil Chopra",
        established_year: 1978,
        description: "Department of Mathematics specializes in Applied Mathematics, Statistics, and Computational Mathematics."
    },
    { 
        name: "Physics", 
        code: "PHY", 
        faculty_count: 11, 
        publications_count: 350, 
        citations_count: 6000, 
        h_index_avg: 6,
        head_of_department: "Dr. Varun Reddy",
        established_year: 1976,
        description: "Department of Physics focuses on Material Science, Nanotechnology, and Condensed Matter Physics."
    },
    { 
        name: "Chemistry", 
        code: "CHEM", 
        faculty_count: 11, 
        publications_count: 300, 
        citations_count: 5000, 
        h_index_avg: 5,
        head_of_department: "Dr. Karan Patel",
        established_year: 1975,
        description: "Department of Chemistry specializes in Organic Chemistry, Inorganic Chemistry, and Analytical Chemistry."
    }
];

const designations = [
    "Director", "Professor", "Associate Professor", "Assistant Professor", 
    "Assistant Professor (Grade-I)", "Assistant Professor (Grade-II)", 
    "Lecturer", "Librarian", "Assistant Librarian", "Deputy Librarian",
    "Guest Faculty", "Head", "Lecturer - Selection Grade", "Professor (HAG)"
];

const researchInterests = [
    "Machine Learning", "Artificial Intelligence", "Data Science", "Computer Networks", 
    "Cyber Security", "Internet of Things", "Cloud Computing", "Software Engineering",
    "VLSI Design", "Signal Processing", "Communication Systems", "Embedded Systems",
    "Thermal Engineering", "Manufacturing", "Robotics", "Structural Engineering",
    "Environmental Engineering", "Biotechnology", "Nanotechnology", "Renewable Energy",
    "Power Systems", "Control Systems", "Operations Research", "Supply Chain Management",
    "Applied Mathematics", "Statistics", "Material Science", "Condensed Matter Physics",
    "Organic Chemistry", "Inorganic Chemistry", "Analytical Chemistry", "Process Engineering"
];

const journals = [
    "IEEE Transactions on Pattern Analysis and Machine Intelligence",
    "IEEE Transactions on Neural Networks and Learning Systems", 
    "ACM Computing Surveys",
    "Springer Nature Journal",
    "Elsevier Journal of Computer Science",
    "International Journal of Computer Vision",
    "Journal of Machine Learning Research",
    "IEEE Transactions on Image Processing",
    "IEEE Transactions on Knowledge and Data Engineering",
    "ACM Transactions on Database Systems",
    "IEEE Transactions on Software Engineering",
    "IEEE Transactions on Computers",
    "IEEE Transactions on Mobile Computing",
    "IEEE Transactions on Parallel and Distributed Systems",
    "IEEE Transactions on Information Theory",
    "IEEE Transactions on Communications",
    "IEEE Transactions on Signal Processing",
    "IEEE Transactions on Vehicular Technology",
    "IEEE Transactions on Power Systems",
    "IEEE Transactions on Industrial Electronics"
];

const fundingAgencies = [
    "DST", "CSIR", "UGC", "AICTE", "DRDO", "ISRO", "DBT", "ICMR", 
    "Ministry of Education", "SERB", "TEQIP", "World Bank"
];

function generateFaculty() {
    const faculties = [];
    const firstNames = ["Raj", "Amit", "Sunil", "Anil", "Vijay", "Sanjay", "Rahul", "Rohit", "Akhil", "Varun", "Karan", "Arjun", "Neeraj", "Pankaj", "Deepak", "Ravi", "Manoj", "Suresh", "Naresh", "Mahesh"];
    const lastNames = ["Kumar", "Sharma", "Verma", "Singh", "Yadav", "Gupta", "Malhotra", "Chopra", "Reddy", "Patel", "Joshi", "Shukla", "Mishra", "Tiwari", "Bansal", "Sharma", "Jain", "Aggarwal", "Goel", "Saxena"];
    
    let id = 1;
    
    departments.forEach(dept => {
        for (let i = 0; i < dept.faculty_count; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const publications = Math.floor(Math.random() * 100) + 10;
            const citations = Math.floor(Math.random() * 2000) + 100;
            const h_index = Math.floor(Math.random() * 20) + 5;
            
            const education = [
                { degree: "Ph.D.", institution: "IIT Delhi", year: 2005 + Math.floor(Math.random() * 15) },
                { degree: "M.Tech", institution: "NIT Jalandhar", year: 2000 + Math.floor(Math.random() * 10) },
                { degree: "B.Tech", institution: "University of Delhi", year: 1995 + Math.floor(Math.random() * 10) }
            ];
            
            const experience = [
                { position: "Professor", organization: "NIT Jalandhar", duration: "2015-Present" },
                { position: "Associate Professor", organization: "NIT Kurukshetra", duration: "2010-2015" },
                { position: "Assistant Professor", organization: "IIT Roorkee", duration: "2005-2010" }
            ];
            
            const awards = [
                "Best Teacher Award",
                "Research Excellence Award", 
                "Young Scientist Award",
                "Best Paper Award"
            ].slice(0, Math.floor(Math.random() * 3) + 1);
            
            faculties.push({
                id: id++,
                name: `Dr. ${firstName} ${lastName}`,
                designation: designations[Math.floor(Math.random() * designations.length)],
                department: dept.name,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nitj.ac.in`,
                phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                qualifications: ["Ph.D.", "M.Tech", "B.Tech"],
                research_interests: researchInterests.sort(() => 0.5 - Math.random()).slice(0, 4),
                publications: publications,
                citations: citations,
                h_index: h_index,
                projects: Math.floor(Math.random() * 10) + 1,
                profile_image: `https://nitj.irins.org/profile_images/${90000 + id}.jpg`,
                join_date: new Date(2010 + Math.floor(Math.random() * 13), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                google_scholar_id: `scholar${100000 + id}`,
                scopus_id: `scopus${200000 + id}`,
                bio: `Dr. ${firstName} ${lastName} is a renowned expert in ${researchInterests[Math.floor(Math.random() * researchInterests.length)]} with over ${publications} publications and ${citations} citations. Their research focuses on cutting-edge technologies and innovative solutions.`,
                office_address: `Department of ${dept.name}, NIT Jalandhar, Punjab - 144011`,
                website: `http://nitj.ac.in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
                teaching_subjects: [`Advanced ${researchInterests[Math.floor(Math.random() * researchInterests.length)]}`, "Research Methodology", "Professional Ethics"],
                awards: awards,
                education: education,
                experience: experience
            });
        }
    });
    
    return faculties;
}

function generatePublications(faculties) {
    const publications = [];
    const types = ["Journal Article", "Conference Paper", "Book Chapter", "Review Article", "Book"];
    
    let pubId = 1;
    
    faculties.forEach(faculty => {
        const pubCount = Math.floor(Math.random() * 30) + 10;
        
        for (let i = 0; i < pubCount; i++) {
            const year = 2010 + Math.floor(Math.random() * 14);
            const citations = Math.floor(Math.random() * 200);
            const impact_factor = Math.random() * 10 + 1;
            
            publications.push({
                id: pubId++,
                title: `Advanced Research in ${researchInterests[Math.floor(Math.random() * researchInterests.length)]}: A Comprehensive Study`,
                authors: [faculty.name, "Co-Author 1", "Co-Author 2", "Co-Author 3"],
                journal: journals[Math.floor(Math.random() * journals.length)],
                year: year,
                doi: `10.1000/xyz${pubId}`,
                citations: citations,
                faculty_ids: [faculty.id],
                abstract: `This paper presents groundbreaking research in ${researchInterests[Math.floor(Math.random() * researchInterests.length)]}. The study investigates novel approaches and provides significant contributions to the field. Our methodology combines theoretical analysis with practical implementations, demonstrating remarkable results that advance the current state of knowledge.`,
                keywords: researchInterests.sort(() => 0.5 - Math.random()).slice(0, 5),
                type: types[Math.floor(Math.random() * types.length)],
                volume: `${Math.floor(Math.random() * 50) + 1}`,
                issue: `${Math.floor(Math.random() * 12) + 1}`,
                pages: `${Math.floor(Math.random() * 900) + 1}-${Math.floor(Math.random() * 900) + 1000}`,
                publisher: "Springer",
                impact_factor: parseFloat(impact_factor.toFixed(2))
            });
        }
    });
    
    return publications;
}

function generateProjects(faculties) {
    const projects = [];
    const statuses = ["Ongoing", "Completed", "Upcoming"];
    
    let projectId = 1;
    
    faculties.forEach(faculty => {
        const projectCount = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < projectCount; i++) {
            const amount = (Math.floor(Math.random() * 100) + 10) * 100000;
            const duration = `${Math.floor(Math.random() * 3) + 1} Years`;
            
            projects.push({
                id: projectId++,
                title: `Development of Advanced ${researchInterests[Math.floor(Math.random() * researchInterests.length)]} System`,
                faculty_ids: [faculty.id],
                funding_agency: fundingAgencies[Math.floor(Math.random() * fundingAgencies.length)],
                amount: amount,
                duration: duration,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                description: `This project aims to develop innovative solutions in ${researchInterests[Math.floor(Math.random() * researchInterests.length)]}. The research will contribute significantly to technological advancement and practical applications in the field.`
            });
        }
    });
    
    return projects;
}

async function seedDatabase() {
    try {
        // Clear existing data
        await Faculty.deleteMany({});
        await Publication.deleteMany({});
        await Department.deleteMany({});
        await Project.deleteMany({});
        
        console.log('Cleared existing data...');
        
        // Insert departments
        await Department.insertMany(departments);
        console.log('Inserted departments...');
        
        // Generate and insert faculty
        const faculties = generateFaculty();
        await Faculty.insertMany(faculties);
        console.log('Inserted faculty data...');
        
        // Generate and insert publications
        const publications = generatePublications(faculties);
        await Publication.insertMany(publications);
        console.log('Inserted publications data...');
        
        // Generate and insert projects
        const projects = generateProjects(faculties);
        await Project.insertMany(projects);
        console.log('Inserted projects data...');
        
        console.log('\n==========================================');
        console.log('Database Seeded Successfully!');
        console.log('==========================================');
        console.log(`Total Faculty: ${faculties.length}`);
        console.log(`Total Publications: ${publications.length}`);
        console.log(`Total Departments: ${departments.length}`);
        console.log(`Total Projects: ${projects.length}`);
        console.log('==========================================\n');
        
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
