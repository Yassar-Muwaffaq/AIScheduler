export default function Chat() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* NAVBAR */}
            <nav className="p-4 bg-black text-white border-b border-gray-700">
                Dashboard Chat
            </nav>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Contoh bubble user */}
                <div className="bg-blue-500 text-white p-3 rounded-xl w-fit ml-auto">
                    Hi bot
                </div>

                {/* Contoh bubble bot */}
                <div className="bg-gray-700 text-white p-3 rounded-xl w-fit">
                    Hello!
                </div>
            </div>

            {/* INPUT BAR */}
            <div className="p-4 bg-black flex gap-2">
                <input
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white"
                    placeholder="Type message..."
                />
                <button className="px-4 py-2 bg-blue-600 rounded-lg text-white">
                    Send
                </button>
            </div>
        </div>
    );
}
