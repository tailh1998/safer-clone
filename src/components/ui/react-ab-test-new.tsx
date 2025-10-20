"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Tree, NodeApi, NodeRendererProps, TreeApi, CursorProps } from 'react-arborist';
import * as icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

type MenuItem = {
    id: string;
    name: string;
    icon: keyof typeof icons;
    readOnly: boolean;
    children?: MenuItem[];
};

const initialAuthMenuData: MenuItem[] = [
    {
        id: '1',
        name: 'Dashboard',
        icon: 'LayoutDashboard',
        readOnly: true,
    },
    {
        id: '2',
        name: 'User Management',
        icon: 'Users',
        readOnly: false,
        children: [
            {
                id: '2-1',
                name: 'User List',
                icon: 'UserCircle',
                readOnly: false,
            },
            {
                id: '2-2',
                name: 'Roles',
                icon: 'Shield',
                readOnly: false,
            },
            {
                id: '2-3',
                name: 'Permissions',
                icon: 'Lock',
                readOnly: false,
            },
        ],
    },
    {
        id: '3',
        name: 'Content',
        icon: 'FileText',
        readOnly: false,
        children: [
            {
                id: '3-1',
                name: 'Posts',
                icon: 'Newspaper',
                readOnly: false,
            },
            {
                id: '3-2',
                name: 'Media',
                icon: 'Image',
                readOnly: false,
            },
        ],
    },
    {
        id: '4',
        name: 'Settings',
        icon: 'Settings',
        readOnly: true,
    },
    {
        id: '5',
        name: 'Reports',
        icon: 'BarChart3',
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
                readOnly: false,
            },
            {
                id: '6-2',
                name: 'Backups',
                icon: 'HardDrive',
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

    return (
        <div
            ref={dragHandle}
            style={style}
            className="flex items-center h-full px-3 cursor-pointer select-none"
            onClick={() => node.isInternal && node.toggle()}
        >
            <FolderArrow node={node} />
            <IconComponent className="w-4 h-4 mr-3" />
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                {/* FOR EDIT */}
                {/* {node.isEditing ? <EditInput node={node} /> : node.data.name} */}

                {node.data.name}
            </span>
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
    const [menuData, setMenuData] = useState<MenuItem[]>(initialAuthMenuData);
    const [lastAction, setLastAction] = useState('');
    const treeRef = useRef<TreeApi<MenuItem> | null>(null);

    // Control Functions
    const handleExpandAll = () => {
        treeRef.current?.openAll();
        setLastAction('✅ Expanded all folders');
        console.log('Expanded all folders');
    };

    const handleCollapseAll = () => {
        treeRef.current?.closeAll();
        setLastAction('✅ Collapsed all folders');
        console.log('Collapsed all folders');
    };

    const handleGetSelectedNode = () => {
        const selectedNodes = treeRef.current?.selectedNodes;
        if (selectedNodes && selectedNodes.length > 0) {
            const node = selectedNodes[0];
            const info = `
Selected Node:
- Name: ${node.data.name}
- ID: ${node.data.id}
- ReadOnly: ${node.data.readOnly}
- Has Children: ${node.children ? 'Yes' : 'No'}
            `.trim();
            alert(info);
            setLastAction(`📌 Selected: ${node.data.name}`);
            console.log('Selected node:', node.data);
        } else {
            alert('No node selected. Click on a menu item first!');
            setLastAction('⚠️ No node selected');
        }
    };

    const handleFocusNode = () => {
        const nodeId = prompt('Enter node ID to focus (e.g., "2-1" for User List):');
        if (nodeId) {
            const node = treeRef.current?.get(nodeId);
            if (node) {
                node.focus();
                node.open();
                // Open parent nodes too
                let parent = node.parent;
                while (parent) {
                    parent.open();
                    parent = parent.parent;
                }
                setLastAction(`🎯 Focused on: ${node.data.name}`);
                console.log('Focused on node:', node.data);
            } else {
                alert(`Node with ID "${nodeId}" not found`);
                setLastAction(`❌ Node "${nodeId}" not found`);
            }
        }
    };

    const handleGetTreeData = () => {
        const data = (treeRef.current as any)?.data;
        console.log('Current tree data:', data);
        setLastAction('📊 Tree data logged to console');
        alert('Tree data has been logged to the console. Press F12 to view.');
    };

    // Helper function to find and remove node from tree
    const removeNodeById = (nodes: MenuItem[], id: string): { node: MenuItem | null; remaining: MenuItem[] } => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
                const node = nodes[i];
                const remaining = [...nodes.slice(0, i), ...nodes.slice(i + 1)];
                return { node, remaining };
            }
            if (nodes[i].children) {
                const result = removeNodeById(nodes[i].children!, id);
                if (result.node) {
                    return {
                        node: result.node,
                        remaining: [
                            ...nodes.slice(0, i),
                            { ...nodes[i], children: result.remaining },
                            ...nodes.slice(i + 1)
                        ]
                    };
                }
            }
        }
        return { node: null, remaining: nodes };
    };

    // Helper function to insert node at specific position
    const insertNodeAt = (nodes: MenuItem[], parentId: string | null, index: number, node: MenuItem): MenuItem[] => {
        if (parentId === null) {
            // Insert at root level
            return [...nodes.slice(0, index), node, ...nodes.slice(index)];
        }

        // Find parent and insert into its children
        return nodes.map(item => {
            if (item.id === parentId) {
                const children = item.children || [];
                return {
                    ...item,
                    children: [...children.slice(0, index), node, ...children.slice(index)]
                };
            }
            if (item.children) {
                return {
                    ...item,
                    children: insertNodeAt(item.children, parentId, index, node)
                };
            }
            return item;
        });
    };

    // Helper function to update node name
    const updateNodeName = (nodes: MenuItem[], id: string, newName: string): MenuItem[] => {
        return nodes.map(node => {
            if (node.id === id) {
                return { ...node, name: newName };
            }
            if (node.children) {
                return { ...node, children: updateNodeName(node.children, id, newName) };
            }
            return node;
        });
    };

    // Helper function to delete nodes by IDs
    const deleteNodesById = (nodes: MenuItem[], ids: string[]): MenuItem[] => {
        return nodes.filter(node => !ids.includes(node.id)).map(node => {
            if (node.children) {
                return { ...node, children: deleteNodesById(node.children, ids) };
            }
            return node;
        });
    };

    // Helper function to create new node
    const createNode = (type: 'leaf' | 'internal'): MenuItem => {
        const id = `new-${Date.now()}`;
        return {
            id,
            name: type === 'internal' ? 'New Folder' : 'New Item',
            icon: type === 'internal' ? 'Folder' : 'File',
            readOnly: false,
            ...(type === 'internal' ? { children: [] } : {})
        };
    };

    // Event Handlers for Tree Changes
    const handleMove = (args: { dragIds: string[]; parentId: string | null; index: number }) => {
        console.log('Node moved:', args);

        let newData = [...menuData];
        const movedNodes: MenuItem[] = [];

        // Remove all dragged nodes and collect them
        args.dragIds.forEach(id => {
            const result = removeNodeById(newData, id);
            if (result.node) {
                movedNodes.push(result.node);
                newData = result.remaining;
            }
        });

        // Insert all moved nodes at the new position
        movedNodes.forEach((node, idx) => {
            newData = insertNodeAt(newData, args.parentId, args.index + idx, node);
        });

        setMenuData(newData);
        setLastAction(`🔄 Moved ${args.dragIds.length} node(s)`);
        console.log('New menu structure:', newData);
    };

    const handleRename = (args: { id: string; name: string }) => {
        console.log('Node renamed:', args);
        const newData = updateNodeName(menuData, args.id, args.name);
        setMenuData(newData);
        setLastAction(`✏️ Renamed to: ${args.name}`);
    };

    const handleDelete = (args: { ids: string[] }) => {
        console.log('Node(s) deleted:', args);
        const newData = deleteNodesById(menuData, args.ids);
        setMenuData(newData);
        setLastAction(`🗑️ Deleted ${args.ids.length} item(s)`);
    };

    const handleCreate = (args: { parentId: string | null; index: number; type: 'leaf' | 'internal' }) => {
        console.log('Node created:', args);
        const newNode = createNode(args.type);
        const newData = insertNodeAt(menuData, args.parentId, args.index, newNode);
        setMenuData(newData);
        setLastAction(`➕ Created new ${args.type === 'internal' ? 'folder' : 'item'}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid gap-6">
                    {/* Sidebar */}
                    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
                        <div className="p-4 border-b border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <icons.Menu className="w-6 h-6 text-slate-300" />
                                <icons.Shield className="w-6 h-6 text-primary" />
                                <h1 className="text-xl font-light text-white">Authorization</h1>
                            </div>

                            {/* Last Action Display */}
                            {lastAction && (
                                <div className="mb-4 p-2 bg-green-900/30 border border-green-700 rounded text-xs text-green-300">
                                    {lastAction}
                                </div>
                            )}

                            {/* Control Buttons */}
                            <div className="space-y-2 mb-4">
                                <Button
                                    className="w-full justify-start gap-2"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleExpandAll}
                                >
                                    <icons.ChevronsDown className="w-4 h-4" />
                                    Expand All
                                </Button>
                                <Button
                                    className="w-full justify-start gap-2"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleCollapseAll}
                                >
                                    <icons.ChevronsUp className="w-4 h-4" />
                                    Collapse All
                                </Button>
                                <Button
                                    className="w-full justify-start gap-2"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleGetSelectedNode}
                                >
                                    <icons.MousePointer className="w-4 h-4" />
                                    Get Selected
                                </Button>
                                <Button
                                    className="w-full justify-start gap-2"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleFocusNode}
                                >
                                    <icons.Target className="w-4 h-4" />
                                    Focus Node by ID
                                </Button>
                                <Button
                                    className="w-full justify-start gap-2"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleGetTreeData}
                                >
                                    <icons.Database className="w-4 h-4" />
                                    Log Tree Data
                                </Button>
                            </div>

                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search menu..."
                                className="mb-4 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                            />
                        </div>

                        <div className="h-[calc(100vh-500px)] min-h-[300px] max-w-[250px]">
                            <FillFlexParent>
                                {({ width, height }) => (
                                    <Tree
                                        ref={treeRef}
                                        data={menuData}
                                        width={width}
                                        height={height}
                                        rowHeight={36}
                                        renderCursor={Cursor}
                                        searchTerm={searchTerm}
                                        paddingBottom={32}
                                        onMove={handleMove}
                                        onRename={handleRename}
                                        onDelete={handleDelete}
                                        // z: TODO:
                                        // onCreate={handleCreate}
                                        disableEdit={(data) => data.readOnly}
                                        // TODO:
                                        disableDrop={({ parentNode, dragNodes }) => {
                                            if (dragNodes.some((drag) => drag.data.name === 'Dashboard')) {
                                                return parentNode.data.name !== undefined;
                                            }
                                            return false;
                                        }}
                                        className="text-slate-200"
                                        renderDragPreview={() => null}

                                    // z: TODO: Đoạn này hơi bí
                                    // renderDragPreview={({ id, mouse }) => {
                                    //     if (!id || !mouse) return null
                                    //     const node = treeRef.current?.get(id)

                                    //     return (
                                    //         <span
                                    //             style={{
                                    //                 left: mouse.x,
                                    //                 top: mouse.y,
                                    //                 // transform: "translate(-50%, -50%)", // căn giữa theo con trỏ
                                    //             }}
                                    //             className="fixed z-[9999] pointer-events-none bg-slate-700 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                                    //             {node?.data?.name}
                                    //         </span>
                                    //     )
                                    // }}
                                    >
                                        {Node}
                                    </Tree>
                                )}
                            </FillFlexParent>
                        </div>
                    </Card>
                </div>
            </div>

            {/* TODO: Rework the CSS or move it to global styles — watch out for style conflicts. */}
            <style>{`
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

                kbd {
                    font-family: monospace;
                    font-size: 0.85em;
                }
            `}</style>
        </div>
    );
}