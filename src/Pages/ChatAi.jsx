import { useEffect, useRef, useState } from "react";
import { FiCpu, FiSend, FiUser } from "react-icons/fi";
import "../CSS/ChatAi.css";
import Navbar from "../Components/Navbar";

function ChatAi() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! How can I help you today?",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const conversationEndRef = useRef(null);

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || loading) {
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login first");
            return;
        }

        setMessages((currentMessages) => [
            ...currentMessages,
            { id: crypto.randomUUID(), role: "user", content: trimmedMessage },
        ]);
        setMessage("");
        setLoading(true);
        setError("");

        try {
            const apiResponse = await fetch(
                "http://localhost:5000/api/ai/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        message: trimmedMessage,
                    }),
                }
            );

            const data = await apiResponse.json();

            if (!apiResponse.ok) {
                setError(
                    data.message ||
                    "Failed to get AI response"
                );
                return;
            }

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: data.response || "",
                },
            ]);

        } catch (requestError) {
            console.error(
                "Chat AI error:",
                requestError
            );

            setError(
                "Unable to connect to AI service"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ChatAiPage">
            <Navbar />

            <main className="ChatLayout">
                <header className="ChatHeader">
                    <div className="ChatHeaderIcon"><FiCpu /></div>
                    <div>
                        <h1>Career Pilot</h1>
                        <span>AI assistant</span>
                    </div>
                </header>

                <section className="ChatHistory" aria-label="Conversation" aria-live="polite">
                    {messages.map((item) => (
                        <article className={`ChatMessage ChatMessage--${item.role}`} key={item.id}>
                            {item.role === "assistant" && (
                                <span className="ChatAvatar ChatAvatar--assistant" aria-hidden="true"><FiCpu /></span>
                            )}
                            <div className="ChatMessageBody">
                                <span className="ChatMessageLabel">{item.role === "assistant" ? "Career Pilot" : "You"}</span>
                                <p>{item.content}</p>
                            </div>
                            {item.role === "user" && (
                                <span className="ChatAvatar ChatAvatar--user" aria-hidden="true"><FiUser /></span>
                            )}
                        </article>
                    ))}
                    {loading && (
                        <div className="ChatMessage ChatMessage--assistant" role="status" aria-label="Career Pilot is thinking">
                            <span className="ChatAvatar ChatAvatar--assistant" aria-hidden="true"><FiCpu /></span>
                            <div className="ChatMessageBody">
                                <span className="ChatMessageLabel">Career Pilot</span>
                                <div className="ChatTyping"><i /><i /><i /></div>
                            </div>
                        </div>
                    )}
                    <div ref={conversationEndRef} />
                </section>

                {error && <p className="ChatAiError" role="alert">{error}</p>}

                <form
                    className="ChatComposer"
                    onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage();
                    }}
                >
                    <textarea
                        aria-label="Message Career Pilot"
                        placeholder="Message Career Pilot..."
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                sendMessage();
                            }
                        }}
                        rows={1}
                        disabled={loading}
                    />
                    <button type="submit" aria-label="Send message" title="Send message" disabled={loading || !message.trim()}>
                        <FiSend />
                    </button>
                </form>
                <p className="ChatDisclaimer">AI responses can be inaccurate. Verify important information.</p>
            </main>
        </div>
    );
}

export default ChatAi;