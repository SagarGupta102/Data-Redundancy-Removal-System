
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
console.log("MONGODB_URI loaded:", Boolean(process.env.MONGODB_URI));

const Record = require("./models/Record");
const DuplicateAttempt = require("./models/DuplicateAttempt");
const InvalidAttempt = require("./models/InvalidAttempt");
const PossibleDuplicate = require("./models/PossibleDuplicate");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

function getJwtSecret() {
  if (typeof JWT_SECRET !== "string" || JWT_SECRET.length < 32) {
    console.error("JWT_SECRET must be configured with at least 32 characters.");
    return null;
  }

  return JWT_SECRET;
}

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const jwtSecret = getJwtSecret();

  if (!jwtSecret) {
    return res.status(500).json({
      message: "Authentication is not configured.",
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}

// Register a new user
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return res.status(400).json({
        message: "Name cannot be empty.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration failed:", error.message);

    return res.status(500).json({
      message: "Unable to register. Please try again.",
    });
  }
});

// Log in an existing user
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const jwtSecret = getJwtSecret();

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Authentication is not configured.",
      });
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      jwtSecret,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      message: "Unable to login. Please try again.",
    });
  }
});

async function saveInvalidAttempt(data, reason) {
  try {
    await InvalidAttempt.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      reason,
    });
  } catch (error) {
    console.error(
      "Invalid attempt tracking failed:",
      error.message
    );
  }
}

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Home route
app.get("/", (req, res) => {
  res.send("Data Redundancy Removal System Backend is running!");
});

// Create a new record
app.post("/api/records", authenticateToken, async (req, res) => {
  try {
    const { fullName, email, phone, department } = req.body;

    // Check required fields
    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !department
    ) {
  await saveInvalidAttempt(
    req.body || {},
    "All fields are required."
  );

  return res.status(400).json({
    status: "INVALID",
    message: "All fields are required.",
  });
}

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();
    const normalizedPhone = phone.trim();

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
if (!emailPattern.test(normalizedEmail)) {
  await saveInvalidAttempt(
    req.body || {},
    "Please enter a valid email address."
  );

  return res.status(400).json({
    status: "INVALID",
    message: "Please enter a valid email address.",
  });
}       

    // Validate phone number
    
if (!/^[0-9]{10}$/.test(normalizedPhone)) {
  await saveInvalidAttempt(
    req.body || {},
    "Phone number must contain exactly 10 digits."
  );

  return res.status(400).json({
    status: "INVALID",
    message: "Phone number must contain exactly 10 digits.",
  });
}

    // Check whether this email already exists
    const existingRecord = await Record.findOne({
      email: normalizedEmail,
    });

    if (existingRecord) {
  try {
    await DuplicateAttempt.create({
      fullName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      department,
      existingRecordId: existingRecord._id,
    });
  } catch (trackingError) {
    console.error(
      "Duplicate attempt tracking failed:",
      trackingError.message
    );

    return res.status(500).json({
      status: "ERROR",
      message: "Unable to record the duplicate attempt.",
    });
  }

  return res.status(409).json({
    status: "DUPLICATE",
    message: "A record with this email already exists.",
  });
    }

    
    // Check for possible duplicates using name or phone
    const possibleMatches = await Record.find({
      email: { $ne: normalizedEmail },
      $or: [
        { fullName: new RegExp(`^${normalizedName}$`, "i") },
        { phone: normalizedPhone },
      ],
    }).limit(10);

    // Save the unique record first, then flag possible matches

    // Save the unique record
    const newRecord = await Record.create({
      fullName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      department,
    });

    // Save possible duplicate matches for manual review
    if (possibleMatches.length > 0) {
      const possibleDuplicateEntries = possibleMatches
        .map((match) => {
          const matchedFields = [];

          if (
            match.fullName.toLowerCase() ===
            normalizedName.toLowerCase()
          ) {
            matchedFields.push("fullName");
          }

          if (match.phone === normalizedPhone) {
            matchedFields.push("phone");
          }

          return {
            newRecord: newRecord._id,
            existingRecord: match._id,
            matchedFields,
          };
        })
        .filter((entry) => entry.matchedFields.length > 0);

      if (possibleDuplicateEntries.length > 0) {
        await PossibleDuplicate.insertMany(possibleDuplicateEntries);
      }
    }

    return res.status(201).json({
      status: "UNIQUE",
      message: "Record saved successfully!",
      record: newRecord,
    });
  } catch (error) {
    // Handle duplicate submissions safely
    if (error.code === 11000) {
      return res.status(409).json({
        status: "DUPLICATE",
        message: "A record with this email already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "INVALID",
        message: "Record validation failed.",
      });
    }

    console.error("Record creation failed:", error.message);

    return res.status(500).json({
      status: "ERROR",
      message: "Unable to save the record. Please try again.",
    });
  }
});

