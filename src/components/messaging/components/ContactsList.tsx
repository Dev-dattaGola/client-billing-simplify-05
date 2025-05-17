
import { Contact, getInitials, getAvatarColor } from '../utils/messageTypes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContactsListProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  activeTab: "all" | "attorneys" | "clients";
  onTabChange: (value: "all" | "attorneys" | "clients") => void;
}

const ContactsList: React.FC<ContactsListProps> = ({
  searchQuery,
  onSearchChange,
  contacts,
  selectedContact,
  onSelectContact,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="w-full lg:w-80 border-r border-white/20 bg-white/5 backdrop-blur-lg">
      <div className="p-4 border-b border-white/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-10 bg-white/10 border-white/20 text-white"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value: any) => onTabChange(value)}>
        <TabsList className="w-full p-0 h-12 rounded-none bg-white/5">
          <TabsTrigger value="all" className="flex-1 text-white">All</TabsTrigger>
          <TabsTrigger value="attorneys" className="flex-1 text-white">Attorneys</TabsTrigger>
          <TabsTrigger value="clients" className="flex-1 text-white">Clients</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-15.5rem)]">
          <TabsContent value="all" className="m-0">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-white/70">No contacts found.</div>
            ) : (
              contacts.map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContact?.id === contact.id}
                  onClick={() => onSelectContact(contact)}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="attorneys" className="m-0">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-white/70">No attorneys found.</div>
            ) : (
              contacts.map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContact?.id === contact.id}
                  onClick={() => onSelectContact(contact)}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="clients" className="m-0">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-white/70">No clients found.</div>
            ) : (
              contacts.map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContact?.id === contact.id}
                  onClick={() => onSelectContact(contact)}
                />
              ))
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isSelected, onClick }) => {
  return (
    <div
      className={`p-4 border-b border-white/10 hover:bg-white/10 cursor-pointer flex items-center ${
        isSelected ? "bg-white/10" : ""
      }`}
      onClick={onClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={contact.avatarUrl} />
        <AvatarFallback className={getAvatarColor(contact.role)}>
          {getInitials(contact.name)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">{contact.name}</span>
          {contact.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
              {contact.unreadCount}
            </span>
          )}
        </div>
        <p className="text-sm text-white/70">
          {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default ContactsList;
