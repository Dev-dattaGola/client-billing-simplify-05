import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PermissionProps {
  role: string;
  permissions: string[];
  onUpdatePermissions: (permissions: string[]) => void;
}

// Define a more structured permissions system
export const permissionModules = [
  {
    id: 'clients',
    name: 'Clients',
    description: 'Client information management',
    permissions: [
      { id: 'view:clients', label: 'View Clients', type: 'basic' },
      { id: 'create:clients', label: 'Create Clients', type: 'write' },
      { id: 'edit:clients', label: 'Edit Clients', type: 'write' },
      { id: 'delete:clients', label: 'Delete Clients', type: 'danger' },
    ]
  },
  {
    id: 'attorneys',
    name: 'Attorneys',
    description: 'Attorney management',
    permissions: [
      { id: 'view:attorneys', label: 'View Attorneys', type: 'basic' },
      { id: 'create:attorneys', label: 'Create Attorneys', type: 'write' },
      { id: 'edit:attorneys', label: 'Edit Attorneys', type: 'write' },
      { id: 'delete:attorneys', label: 'Delete Attorneys', type: 'danger' },
      { id: 'assign:cases', label: 'Assign Cases', type: 'write' },
    ]
  },
  {
    id: 'cases',
    name: 'Case Management',
    description: 'Legal case management',
    permissions: [
      { id: 'view:cases', label: 'View Cases', type: 'basic' },
      { id: 'create:cases', label: 'Create Cases', type: 'write' },
      { id: 'edit:cases', label: 'Edit Cases', type: 'write' },
      { id: 'delete:cases', label: 'Delete Cases', type: 'danger' },
      { id: 'assign:attorney', label: 'Assign Attorney', type: 'write' },
    ]
  },
  {
    id: 'medical',
    name: 'Medical Management',
    description: 'Medical records and information',
    permissions: [
      { id: 'view:medical', label: 'View Medical Records', type: 'basic' },
      { id: 'create:medical', label: 'Create Medical Records', type: 'write' },
      { id: 'edit:medical', label: 'Edit Medical Records', type: 'write' },
      { id: 'delete:medical', label: 'Delete Medical Records', type: 'danger' },
      { id: 'upload:medical', label: 'Upload Medical Records', type: 'write' },
      { id: 'download:medical', label: 'Download Medical Records', type: 'basic' },
    ]
  },
  {
    id: 'billing',
    name: 'Billing & Settlements',
    description: 'Financial management',
    permissions: [
      { id: 'view:billing', label: 'View Billing', type: 'basic' },
      { id: 'edit:billing', label: 'Edit Billing', type: 'write' },
      { id: 'calculate:settlements', label: 'Calculate Settlements', type: 'write' },
      { id: 'upload:invoices', label: 'Upload Invoices', type: 'write' },
      { id: 'process:payments', label: 'Process Payments', type: 'write' },
      { id: 'manage:settlements', label: 'Manage Settlements', type: 'write' },
    ]
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Document management',
    permissions: [
      { id: 'view:documents', label: 'View Documents', type: 'basic' },
      { id: 'upload:documents', label: 'Upload Documents', type: 'write' },
      { id: 'download:documents', label: 'Download Documents', type: 'basic' },
      { id: 'edit:documents', label: 'Edit Documents', type: 'write' },
      { id: 'delete:documents', label: 'Delete Documents', type: 'danger' },
    ]
  },
  {
    id: 'chatbot',
    name: 'Chatbot & Notes',
    description: 'Communication tools',
    permissions: [
      { id: 'view:chat', label: 'View Chat History', type: 'basic' },
      { id: 'add:notes', label: 'Add Notes', type: 'write' },
      { id: 'edit:notes', label: 'Edit Notes', type: 'write' },
      { id: 'delete:notes', label: 'Delete Notes', type: 'danger' },
    ]
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Analytics and reporting',
    permissions: [
      { id: 'view:reports', label: 'View Reports', type: 'basic' },
      { id: 'generate:reports', label: 'Generate Reports', type: 'write' },
      { id: 'download:reports', label: 'Download Reports', type: 'basic' },
      { id: 'share:reports', label: 'Share Reports', type: 'write' },
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'System alerts and messages',
    permissions: [
      { id: 'view:notifications', label: 'View Notifications', type: 'basic' },
      { id: 'manage:notifications', label: 'Manage Notifications', type: 'write' },
      { id: 'send:notifications', label: 'Send Notifications', type: 'write' },
    ]
  },
  {
    id: 'patients',
    name: 'Patients',
    description: 'Patient information',
    permissions: [
      { id: 'view:patients', label: 'View Patients', type: 'basic' },
      { id: 'edit:patients', label: 'Edit Patients', type: 'write' },
      { id: 'upload:patient-records', label: 'Upload Records', type: 'write' },
      { id: 'download:patient-records', label: 'Download Records', type: 'basic' },
      { id: 'delete:patients', label: 'Delete Patients', type: 'danger' },
    ]
  },
  {
    id: 'admin',
    name: 'Admin Controls',
    description: 'System administration',
    permissions: [
      { id: 'view:admin-panel', label: 'View Admin Panel', type: 'basic' },
      { id: 'manage:users', label: 'Manage Users', type: 'admin' },
      { id: 'manage:roles', label: 'Manage Roles', type: 'admin' },
      { id: 'view:audit-logs', label: 'View Audit Logs', type: 'admin' },
      { id: 'manage:settings', label: 'Manage System Settings', type: 'admin' },
    ]
  },
];

// Create a flat array of all permissions for lookup purposes
const allAvailablePermissions = permissionModules.flatMap(module => 
  module.permissions.map(permission => ({
    id: permission.id,
    label: permission.label,
    module: module.name,
    type: permission.type
  }))
);

// Add special permission for "all"
allAvailablePermissions.push({
  id: 'all',
  label: 'All Permissions (Admin)',
  module: 'Special',
  type: 'admin'
});

const getPermissionTypeColor = (type: string) => {
  switch (type) {
    case 'basic':
      return 'bg-blue-100 text-blue-800';
    case 'write':
      return 'bg-green-100 text-green-800';
    case 'danger':
      return 'bg-red-100 text-red-800';
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const RolePermissions: React.FC<PermissionProps> = ({
  role,
  permissions,
  onUpdatePermissions,
}) => {
  const [activeTab, setActiveTab] = useState('modules');
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const handleTogglePermission = (permissionId: string) => {
    if (permissionId === 'all') {
      if (permissions.includes('all')) {
        onUpdatePermissions(permissions.filter(p => p !== 'all'));
      } else {
        onUpdatePermissions(['all']);
      }
      return;
    }
    
    if (permissions.includes('all')) {
      const allPermissionsExcept = allAvailablePermissions
        .filter(p => p.id !== 'all' && p.id !== permissionId)
        .map(p => p.id);
      onUpdatePermissions(allPermissionsExcept);
      return;
    }
    
    const updatedPermissions = permissions.includes(permissionId)
      ? permissions.filter(p => p !== permissionId)
      : [...permissions, permissionId];
    
    onUpdatePermissions(updatedPermissions);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  const handleModuleSelectAll = (moduleId: string) => {
    const modulePermissions = permissionModules
      .find(m => m.id === moduleId)
      ?.permissions.map(p => p.id) || [];
      
    const currentlyHasAll = modulePermissions.every(p => permissions.includes(p));
    
    let updatedPermissions: string[];
    
    if (currentlyHasAll) {
      updatedPermissions = permissions.filter(p => !modulePermissions.includes(p));
    } else {
      const uniquePermissions = new Set([...permissions, ...modulePermissions]);
      updatedPermissions = Array.from(uniquePermissions);
    }
    
    onUpdatePermissions(updatedPermissions);
  };

  const hasAllPermission = permissions.includes('all');

  // Calculate if a module has all permissions granted
  const getModulePermissionStatus = (moduleId: string) => {
    if (hasAllPermission) return 'full';
    
    const modulePermissions = permissionModules
      .find(m => m.id === moduleId)
      ?.permissions.map(p => p.id) || [];
      
    const grantedCount = modulePermissions.filter(p => permissions.includes(p)).length;
    
    if (grantedCount === 0) return 'none';
    if (grantedCount === modulePermissions.length) return 'full';
    return 'partial';
  };

  return (
    <Card className="mt-4 bg-transparent border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5" />
          {role} Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Special 'All Permissions' switch at the top */}
        <div className="mb-6 p-3 bg-purple-50/10 backdrop-blur-sm rounded-lg border border-purple-200/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-300" />
              <Label htmlFor="permission-all" className="font-medium text-purple-100">
                All Permissions
              </Label>
              <Badge variant="outline" className="bg-purple-200/20 text-purple-100 border-purple-300/30">
                Full Administrator Access
              </Badge>
            </div>
            <Switch
              id="permission-all"
              checked={hasAllPermission}
              onCheckedChange={() => handleTogglePermission('all')}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 text-white">
          <TabsList className="mb-4 bg-transparent backdrop-blur-lg">
            <TabsTrigger 
              value="modules" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:text-purple-300 data-[state=active]:bg-transparent text-white"
            >
              By Module
            </TabsTrigger>
            <TabsTrigger 
              value="types" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-400 data-[state=active]:text-indigo-300 data-[state=active]:bg-transparent text-white"
            >
              By Permission Type
            </TabsTrigger>
          </TabsList>
          
          {/* Module-based view */}
          <TabsContent value="modules" className="space-y-6">
            {permissionModules.map((module) => (
              <div key={module.id} className="border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm">
                <div 
                  className={`p-3 flex items-center justify-between cursor-pointer
                    ${expandedModules.includes(module.id) ? 'bg-gray-50/10' : 'bg-transparent'}`}
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-gray-300" />
                    <div>
                      <h3 className="font-medium text-white">{module.name}</h3>
                      <p className="text-xs text-white/70">{module.description}</p>
                    </div>
                    {getModulePermissionStatus(module.id) === 'full' && (
                      <Badge className="bg-green-100/20 border-green-200/30 text-green-100 ml-2">
                        Full Access
                      </Badge>
                    )}
                    {getModulePermissionStatus(module.id) === 'partial' && (
                      <Badge className="bg-yellow-100/20 border-yellow-200/30 text-yellow-100 ml-2">
                        Partial Access
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModuleSelectAll(module.id);
                      }}
                      disabled={hasAllPermission}
                      className="mr-2 text-xs"
                    >
                      {getModulePermissionStatus(module.id) === 'full' ? 'Deselect All' : 'Select All'}
                    </Button>
                    {expandedModules.includes(module.id) 
                      ? <ChevronUp className="h-4 w-4" /> 
                      : <ChevronDown className="h-4 w-4" />
                    }
                  </div>
                </div>
                
                {/* Expanded module permissions */}
                {expandedModules.includes(module.id) && (
                  <div className="p-3 bg-gray-50/5 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {module.permissions.map((permission) => (
                        <div 
                          key={permission.id} 
                          className="flex items-center justify-between p-2 rounded-lg bg-transparent border border-white/20 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`${getPermissionTypeColor(permission.type)} h-6 w-6 p-0 flex items-center justify-center rounded-full`}
                            >
                              {permission.type === 'basic' && 'V'}
                              {permission.type === 'write' && 'W'}
                              {permission.type === 'danger' && 'D'}
                              {permission.type === 'admin' && 'A'}
                            </Badge>
                            <Label 
                              htmlFor={`permission-${permission.id}`} 
                              className="text-sm cursor-pointer text-white"
                            >
                              {permission.label}
                            </Label>
                          </div>
                          <Switch
                            id={`permission-${permission.id}`}
                            checked={permissions.includes(permission.id) || hasAllPermission}
                            disabled={hasAllPermission}
                            onCheckedChange={() => handleTogglePermission(permission.id)}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          {/* Type-based view */}
          <TabsContent value="types">
            <div className="space-y-6">
              {/* View Permissions */}
              <div>
                <h3 className="font-medium mb-2 flex items-center text-white">
                  <Badge className={getPermissionTypeColor('basic')}>View</Badge>
                  <span className="ml-2">View Permissions</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allAvailablePermissions
                    .filter(p => p.type === 'basic' && p.id !== 'all')
                    .map(permission => (
                      <div 
                        key={permission.id} 
                        className="flex items-center justify-between p-2 rounded-lg bg-transparent backdrop-blur-sm border border-white/20"
                      >
                        <div className="flex flex-col">
                          <Label 
                            htmlFor={`perm-${permission.id}`} 
                            className="text-sm cursor-pointer text-white"
                          >
                            {permission.label}
                          </Label>
                          <span className="text-xs text-white/70">{permission.module}</span>
                        </div>
                        <Switch
                          id={`perm-${permission.id}`}
                          checked={permissions.includes(permission.id) || hasAllPermission}
                          disabled={hasAllPermission}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Write Permissions */}
              <div>
                <h3 className="font-medium mb-2 flex items-center text-white">
                  <Badge className={getPermissionTypeColor('write')}>Write</Badge>
                  <span className="ml-2">Create/Edit Permissions</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allAvailablePermissions
                    .filter(p => p.type === 'write')
                    .map(permission => (
                      <div 
                        key={permission.id} 
                        className="flex items-center justify-between p-2 rounded-lg bg-transparent backdrop-blur-sm border border-white/20"
                      >
                        <div className="flex flex-col">
                          <Label 
                            htmlFor={`perm-${permission.id}`} 
                            className="text-sm cursor-pointer text-white"
                          >
                            {permission.label}
                          </Label>
                          <span className="text-xs text-white/70">{permission.module}</span>
                        </div>
                        <Switch
                          id={`perm-${permission.id}`}
                          checked={permissions.includes(permission.id) || hasAllPermission}
                          disabled={hasAllPermission}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Danger Permissions */}
              <div>
                <h3 className="font-medium mb-2 flex items-center text-white">
                  <Badge className={getPermissionTypeColor('danger')}>Danger</Badge>
                  <span className="ml-2">Delete Permissions</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allAvailablePermissions
                    .filter(p => p.type === 'danger')
                    .map(permission => (
                      <div 
                        key={permission.id} 
                        className="flex items-center justify-between p-2 rounded-lg bg-transparent backdrop-blur-sm border border-white/20"
                      >
                        <div className="flex flex-col">
                          <Label 
                            htmlFor={`perm-${permission.id}`} 
                            className="text-sm cursor-pointer text-white"
                          >
                            {permission.label}
                          </Label>
                          <span className="text-xs text-white/70">{permission.module}</span>
                        </div>
                        <Switch
                          id={`perm-${permission.id}`}
                          checked={permissions.includes(permission.id) || hasAllPermission}
                          disabled={hasAllPermission}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Admin Permissions */}
              <div>
                <h3 className="font-medium mb-2 flex items-center text-white">
                  <Badge className={getPermissionTypeColor('admin')}>Admin</Badge>
                  <span className="ml-2">Administrative Permissions</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allAvailablePermissions
                    .filter(p => p.type === 'admin' && p.id !== 'all')
                    .map(permission => (
                      <div 
                        key={permission.id} 
                        className="flex items-center justify-between p-2 rounded-lg bg-transparent backdrop-blur-sm border border-white/20"
                      >
                        <div className="flex flex-col">
                          <Label 
                            htmlFor={`perm-${permission.id}`} 
                            className="text-sm cursor-pointer text-white"
                          >
                            {permission.label}
                          </Label>
                          <span className="text-xs text-white/70">{permission.module}</span>
                        </div>
                        <Switch
                          id={`perm-${permission.id}`}
                          checked={permissions.includes(permission.id) || hasAllPermission}
                          disabled={hasAllPermission}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={() => onUpdatePermissions(permissions)}
            variant="outline"
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolePermissions;
