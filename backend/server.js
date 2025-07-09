const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const authenticateToken = require('./authMiddleware');
const user = require('./models/model');
const Note = require('./models/noteSchema'); // Import the Note model
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

require('dotenv').config();
app.use(cors({
    origin: 'https://notepractice1-2.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

✅ Handle preflight requests
app.options('/*', cors({
    origin: 'https://notepractice1-2.onrender.com',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.mongo_uri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error: ", err));

app.get("/api", (req, res) => {
    res.send("hello world")
})

// app.post('/submit', (req, res) => {
//     const temp = req.body;
//     console.log('Form Submission:', temp);

//     bcrypt.genSalt(10, (err, salt) => {
//         if (err) {
//             console.error("Error generating salt:", err);
//             return res.status(500).json({ error: 'Internal server error' });
//         }

//         bcrypt.hash(temp.password, salt, async (err, hash) => {
//             if (err) {
//                 console.error("Error hashing password:", err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }

//             temp.password = hash;

//             try {
//                 await user.create(temp);
//                 console.log("User created successfully");

//                 // ✅ Token and cookie setup moved **inside**
//                 const token = jwt.sign({ email: temp.email }, "secret");
//                 console.log("Token generated:", token);

//                 res.cookie("token", token, {
//                     httpOnly: true,
//                     secure: false, // true if using HTTPS
//                     sameSite: 'Lax',
//                 });

//                 return res.json({ message: 'Form submitted successfully', data: temp });
//             } catch (err) {
//                 console.error("Error creating user:", err);
//                 return res.status(500).json({ error: 'User creation failed' });
//             }
//         });
//     });
// });



// This route checks if a user is authenticated

app.get('/verify', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'User is authenticated', user: req.user });
});


app.post('/submit', (req, res) => {
    const temp = req.body;
    // console.log('Form Submission:', temp);
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error("Error generating salt:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        bcrypt.hash(temp.password, salt, async (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            temp.password = await hash;
            try {
                await user.create(temp);
                const token = jwt.sign({ email: temp.email }, process.env.secret);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                });
                console.log("User created successfully");
                return res.status(200).json({ message: 'User created successfully. Redirecting to login.' });
            } catch (err) {
                return res.status(500).json({ error: 'User creation failed' });
            }
          
        })
    })
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let temp = await user.findOne({ email: email });
    if (!temp) {
        console.log("User not found");
    } else {
        console.log("User found:");
    }
    bcrypt.compare(password, temp.password, (err, result) => {
        if (result) {
            const token = jwt.sign(
                { id: temp._id, email: temp.email },
                process.env.secret
            );

            //console.log("Token generated:", token);
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, // true in production with HTTPS
                sameSite: 'None',
            });

            return res.status(200).json({ message: 'Login successful' });


        } else {
            console.log("Invalid credentials");
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    })
})

app.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
});

app.post('/create-note', authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const note = await Note.create({
            title,
            content,
            userId: req.user.id
        });

        res.status(201).json({ message: 'Note created', note });
    } catch (err) {
        res.status(500).json({ message: 'Error creating note' });
    }
});

app.get('/get-notes', authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id });
        res.status(200).json({ notes });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

app.delete('/delete-note/:id', authenticateToken, async (req, res) => {
    const noteId = req.params.id;
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        } else if (!note.userId.equals(req.user.id)) {
            return res.status(403).json({ message: 'Unauthorized' });
        } else {
            await Note.findByIdAndDelete(noteId);
            return res.status(200).json({ message: 'Note deleted successfully' });
        }
    } catch (err) {
        console.error('Error deleting note:', err);
        return res.status(500).json({ message: 'Error deleting note' });
    }
})

app.put('/edit-note/:id', authenticateToken, async (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    note.title = title;
    note.content = content;
    await note.save();

    return res.status(200).json({ message: 'Note updated successfully', note });
  } catch (err) {
    console.error('Error editing note:', err);
    return res.status(500).json({ message: 'Error editing note' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
