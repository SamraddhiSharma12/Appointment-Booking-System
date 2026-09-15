// One-time script to seed the database with the 15 doctors used in the
// frontend's mock data (assets.js), so the booking pages work immediately
// after connecting the real backend.
//
// Run with:  node seed/seedDoctors.js
import "dotenv/config";
import bcrypt from "bcrypt";
import connectDB from "../config/mongodb.js";
import doctorModel from "../models/doctorModel.js";

const baseImageUrl = "http://localhost:5173/src/assets/pictures/assets_frontend";

const doctors = [
  { name: "Dr. Richard James", speciality: "Gastroenterologist", experience: "4 Years", fees: 50, image: `${baseImageUrl}/doc1.png` },
  { name: "Dr. Emily Larson", speciality: "Gynecologist", experience: "3 Years", fees: 60, image: `${baseImageUrl}/doc2.png` },
  { name: "Dr. Sarah Patel", speciality: "Dermatologist", experience: "1 Years", fees: 30, image: `${baseImageUrl}/doc3.png` },
  { name: "Dr. Christopher Lee", speciality: "Pediatricians", experience: "2 Years", fees: 40, image: `${baseImageUrl}/doc4.png` },
  { name: "Dr. Jennifer Garcia", speciality: "Neurologist", experience: "4 Years", fees: 50, image: `${baseImageUrl}/doc5.png` },
  { name: "Dr. Andrew Williams", speciality: "Neurologist", experience: "4 Years", fees: 50, image: `${baseImageUrl}/doc6.png` },
  { name: "Dr. Christopher Davis", speciality: "General physician", experience: "4 Years", fees: 50, image: `${baseImageUrl}/doc7.png` },
  { name: "Dr. Timothy White", speciality: "Gynecologist", experience: "3 Years", fees: 60, image: `${baseImageUrl}/doc8.png` },
  { name: "Dr. Ava Mitchell", speciality: "Dermatologist", experience: "1 Years", fees: 30, image: `${baseImageUrl}/doc9.png` },
  { name: "Dr. Jeffrey King", speciality: "Pediatricians", experience: "2 Years", fees: 40, image: `${baseImageUrl}/doc10.png` },
  { name: "Dr. Zoe Kelly", speciality: "Neurologist", experience: "4 Years", fees: 50, image: `${baseImageUrl}/doc11.png` },
  { name: "Dr. Patrick Harris", speciality: "Neurologist", experience: "4 Years", fees: 50, image: `${baseImageUrl}/doc12.png` },
  { name: "Dr. Chloe Evans", speciality: "General physician", experience: "4 Years", fees: 50, image: `${baseImageUrl}/doc13.png` },
  { name: "Dr. Ryan Martinez", speciality: "Gynecologist", experience: "3 Years", fees: 60, image: `${baseImageUrl}/doc14.png` },
  { name: "Dr. Amelia Hill", speciality: "Dermatologist", experience: "1 Years", fees: 30, image: `${baseImageUrl}/doc15.png` },
];
const about =
  "Dr. has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.";


const seed = async () => {
  try {
    await connectDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("doctor123", salt);

    for (let i = 0; i < doctors.length; i++) {
      const d = doctors[i];
      const email = `doctor${i + 1}@prescripto.com`;

      const exists = await doctorModel.findOne({ email });
      if (exists) {
        console.log(`Skipping (already exists): ${d.name}`);
        continue;
      }

      await doctorModel.create({
        name: d.name,
        email,
        password: hashedPassword,
        image: d.image,
        speciality: d.speciality,
        degree: "MBBS",
        experience: d.experience,
        about,
        fees: d.fees,
        address: {
          line1: "17th Cross, Richmond",
          line2: "Circle, Ring Road, London",
        },
        date: Date.now(),
        slots_booked: {},
      });

      console.log(`Added: ${d.name} (login: ${email} / doctor123)`);
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
