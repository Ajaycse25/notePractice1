import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
const [editNoteId, setEditNoteId] = useState(null);
const [editTitle, setEditTitle] = useState('');
const [editContent, setEditContent] = useState('');

const handleEditClick = (note) => {
  setIsEditing(true);
  setEditNoteId(note._id);
  setEditTitle(note.title);
  setEditContent(note.content);
};

const handleUpdateNote = async (e) => {
  e.preventDefault();

  try {
    await axios.put(`https://notepractice1-1.onrender.com/edit-note/${editNoteId}`, {
      title: editTitle,
      content: editContent
    }, {
      withCredentials: true
    });

    setIsEditing(false);
    setEditNoteId(null);
    setEditTitle('');
    setEditContent('');

    // Refresh notes
    const res = await axios.get('https://notepractice1-1.onrender.com/get-notes', { withCredentials: true });
    setNotes(res.data.notes);
  } catch (error) {
    console.error('Error updating note:', error);
  }
};


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://notepractice1-1.onrender.com/verify', { withCredentials: true });
        setUser(response.data.user.username);
        setEmail(response.data.user.email);

        const fetchNotes = async () => {
          const res = await axios.get('https://notepractice1-1.onrender.com/get-notes', { withCredentials: true });
          setNotes(res.data.notes);
        };

        fetchNotes();

      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/Login'); // Redirect to login if not authenticated
      }
    };

    fetchUser();
  }, [])

  const handleLogout = async () => {
    // Remove cookie by setting an empty one
    await axios.post('https://notepractice1-1.onrender.com/logout', {}, { withCredentials: true });
    navigate('/Login');
  };




  const handleCreateNote = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://notepractice1-1.onrender.com/create-note', { title, content }, {
        withCredentials: true
      });

      setTitle('');
      setContent('');
      // Fetch notes again after adding
      const res = await axios.get('https://notepractice1-1.onrender.com/get-notes', { withCredentials: true });
      setNotes(res.data.notes);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDelete = async (noteId) => {
   // e.preventDefault();
   // const noteId = e.target.parentElement.getAttribute('data-id'); // Get the note
    try {
      await axios.delete(`https://notepractice1-1.onrender.com/delete-note/${noteId}`, { withCredentials: true });
      // Remove the deleted note from state
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }


  return (
    <div className='bg-gray-600  '>
      <div>
        <h1 className='bg-gray-500 p-2 m-3 mt-4 rounded-md'>Welcome to Home!  {user} with email id : {email} </h1>
        <button onClick={handleLogout} className='bg-blue-700 px-3 m-3 rounded-md text-white active:scale-90'>Logout</button>
      </div>

      <div className=' p-3 m-3 mt-4 rounded-md bg-gray-500'>
        <h2>Create your notes</h2>
        <br />
        <form onSubmit={handleCreateNote}>
          <input
            type="text"
            placeholder="Title"
            className="p-2 m-2 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          /> <br />
          <textarea
            placeholder="Content"
            className="p-2 m-2 rounded-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea> <br />
          <button type="submit" className="bg-blue-700 px-3 m-3 rounded-md text-white active:scale-90">
            Create Note
          </button>
        </form>

      </div>

{isEditing && (
  <div className='p-3 m-3 rounded-md bg-yellow-100'>
    <h2>Edit Note</h2>
    <form onSubmit={handleUpdateNote}>
      <input
        type="text"
        placeholder="Title"
        className="p-2 m-2 rounded-md"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Content"
        className="p-2 m-2 rounded-md"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
      ></textarea>
      <br />
      <button type="submit" className="bg-green-700 px-3 m-3 rounded-md text-white active:scale-90">
        Update Note
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="bg-red-700 px-3 m-3 rounded-md text-white active:scale-90"
      >
        Cancel
      </button>
    </form>
  </div>
)}

<h2 className='bg-gray-500 rounded-md text-xl w-1/11 ml-3 pl-2 pr-2'>Your Notes</h2>
      <div className=" flex gap-3 p-3 m-3 mt-4 rounded-md bg-gray-500">
        
        {notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-gray-400 my-2 p-3 rounded-md">
              <h3 className="font-semibold">{note.title}</h3>
              <p>{note.content}</p>
              <p className="text-xs text-gray-200 mt-1">Created: {new Date(note.createdAt).toLocaleString()}</p>
              <button onClick={() => handleDelete(note._id)} className='bg-gray-500 rounded-md text-sm px-1 active:scale-90'>Delete</button>
              <button onClick={() => handleEditClick(note)} className='bg-gray-500 ml-5 rounded-md text-sm px-1 active:scale-90'>Edit</button>
            </div>
          ))
        )}
      </div>


    </div>
  );
}

export default Home;