// Get all saved records
app.get("/api/records", authenticateToken, async (req, res) => {
  try {
    const records = await Record.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: records.length,
      records,
    });
  } catch (error) {
    console.error("Fetching records failed:", error.message);

    res.status(500).json({
      message: "Unable to fetch records.",
    });
  }
});


app.get("/api/duplicates", authenticateToken, async (req, res) => {
  try {
    const duplicates = await DuplicateAttempt.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: duplicates.length,
      duplicates,
    });
  } catch (error) {
    console.error(
      "Fetching duplicate attempts failed:",
      error.message
    );

    res.status(500).json({
      message: "Unable to fetch duplicate attempts.",
    });
  }
});


app.get("/api/invalid-attempts", authenticateToken, async (req, res) => {
  try {
    const invalidAttempts = await InvalidAttempt.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: invalidAttempts.length,
      invalidAttempts,
    });
  } catch (error) {
    console.error(
      "Fetching invalid attempts failed:",
      error.message
    );

    res.status(500).json({
      message: "Unable to fetch invalid attempts.",
    });
  }
});

// Get possible duplicate records
app.get("/api/possible-duplicates", authenticateToken, async (req, res) => {
  try {
    const possibleDuplicates = await PossibleDuplicate.find()
      .populate("newRecord", "fullName email phone department")
      .populate("existingRecord", "fullName email phone department")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: possibleDuplicates.length,
      possibleDuplicates,
    });
  } catch (error) {
    console.error(
      "Fetching possible duplicates failed:",
      error.message
    );

    res.status(500).json({
      message: "Unable to fetch possible duplicates.",
    });
  }
});


app.get("/api/activity", authenticateToken, async (req, res) => {
  try {
    const [records, duplicates, invalidAttempts, possibleDuplicates] =
      await Promise.all([
        Record.find().sort({ createdAt: -1 }).limit(10).lean(),
        DuplicateAttempt.find().sort({ createdAt: -1 }).limit(10).lean(),
        InvalidAttempt.find().sort({ createdAt: -1 }).limit(10).lean(),
       PossibleDuplicate.find()
  .populate("newRecord", "fullName email")
  .sort({ createdAt: -1 })
  .limit(10)
  .lean(),
      ]);

    const activities = [
      ...records.map((item) => ({
        id: `record-${item._id}`,
        name: item.fullName || "Unknown",
        email: item.email || "",
        status: "Record Added",
        createdAt: item.createdAt,
      })),
      ...duplicates.map((item) => ({
        id: `duplicate-${item._id}`,
        name: item.fullName || "Unknown",
        email: item.email || "",
        status: "Duplicate Detected",
        createdAt: item.createdAt,
      })),
      ...invalidAttempts.map((item) => ({
        id: `invalid-${item._id}`,
        name: item.fullName || "Unknown",
        email: item.email || "",
        status: "Invalid Attempt",
        createdAt: item.createdAt,
      })),
      ...possibleDuplicates.map((item) => ({
  id: `possible-${item._id}`,
  name: item.newRecord?.fullName || "Unknown",
  email: item.newRecord?.email || "",
  status: "Possible Duplicate",
  createdAt: item.createdAt,
})),
    ];

    activities.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    res.status(200).json({
      count: activities.length,
      activities: activities.slice(0, 10),
    });
  } catch (error) {
    console.error("Fetching activity failed:", error.message);
    res.status(500).json({ message: "Unable to fetch activity." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});