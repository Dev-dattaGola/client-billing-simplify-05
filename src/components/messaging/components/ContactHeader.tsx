
import { Contact, getInitials, getAvatarColor } from '../utils/messageTypes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ContactHeaderProps {
  contact: Contact | null;
}

const ContactHeader: React.FC<ContactHeaderProps> = ({ contact }) => {
  if (!contact) return null;
  
  return (
    <div className="p-4 border-b border-white/20 bg-white/5 backdrop-blur-lg flex items-center">
      <Avatar className="h-10 w-10">
        <AvatarImage src={contact.avatarUrl} />
        <AvatarFallback className={getAvatarColor(contact.role)}>
          {getInitials(contact.name)}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h3 className="font-medium text-white">{contact.name}</h3>
        <p className="text-sm text-white/70">
          {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)} • {contact.email}
        </p>
      </div>
    </div>
  );
};

export default ContactHeader;
