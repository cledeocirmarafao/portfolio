import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import chatbotAvatar from "../assets/bot.webp";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
}

interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

export const ChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: "welcome", text: t("chatbot.welcome"), sender: "bot" }]);
    setShowQuickReplies(true);
    setHistory([]);
  }, [t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickReplies = [
    t("chatbot.quick_skills"),
    t("chatbot.quick_projects"),
    t("chatbot.quick_location"),
    t("chatbot.quick_cv"),
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowQuickReplies(false);
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const replyText = data.reply ?? t("chatbot.reply_default");

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMsg]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: replyText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: t("chatbot.reply_default"),
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
            whileTap={{ scale: 0.9 }}
            aria-label={t("chatbot.open_chat")}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-cyber-gradient opacity-40 blur-lg group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cyber-gradient flex items-center justify-center shadow-lg pulse-glow overflow-hidden">
                <img
                  src={chatbotAvatar}
                  alt={t("chatbot.title")}
                  className="w-10 h-10 sm:w-14 sm:h-14 object-cover object-top rounded-full"
                />
              </div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan" />
              </motion.div>
            </motion.div>
            <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg glass text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {t("chatbot.tooltip")}
              <div className="absolute top-full right-5 w-2 h-2 rotate-45 glass -mt-1" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-90 max-w-[calc(100vw-2rem)] h-130 max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "hsl(240 25% 8% / 0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid hsl(185 100% 50% / 0.15)",
              boxShadow:
                "0 0 30px hsl(185 100% 50% / 0.1), 0 20px 60px hsl(0 0% 0% / 0.5)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-cyber-gradient opacity-60" />
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyber-gradient flex items-center justify-center overflow-hidden">
                  <img
                    src={chatbotAvatar}
                    alt={t("chatbot.title")}
                    className="w-7 h-7 object-cover object-top rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {t("chatbot.title")}
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {t("chatbot.online")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-cyber-gradient flex items-center justify-center mr-2 mt-1 shrink-0 overflow-hidden">
                      <img
                        src={chatbotAvatar}
                        alt="IA"
                        className="w-5 h-5 object-cover object-top rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${msg.sender === "user" ? "bg-primary/20 text-foreground border border-primary/30" : "bg-muted/50 text-foreground border border-border/30"}`}
                  >
                    {msg.sender === "bot" ? (
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 underline hover:text-cyan-300"
                            >
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong className="text-foreground font-semibold">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 my-1">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="text-sm">{children}</li>
                          ),
                          h3: ({ children }) => (
                            <h3 className="font-bold text-primary text-sm mt-2 mb-1">
                              {children}
                            </h3>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-cyber-gradient flex items-center justify-center mr-2 mt-1 shrink-0 overflow-hidden">
                    <img
                      src={chatbotAvatar}
                      alt="IA"
                      className="w-5 h-5 object-cover object-top rounded-full"
                    />
                  </div>
                  <div className="bg-muted/50 border border-border/30 px-3 py-2 rounded-xl flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              {showQuickReplies && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {quickReplies.map((text) => (
                    <button
                      key={text}
                      onClick={() => sendMessage(text)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all duration-200"
                    >
                      {text}
                    </button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-3 py-3 border-t border-border/40 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-cyber-gradient flex items-center justify-center shrink-0 opacity-60 overflow-hidden">
                <img
                  src={chatbotAvatar}
                  alt="IA"
                  className="w-5 h-5 object-cover object-top rounded-full"
                />
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatbot.placeholder")}
                disabled={isLoading}
                className="flex-1 bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-cyber-gradient hover:opacity-90 w-8 h-8 rounded-lg shrink-0 disabled:opacity-30"
              >
                <Send className="w-4 h-4 text-primary-foreground" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
