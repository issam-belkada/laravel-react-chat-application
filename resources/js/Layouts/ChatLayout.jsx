import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";


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

    const onSearch = (ev) => { 
        const searchTerm = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter(conversation => { 
                return conversation.name.toLowerCase().includes(searchTerm);
            })
        )
    setLocalConversations(filtered);
    }

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
            window.Echo.leave('online');
        };
        }, []);

    return (
        <AuthenticatedLayout>
            <div className="flex flex-1 w-full overflow-hiden">
                <div className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""}`} >
                    <div className="flex items-center justify-between px-3 py-4 text-xl font-medium">
                        My conversations 
                        <div className="tooltip tooltip-left" data-tip="Create new Group">
                            <button className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="inline-block w-4 h-4 ml-2">

                                </PencilSquareIcon>
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Search..."
                            className="w-full"
                        >

                        </TextInput>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations && sortedConversations.map((conversation) => (
                            <ConversationItem
                                key={`${conversation.is_group 
                                    ?"group_"
                                    : "user_" }${conversation.id}`}
                                conversations={conversations}
                                SelectedConversation={selectedConversation}
                                online={!!isUserOnline(conversation.id)}>

                    </ConversationItem>
                        ))}
                    </div>
  </div>
                <div className="flex flex-col flex-1 overflow-hiden">
                    {children}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default ChatLayout;