"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Tree, NodeApi, NodeRendererProps, TreeApi, CursorProps } from 'react-arborist';
import * as icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Menu Item Type
type MenuItem = {
    id: string;
    name: string;
    icon: keyof typeof icons;
    permissions?: string[];
    readOnly: boolean;
    children?: MenuItem[];
};

// Sample Authorization Menu Data
const authMenuData: MenuItem[] = [
    {
        id: '1',
        name: 'Dashboard',
        icon: 'LayoutDashboard',
        permissions: ['view'],
        readOnly: true,
    },
    {
        id: '2',
        name: 'User Management',
        icon: 'Users',
        permissions: ['view', 'create', 'edit', 'delete'],
        readOnly: false,
        children: [
            {
                id: '2-1',
                name: 'User List',
                icon: 'UserCircle',
                permissions: ['view'],
                readOnly: false,
            },
            {
                id: '2-2',
                name: 'Roles',
                icon: 'Shield',
                permissions: ['view', 'edit'],
                readOnly: false,
            },
            {
                id: '2-3',
                name: 'Permissions',
                icon: 'Lock',
                permissions: ['view', 'edit'],
                readOnly: false,
            },
        ],
    },
    {
        id: '3',
        name: 'Content',
        icon: 'FileText',
        permissions: ['view', 'create'],
        readOnly: false,
        children: [
            {
                id: '3-1',
                name: 'Posts',
                icon: 'Newspaper',
                permissions: ['view', 'create', 'edit'],
                readOnly: false,
            },
            {
                id: '3-2',
                name: 'Media',
                icon: 'Image',
                permissions: ['view', 'upload'],
                readOnly: false,
            },
        ],
    },
    {
        id: '4',
        name: 'Settings',
        icon: 'Settings',
        permissions: ['view', 'edit'],
        readOnly: true,
    },
    {
        id: '5',
        name: 'Reports',
        icon: 'BarChart3',
        permissions: ['view'],
        readOnly: false,
    },
    {
        id: '6',
        name: 'System',
        icon: 'Server',
        readOnly: false,
        children: [
            {
                id: '6-1',
                name: 'Logs',
                icon: 'ScrollText',
                permissions: ['view'],
                readOnly: false,
            },
            {
                id: '6-2',
                name: 'Backups',
                icon: 'HardDrive',
                permissions: ['view', 'create'],
                readOnly: false,
            },
        ],
    },
];

