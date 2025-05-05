import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './Home.css';
import './Profile.js';

const socket = io('http://localhost:5000');

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setcontent] = useState('');
  const messagesEndRef = useRef(null);  // Step 2: Create ref

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  useEffect(() => {
    if (user?._id) {
      socket.emit('register', user._id);
      console.log(" Registered with socket:", user._id);
    }
  }, [user]);

  useEffect(() => {
    axios.get('http://localhost:5000/users').then(res => {
      setFriends(res.data);
    });
  }, []);

  useEffect(() => {
    if (user && selectedFriend) {
      axios.get(`http://localhost:5000/messages/${user._id}/${selectedFriend._id}`)
        .then(res => setMessages(res.data))
        .catch(err => console.log(err));
    }
  }, [selectedFriend]);

  useEffect(() => {
    if (!user) return;

    const handleNewMessage = (msg) => {
      const isCurrentChat =
        selectedFriend &&
        ((msg.sender === user._id && msg.receiver === selectedFriend._id) ||
        (msg.sender === selectedFriend._id && msg.receiver === user._id));

      if (isCurrentChat) {
        setMessages((prev) => [...prev, msg]);
      } else {
        console.log("New message from another user:", msg);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [selectedFriend, user]);

  const fetchMessages = async (friend) => {
    setSelectedFriend(friend);
    setMessages([]);  // Clear old messages first

    try {
      const res = await axios.get(`http://localhost:5000/messages/${user._id}/${friend._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!content) return;

    const newMsg = {
      sender: user._id,
      receiver: selectedFriend._id,
      content,
      timestamp: new Date(),
      status: 'sent'
    };

    try {
      await axios.post('http://localhost:5000/message', {
        sender: user._id,
        receiver: selectedFriend._id,
        content,
      });

      setMessages(prev => [...prev, newMsg]);
      
      socket.emit('send-message', {
        sender: user._id,
        receiver: selectedFriend._id,
        content,
      });

      setcontent('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile'); 
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);  // Whenever messages change, call scrollToBottom()

  if (!user) return <div>Loading...</div>;

  return (
    <div className="chat-app">
      <div className="sidebar">
        <h1>Telegram</h1>
        <div className="sidebar-header">
          <div className="profile">
            <img src={user.profileImage || '/default-profile.png'} alt="Profile" className="profile-img" />
            <h2>{user.name}</h2>
            <button onClick={handleProfileClick} className="profile-btn">Profile</button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        <div className="friend-list">
          {friends.filter(f => f._id !== user._id).map(friend => (
            <div
              key={friend._id}
              className="friend"
              onClick={() => fetchMessages(friend)}
            >
              {friend.name}
            </div>
          ))}
        </div>
      </div>

      <div className="chatbox">
        {selectedFriend ? (
          <>
            <div className="chat-header">
              <h2> {selectedFriend.name}</h2>
            </div>
            <div className="messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={msg.sender === user._id ? 'message me' : 'message friend'}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />  {/* This is the scroll target */}
            </div>
            <div className="input-area">
              <input
                value={content}
                onChange={(e) => setcontent(e.target.value)}
                placeholder="Type message"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">Select a friend to start chatting!</div>
        )}
      </div>
    </div>
  );
}

export default Home;
