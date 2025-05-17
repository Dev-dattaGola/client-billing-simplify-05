
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Letter } from '@/backend/billing-api';
import { billingApi } from '@/backend';
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Edit, Mail, Plus, Reply } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const LettersManagement: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [letterType, setLetterType] = useState<'demand' | 'settlement' | 'lien_reduction'>('demand');
  const [recipientId, setRecipientId] = useState('');
  const [caseId, setCaseId] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchLetters = async () => {
      setIsLoading(true);
      try {
        const fetchedLetters = await billingApi.getLetters();
        setLetters(fetchedLetters);
      } catch (error) {
        console.error('Error fetching letters:', error);
        toast({
          title: "Error",
          description: "Failed to load letters. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetters();
  }, [toast]);

  const resetForm = () => {
    setLetterType('demand');
    setRecipientId('');
    setCaseId('');
    setContent('');
  };

  const handleCreateLetter = async () => {
    if (!letterType || !recipientId || !caseId || !content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newLetter = await billingApi.createLetter({
        type: letterType,
        recipientId,
        caseId,
        content,
        status: 'draft'
      });
      
      setLetters(prev => [...prev, newLetter]);
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Letter created successfully.",
      });
    } catch (error) {
      console.error('Error creating letter:', error);
      toast({
        title: "Error",
        description: "Failed to create letter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendLetter = async (id: string) => {
    try {
      const updatedLetter = await billingApi.sendLetter(id);
      if (updatedLetter) {
        setLetters(prev => prev.map(letter => letter.id === id ? updatedLetter : letter));
        toast({
          title: "Success",
          description: "Letter has been sent.",
        });
      }
    } catch (error) {
      console.error('Error sending letter:', error);
      toast({
        title: "Error",
        description: "Failed to send letter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkLetterAsResponded = async (id: string) => {
    try {
      const updatedLetter = await billingApi.markLetterAsResponded(id);
      if (updatedLetter) {
        setLetters(prev => prev.map(letter => letter.id === id ? updatedLetter : letter));
        toast({
          title: "Success",
          description: "Letter marked as responded.",
        });
      }
    } catch (error) {
      console.error('Error updating letter status:', error);
      toast({
        title: "Error",
        description: "Failed to update letter status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock recipients and cases for demo
  const mockRecipients = [
    { id: 'insurance1', name: 'ABC Insurance Company' },
    { id: 'insurance2', name: 'XYZ Insurance Group' },
    { id: 'hospital1', name: 'City General Hospital' },
    { id: 'doctor1', name: 'Dr. Smith Medical Group' },
  ];

  const mockCases = [
    { id: 'case1', name: 'Personal Injury - Car Accident' },
    { id: 'case2', name: 'Medical Malpractice Claim' },
    { id: 'case3', name: 'Workers Compensation Claim' },
  ];

  // Get template content based on letter type
  const getTemplateContent = (type: 'demand' | 'settlement' | 'lien_reduction', caseId: string) => {
    const caseDetails = mockCases.find(c => c.id === caseId)?.name || '';
    
    if (type === 'demand') {
      return `RE: Demand Letter - ${caseDetails}\n\nDear Sir/Madam,\n\nThis letter constitutes a formal demand for compensation regarding the above-referenced matter. Our client has suffered damages in the amount of $X and we request your prompt attention to this matter.\n\nPlease contact our office within 30 days to discuss settlement options.\n\nSincerely,\nLaw EMR Firm`;
    } else if (type === 'settlement') {
      return `RE: Settlement Agreement - ${caseDetails}\n\nDear Sir/Madam,\n\nThis letter confirms our settlement agreement regarding the above-referenced matter. The agreed settlement amount is $X to be paid within 30 days of the execution of this agreement.\n\nPlease sign and return the enclosed agreement.\n\nSincerely,\nLaw EMR Firm`;
    } else {
      return `RE: Medical Lien Reduction Request - ${caseDetails}\n\nDear Sir/Madam,\n\nWe are writing to request a reduction of the medical lien in the amount of $X for our client. Due to the limited settlement funds and extensive injuries, we respectfully request a reduction to $Y.\n\nPlease contact our office to discuss this matter further.\n\nSincerely,\nLaw EMR Firm`;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Letters Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl glass-card backdrop-blur-lg border border-white/20 bg-white/5 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Letter</DialogTitle>
              <DialogDescription className="text-white/70">
                Draft a new letter for a client case
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="letterType">Letter Type</Label>
                <Select value={letterType} onValueChange={(value: 'demand' | 'settlement' | 'lien_reduction') => {
                  setLetterType(value);
                  if (caseId) {
                    setContent(getTemplateContent(value, caseId));
                  }
                }}>
                  <SelectTrigger id="letterType">
                    <SelectValue placeholder="Select letter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demand">Demand Letter</SelectItem>
                    <SelectItem value="settlement">Settlement Agreement</SelectItem>
                    <SelectItem value="lien_reduction">Lien Reduction Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Select value={recipientId} onValueChange={setRecipientId}>
                  <SelectTrigger id="recipient">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRecipients.map(recipient => (
                      <SelectItem key={recipient.id} value={recipient.id}>{recipient.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="case">Case</Label>
                <Select value={caseId} onValueChange={(value) => {
                  setCaseId(value);
                  if (letterType) {
                    setContent(getTemplateContent(letterType, value));
                  }
                }}>
                  <SelectTrigger id="case">
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCases.map(caseItem => (
                      <SelectItem key={caseItem.id} value={caseItem.id}>{caseItem.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Letter Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the content of your letter here..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}>Cancel</Button>
              <Button onClick={handleCreateLetter}>
                Create Letter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-white/20 rounded-md bg-transparent backdrop-blur-sm">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[250px] bg-white/10" />
                <Skeleton className="h-4 w-[400px] bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Recipient</TableHead>
                  <TableHead className="text-white">Case</TableHead>
                  <TableHead className="text-white">Date Created</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {letters.length === 0 ? (
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableCell colSpan={7} className="text-center text-white/70">
                      No letters found. Create a new letter to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  letters.map(letter => (
                    <TableRow key={letter.id} className="border-white/10 hover:bg-white/10">
                      <TableCell className="font-medium text-white">L-{letter.id.slice(0, 6).toUpperCase()}</TableCell>
                      <TableCell>
                        <Badge className={
                          letter.type === 'demand' ? 'bg-blue-500/30 text-blue-200 hover:bg-blue-500/40 border border-blue-400/30' :
                          letter.type === 'settlement' ? 'bg-green-500/30 text-green-200 hover:bg-green-500/40 border border-green-400/30' :
                          'bg-purple-500/30 text-purple-200 hover:bg-purple-500/40 border border-purple-400/30'
                        }>
                          {letter.type.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        {mockRecipients.find(r => r.id === letter.recipientId)?.name || letter.recipientId}
                      </TableCell>
                      <TableCell className="text-white">
                        {mockCases.find(c => c.id === letter.caseId)?.name || letter.caseId}
                      </TableCell>
                      <TableCell className="text-white">{new Date(letter.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          letter.status === 'sent' ? 'bg-amber-500/30 text-amber-200 hover:bg-amber-500/40 border border-amber-400/30' :
                          letter.status === 'responded' ? 'bg-green-500/30 text-green-200 hover:bg-green-500/40 border border-green-400/30' :
                          'bg-gray-500/30 text-gray-200 hover:bg-gray-500/40 border border-gray-400/30'
                        }>
                          {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Download className="h-4 w-4" />
                          </Button>
                          {letter.status === 'draft' && (
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => handleSendLetter(letter.id)}>
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          {letter.status === 'sent' && (
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => handleMarkLetterAsResponded(letter.id)}>
                              <Reply className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default LettersManagement;
