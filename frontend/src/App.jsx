import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const App = () => {
  const [notes, setnotes] = useState([]);
  const [modalOpen, setmodalOpen] = useState(false)
  const [selectedNote, setselectedNote] = useState(null)

  function fetchNotes(){
     axios.get(`https://backend-crud-notes-app.onrender.com/api/getNotes`)
  .then((rawdata)=>{
    console.log(rawdata.data.notes);
    setnotes(rawdata.data.notes);
  })
  }
  useEffect(() => {
   fetchNotes()
  }, [])
  
  function submitHandler(e){
    e.preventDefault();
    const{title,description} = e.target.elements;
    console.log(title.value,description.value);
    axios.post("https://backend-crud-notes-app.onrender.com/api/sendNotes",{
      title:title.value,
      description:description.value
    })
    .then((res)=>{
      console.log(res.data);
      fetchNotes()
      title.value = "";
      description.value = "";
    })
    
  }

  function deleteHandler(noteId){
    console.log(noteId)
    axios.delete("https://backend-crud-notes-app.onrender.com/api/deleteNote/"+noteId)
    .then((res)=>{
      console.log(res.data)
      fetchNotes()
    })
  }

  function updateHandler(note){
    setselectedNote(note)
    setmodalOpen(true)
  }




  
  return (
    <div>
    {
      modalOpen ? (
        selectedNote ? (
          <div  className="modal-backdrop" >
        <div className="modal">
          <form onSubmit={(e)=>{
            e.preventDefault();
            axios.patch("https://backend-crud-notes-app.onrender.com/api/updateNotes/"+selectedNote._id,{
              description: e.target.description.value
            })
            .then(()=>{
              setmodalOpen(false);
                  setselectedNote(null);
                  fetchNotes();
            })
          }}>
            <textarea name="description" defaultValue={selectedNote.description}></textarea>
            <button>Save Changes</button>
            <button onClick={()=>{
              setmodalOpen(false)
              setselectedNote(null)
            }}>Cancel</button>
          </form>
        </div>
      </div>
        ) : null
      ) : null
    }
      
      <form onSubmit={submitHandler} className='note-form'>
        <input type="text" name='title' placeholder='Enter Note Title'/>
        <input type="text" name='description' placeholder='Enter Note Description' />
        <button>Create Note</button>
      </form>
      <div className="notes">
        {
          notes.map((note)=>{
            return <div className="note">
          <h1>{note.title}</h1>
          <h2>{note.description}</h2>
          <button onClick={()=>deleteHandler(note._id)}>delete</button>
          <button onClick={()=>updateHandler(note)}>Update</button>
        </div>
          })
        }
        
      </div>
    </div>
  )
}

export default App