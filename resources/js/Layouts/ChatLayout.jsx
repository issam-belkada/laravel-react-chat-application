import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useEffect } from "react";
import Echo from "laravel-echo";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;

    console.log("Conversations:", conversations);
    console.log("Selected Conversation:", selectedConversation);

    useEffect(() => { 
        window.Echo.join('online')
            .here((users) => {
                console.log('Online users:', users);
            })
            .joining((user) => {
                console.log('User joined:', user);
            })
            .leaving((user) => {
                console.log('User left:', user);
            });
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