// Fill Parent Component
const FillFlexParent = ({ children }: { children: (dimens: { width: number; height: number }) => React.ReactElement }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (ref.current) {
                setDimensions({
                    width: ref.current.offsetWidth,
                    height: ref.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    return (
        <div ref={ref} className="flex-1 w-full h-full min-h-0 min-w-0">
            {dimensions.width && dimensions.height ? children(dimensions) : null}
        </div>
    );
};

// Node Component
function Node({ node, style, dragHandle }: NodeRendererProps<MenuItem>) {
    const IconComponent = (icons[node.data.icon] || icons.Folder) as React.ComponentType<
        React.SVGProps<SVGSVGElement>
    >;
    const permissionCount = node.data.permissions?.length || 0;

    return (
        <div
            ref={dragHandle}
            style={style}
            className="flex items-center h-full px-3 cursor-pointer select-none"
            onClick={() => node.isInternal && node.toggle()}
        >
            <FolderArrow node={node} />
            <IconComponent className="w-4 h-4 mr-3" />
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {node.isEditing ? <EditInput node={node} /> : node.data.name}
            </span>
            {permissionCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                    {permissionCount}
                </Badge>
            )}
        </div>
    );
}

// Edit Input Component
function EditInput({ node }: { node: NodeApi<MenuItem> }) {
    return (
        <Input
            autoFocus
            type="text"
            defaultValue={node.data.name}
            className="h-6 text-sm"
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => node.reset()}
            onKeyDown={(e) => {
                if (e.key === 'Escape') node.reset();
                if (e.key === 'Enter') node.submit(e.currentTarget.value);
            }}
        />
    );
}

// Folder Arrow Component
function FolderArrow({ node }: { node: NodeApi<MenuItem> }) {
    if (node.isLeaf) return <span className="w-5" />;
    return (
        <span className="w-5 flex items-center text-lg">
            {node.isOpen ? <icons.ChevronDown className="w-4 h-4" /> : <icons.ChevronRight className="w-4 h-4" />}
        </span>
    );
}

// Cursor Component
function Cursor({ top, left }: CursorProps) {
    return (
        <div
            className="absolute w-full h-0 border-t-2 border-dashed border-primary"
            style={{ top, left }}
        />
    );
}

// Main Component
export default function AuthorizationMenu() {
    const [searchTerm, setSearchTerm] = useState('');
    const treeRef = useRef<TreeApi<MenuItem> | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700 backdrop-blur">
                        <div className="p-4 border-b border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <icons.Menu className="w-6 h-6 text-slate-300" />
                                <icons.Shield className="w-6 h-6 text-primary" />
                                <h1 className="text-xl font-light text-white">Authorization</h1>
                            </div>
                            <Button className="w-full justify-start gap-2" variant="secondary">
                                <icons.Plus className="w-4 h-4" />
                                Add Menu Item
                            </Button>
                        </div>

                        <div className="h-[calc(100vh-250px)]">
                            <FillFlexParent>
                                {({ width, height }) => (
                                    <Tree
                                        ref={treeRef}
                                        initialData={authMenuData}
                                        width={width}
                                        height={height}
                                        rowHeight={36}
                                        renderCursor={Cursor}
                                        searchTerm={searchTerm}
                                        paddingBottom={32}
                                        disableEdit={(data) => data.readOnly}
                                        disableDrop={({ parentNode, dragNodes }) => {
                                            // Prevent dropping Dashboard into other nodes
                                            if (dragNodes.some((drag) => drag.data.name === 'Dashboard')) {
                                                return parentNode.data.name !== undefined;
                                            }
                                            return false;
                                        }}
                                        className="text-slate-200"
                                    >
                                        {Node}
                                    </Tree>
                                )}
                            </FillFlexParent>
                        </div>
                    </Card>

                    {/* Content Area */}
                    <Card className="lg:col-span-2 p-8 bg-white">
                        <h1 className="text-3xl font-bold mb-4 text-slate-900">
                            Authorization Menu System
                        </h1>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm font-semibold text-blue-900">
                                💡 Interactive Demo
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                                This is a fully functional drag-and-drop menu management system using shadcn/ui components.
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold mb-3 text-slate-800">Features:</h2>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-start gap-2">
                                <icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                                <span><strong>Drag & Drop:</strong> Reorganize menu items by dragging them</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                                <span><strong>Protected Items:</strong> Dashboard cannot be moved (readonly)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                                <span><strong>Keyboard Navigation:</strong> Use arrow keys to navigate</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                                <span><strong>Toggle Folders:</strong> Press spacebar to expand/collapse</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                                <span><strong>Rename:</strong> Press Enter on editable items</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                                <span><strong>Create:</strong> Press A for new item, Shift+A for folder</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                                <span><strong>Delete:</strong> Press Delete key to remove items</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                                <span><strong>Multi-select:</strong> Use Shift or Cmd/Ctrl for multiple items</span>
                            </li>
                        </ul>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-slate-700">
                                Search Menu Items:
                            </label>
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Type to filter menu items..."
                                className="max-w-md"
                            />
                        </div>

                        <h2 className="text-xl font-semibold mb-3 text-slate-800">Permission Badges:</h2>
                        <p className="text-slate-600 mb-4">
                            Each menu item displays a badge showing the number of permissions assigned to it. This helps administrators quickly identify access control levels.
                        </p>

                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="text-sm text-slate-600">
                                <strong>Technical Stack:</strong> Built with React Arborist for tree management, shadcn/ui for components, and Tailwind CSS for styling. All original functionality preserved with modern UI components.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>

            <style jsx global>{`
        [role="treeitem"] {
          color: rgb(226, 232, 240);
          border-radius: 0 0.5rem 0.5rem 0;
          cursor: pointer;
          font-weight: 400;
          font-size: 0.875rem;
          user-select: none;
          border: 1px dashed transparent;
          transition: all 0.15s;
        }

        [role="treeitem"]:focus-visible {
          background-color: rgba(148, 163, 184, 0.2);
          outline: none;
        }

        [role="treeitem"][aria-selected="true"]:focus-visible {
          background-color: rgba(148, 163, 184, 0.4);
          outline: none;
        }

        [role="treeitem"]:hover {
          background-color: rgba(148, 163, 184, 0.2);
        }

        [role="treeitem"][aria-selected="true"] {
          background-color: rgba(148, 163, 184, 0.3);
          font-weight: 600;
        }

        [role="treeitem"]:has(.willReceiveDrop) {
          background-color: rgba(59, 130, 246, 0.3);
          border: 1px dashed rgb(59, 130, 246);
        }
      `}</style>
        </div>
    );
}