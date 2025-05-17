
import { useState } from "react";
import { useMessaging } from './hooks/useMessaging';
import ContactsList from './components/ContactsList';
import ConversationView from './components/ConversationView';

const MessagingDashboard = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedContact,
    setSelectedContact,
    messages,
    messageAttachments,
    activeTab,
    setActiveTab,
    filteredContacts,
    sendMessage,
    handleAttachmentComplete,
    removeAttachment
  } = useMessaging();

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col lg:flex-row rounded-lg overflow-hidden border border-white/20 h-[calc(100vh-12rem)] bg-white/5 backdrop-blur-lg">
        {/* Contacts Sidebar */}
        <ContactsList 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          contacts={filteredContacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Messages Area */}
        <ConversationView
          selectedContact={selectedContact}
          messages={messages}
          messageAttachments={messageAttachments}
          onSendMessage={sendMessage}
          onAttachmentComplete={handleAttachmentComplete}
          onRemoveAttachment={removeAttachment}
        />
      </div>
    </div>
  );
};

export default MessagingDashboard;
