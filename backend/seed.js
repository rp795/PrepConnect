// const mongoose = require('mongoose');
// const Job = require('./models/Job');
// require('dotenv').config();

// async function seedDatabase() {
//   try {
//     // 1. MongoDB Connect karein (Uses MONGO_URI from .env)
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB for Seeding...");
//   } catch (err) {
//     console.error("MongoDB Connection Error:", err);
//     process.exit(1);
//   }

//   // 2. Sample Jobs Data
//   const sampleJobs = [
//     {
//       title: "SSC CGL Recruitment 2026",
//       category: "SSC",
//       lastDate: "2026-05-15",
//       applyLink: "https://ssc.nic.in",
//       postedDate: new Date()
//     },
//     {
//       title: "IBPS PO Recruitment 2026",
//       category: "Banking",
//       lastDate: "2026-06-30",
//       applyLink: "https://ibps.in",
//       postedDate: new Date()
//     },
//     {
//       title: "RRB NTPC Recruitment 2026",
//       category: "Railways",
//       lastDate: "2026-07-20",
//       applyLink: "https://indianrailways.gov.in",
//       postedDate: new Date()
//     },
//     {
//       title: "UPSC Civil Services 2026",
//       category: "UPSC",
//       lastDate: "2026-08-10",
//       applyLink: "https://upsc.gov.in",
//       postedDate: new Date(),
//     },
//     {
//       title: "State PSC Recruitment 2026",
//       category: "State PSC",
//       lastDate: "2026-09-05",
//       applyLink: "https://statepsc.gov.in",  
//       postedDate: new Date(),
//     },
//   ];

//   // 3. Database Seed karein
//   try {
//     await Job.deleteMany(); 
//     await Job.insertMany(sampleJobs); 
//     console.log("Database Seeded Successfully!");
//   } catch (err) {
//     console.error("Error Seeding Database:", err);
//   }

//   // 4. Connection Close kar dein
//   mongoose.connection.close();
// }


// seedDatabase();

// const mongoose = require('mongoose');
// const Quiz = require('./models/Quiz'); // Yahan apne Quiz model ka sahi path daalna
// require('dotenv').config(); // Agar aap .env file use kar rahe hain DB URL ke liye

// // CS Fundamentals Demo Data
// const csDummyData = [
//   // --- DBMS ---
//   {
//     question: "Which Normal Form removes transitive dependencies?",
//     options: ["1NF", "2NF", "3NF", "BCNF"],
//     correct: 2 // 3NF (Index 2)
//   },
//   {
//     question: "What is the primary difference between TRUNCATE and DELETE in SQL?",
//     options: [
//       "TRUNCATE is DML, DELETE is DDL",
//       "DELETE logs individual row deletions, TRUNCATE does not",
//       "TRUNCATE can be rolled back, DELETE cannot",
//       "They are exactly the same"
//     ],
//     correct: 1
//   },
//   // --- Operating Systems ---
//   {
//     question: "What is a 'Zombie Process' in an Operating System?",
//     options: [
//       "A process that is currently executing",
//       "A process that has completed execution but still has an entry in the process table",
//       "A process waiting for I/O operations",
//       "A process that has crashed the system"
//     ],
//     correct: 1
//   },
//   {
//     question: "Which scheduling algorithm is most suitable for a time-sharing system?",
//     options: ["Shortest Job First", "First Come First Serve", "Round Robin", "Elevator Algorithm"],
//     correct: 2
//   },
//   // --- Computer Networks ---
//   {
//     question: "Which layer of the OSI model is responsible for routing?",
//     options: ["Data Link Layer", "Network Layer", "Transport Layer", "Application Layer"],
//     correct: 1
//   },
//   {
//     question: "What is the default port number for HTTPS?",
//     options: ["80", "21", "443", "22"],
//     correct: 2
//   },
//   // --- OOPS & DSA ---
//   {
//     question: "Which OOP principle hides the internal implementation details of an object?",
//     options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
//     correct: 3
//   },
//   {
//     question: "What is the worst-case time complexity of Quick Sort?",
//     options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
//     correct: 1
//   }
// ];

// // MongoDB Connection string (Apna actual URL yahan daalein)
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/prepconnect";

// const seedDatabase = async () => {
//   try {
//     // 1. Database se connect karo
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ MongoDB Connected for Seeding");

//     // 2. (Optional) 
//     await Quiz.deleteMany();
//     console.log("🧹 Cleared old quiz data");

//     // 3. Naya data push 
//     await Quiz.insertMany(csDummyData);
//     console.log("🚀 CS Fundamental Quiz data successfully pushed!");

//     // 4. Connection close 
//     mongoose.connection.close();
//     console.log("👋 Database connection closed");

//   } catch (error) {
//     console.error("❌ Error seeding database:", error);
//     process.exit(1);
//   }
// };

// // Function 
// seedDatabase();