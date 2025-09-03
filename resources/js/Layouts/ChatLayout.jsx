import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useEffect, useState } from "react";
import Echo from "laravel-echo";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [onlineUsers, setOnlineUsers] = useState({});
    const [LocalConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const isUserOnline = (userId) => onlineUsers[userId];

    console.log("Conversations:", conversations);
    console.log("Selected Conversation:", selectedConversation);

    useEffect(() => {
        setSortedConversations(
            LocalConversations.sort((a, b) => 
            {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                }
                else if (a.blocked_at) { 
                    return 1;
                }
                else if (b.blocked_at) { 
                    return -1;
                }
                
                if (a.last_message && b.last_message) {
                    return b.last_message_date.localcompare(a.last_message_date);
                }
                else if (a.last_message) {
                    return -1;
                }
                else if (b.last_message) { 
                    return 1;
                }
                else {
                    return 0;
                }
            }
        ));
     }, [sortedConversations]);
    
    useEffect(() => { 
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        window.Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(users.map(user => [user.id, user]));
                setOnlineUsers(prev => ({ ...prev, ...onlineUsersObj }));
            })
            .joining((user) => {
                setOnlineUsers((prev) => ({ ...prev, [user.id]: user }));
            })
            .leaving((user) => {
                setOnlineUsers((prev) => {
                    const updated = { ...prev };
                    delete updated[user.id];
                    return updated;
                });
            error((error) => { console.error('Echo error:', error); } );
            
            
            });
        return () => {
            Echo.leave('online');
        };
        }, []);

    return (
        <AuthenticatedLayout>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 p-4 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Chat App</h2>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">Chats</a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">Contacts</a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">Settings</a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
            </div>
        </AuthenticatedLayout>
    );
}

export default ChatLayout;