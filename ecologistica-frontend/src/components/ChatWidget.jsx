import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [mensajes, setMensajes] = useState([
        { id: 1, autor: 'agente', texto: '¡Hola! Soy el asistente virtual de EcoLogística. ¿En qué puedo ayudarte hoy con tus envíos o auditorías?' }
    ]);
    const [input, setInput] = useState('');
    const [estaCargando, setEstaCargando] = useState(false);
    
    const chatEndRef = useRef(null);

    // Auto-scroll al último mensaje enviado o recibido
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes, isOpen]);

    const manejarEnvio = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // 1. Agregar el mensaje del usuario a la pantalla
        const mensajeUsuario = { id: Date.now(), autor: 'usuario', texto: input };
        setMensajes((prev) => [...prev, mensajeUsuario]);
        
        const textoEnviado = input;
        setInput('');
        setEstaCargando(true);

        try {
        // 2. Realizar la petición HTTP POST a tu servidor local
        const respuestaServidor = await fetch('https://agente-ia-ecologistica-ia.vercel.app/api/chat', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mensaje: textoEnviado }),
        });

        const data = await respuestaServidor.json();

        if (respuestaServidor.ok) {
            // 3. Si todo sale bien, agregar la respuesta de la IA al chat
            setMensajes((prev) => [
            ...prev,
            { id: Date.now() + 1, autor: 'agente', texto: data.respuesta }
            ]);
        } else {
            throw new Error(data.error || 'Error en el servidor');
        }
        } catch (error) {
        console.error("Error al conectar con el agente:", error);
        setMensajes((prev) => [
            ...prev,
            { id: Date.now() + 1, autor: 'agente', texto: 'Lo siento, tuve problemas para conectarme con mi servidor. Por favor, verifica tu conexión o saldo de la API Key.' }
        ]);
        } finally {
        setEstaCargando(false);
        }
    };

    return (
        <div className="chat-widget-container">
        {/* Botón flotante para abrir/cerrar */}
        <button className={`chat-trigger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>

        {/* Ventana de Chat */}
        {isOpen && (
            <div className="chat-window">
            <div className="chat-header">
                <div className="chat-header-info">
                <div className="avatar-status">
                    <Bot size={20} />
                    <span className="status-dot"></span>
                </div>
                <div>
                    <h3>Asistente EcoLogística</h3>
                    <p>En línea</p>
                </div>
                </div>
            </div>

            <div className="chat-messages">
                {mensajes.map((m) => (
                <div key={m.id} className={`message-row ${m.autor}`}>
                    <div className="message-avatar">
                    {m.autor === 'agente' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className="message-bubble">
                    <p>{m.texto}</p>
                    </div>
                </div>
                ))}
                
                {estaCargando && (
                <div className="message-row agente">
                    <div className="message-avatar"><Bot size={16} /></div>
                    <div className="message-bubble loading-bubble">
                    <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                    </div>
                </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={manejarEnvio}>
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                disabled={estaCargando}
                />
                <button type="submit" disabled={!input.trim() || estaCargando}>
                <Send size={18} />
                </button>
            </form>
            </div>
        )}
        </div>
    );
}