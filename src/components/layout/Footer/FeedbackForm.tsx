import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Feedback from Avolta Website');
    const body = encodeURIComponent(
      `Name: ${feedback.name}\nEmail: ${feedback.email}\n\nMessage:\n${feedback.message}`
    );
    window.location.href = `mailto:contact@avolta.be?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <h3 className="text-white text-lg font-semibold mb-4">Donnez votre avis</h3>
      <div>
        <input
          type="text"
          placeholder="Votre nom"
          value={feedback.name}
          onChange={(e) => setFeedback(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]"
          required
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Votre email"
          value={feedback.email}
          onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Votre message"
          value={feedback.message}
          onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] min-h-[100px]"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#6A0DAD] text-white py-2 px-4 rounded-md hover:bg-[#5a0b91] transition-colors flex items-center justify-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>Envoyer</span>
      </button>
    </form>
  );
}