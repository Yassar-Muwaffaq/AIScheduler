import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import axios from "axios";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Halo! Aku sudah siap bantu menyusun jadwalmu.\nKirimkan apa saja yang ingin kamu atur."
    }
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const API_URL = "http://localhost:5000/assistant"; // backend kamu

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMsg]);

    const prompt = input;
    setInput("");

    try {
      const res = await axios.post(API_URL, { prompt });

      const reply = res.data.reply || "Baik, catat.";

      const newAiMsg = { sender: "ai", text: reply };
      setMessages((prev) => [...prev, newAiMsg]);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error menghubungi server." }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 flex flex-col">

      {/* ===================== */}
      {/*     CHAT CONTAINER    */}
      {/* ===================== */}
      <div className="flex-1 overflow-y-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto w-full space-y-4 pb-32">

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-line leading-relaxed
                  ${
                    msg.sender === "ai"
                      ? "bg-gray-800 text-gray-100 rounded-bl-none"
                      : "bg-blue-600 text-white rounded-br-none"
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* ===================== */}
      {/*     INPUT BAR FIXED   */}
      {/* ===================== */}
      <div className="fixed bottom-0 left-0 right-0 px-6 md:px-16 pb-6 bg-black">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-3 bg-gray-800 border border-gray-700 px-4 py-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message"
            className="flex-1 bg-transparent outline-none text-sm text-white"
          />
          <button
            onClick={sendMessage}
            className="flex items-center gap-2 bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            <span>Send</span>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
