'use client'

import React, { useMemo, useState } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    MeasuringStrategy,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, GripVertical, Folder, File } from 'lucide-react';

// Tree node type
type TreeItem = {
    id: string;
    name: string;
    children?: TreeItem[];
};

// Initial tree data
const initialItems: TreeItem[] = [
    {
        id: '1',
        name: 'Documents',
        children: [
            { id: '1-1', name: 'Resume.pdf' },
            { id: '1-2', name: 'Cover Letter.docx' },
            {
                id: '1-3',
                name: 'Projects',
                children: [
                    { id: '1-3-1', name: 'Project A.txt' },
                    { id: '1-3-2', name: 'Project B.txt' },
                ],
            },
        ],
    },
    {
        id: '2',
        name: 'Images',
        children: [
            { id: '2-1', name: 'Photo1.jpg' },
            { id: '2-2', name: 'Photo2.png' },
        ],
    },
    {
        id: '3',
        name: 'Videos',
        children: [
            { id: '3-1', name: 'Tutorial.mp4' },
        ],
    },
    { id: '4', name: 'Readme.txt' },
];

// Flatten tree for DndKit
type FlattenedItem = TreeItem & {
    parentId: string | null;
    depth: number;
    index: number;
};

function flattenTree(
    items: TreeItem[],
    parentId: string | null = null,
    depth: number = 0
): FlattenedItem[] {
    return items.reduce<FlattenedItem[]>((acc, item, index) => {
        const flatItem: FlattenedItem = { ...item, parentId, depth, index };
        acc.push(flatItem);
        if (item.children && item.children.length > 0) {
            acc.push(...flattenTree(item.children, item.id, depth + 1));
        }
        return acc;
    }, []);
}

// Build tree from flat structure
function buildTree(flatItems: FlattenedItem[]): TreeItem[] {
    const tree: TreeItem[] = [];
    const itemMap = new Map<string, TreeItem>();

    flatItems.forEach(item => {
        itemMap.set(item.id, { id: item.id, name: item.name, children: [] });
    });

    flatItems.forEach(item => {
        const treeItem = itemMap.get(item.id)!;
        if (item.parentId === null) {
            tree.push(treeItem);
        } else {
            const parent = itemMap.get(item.parentId);
            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(treeItem);
            }
        }
    });

    return tree;
}

// Get projection for drag operations
function getProjection(
    items: FlattenedItem[],
    activeId: string,
    overId: string,
    offsetLeft: number
) {
    const overItemIndex = items.findIndex(item => item.id === overId);
    const activeItemIndex = items.findIndex(item => item.id === activeId);
    const activeItem = items[activeItemIndex];
    const overItem = items[overItemIndex];

    if (!activeItem || !overItem) return null;

    const maxDepth = getMaxDepth();
    const minDepth = 0;
    const dragDepth = Math.round(offsetLeft / 32);
    const projectedDepth = Math.min(Math.max(overItem.depth + dragDepth, minDepth), maxDepth);

    return {
        depth: projectedDepth,
        maxDepth,
        minDepth,
        parentId: getParentId(),
    };

    function getMaxDepth() {
        if (overItem.children && overItem.children.length > 0) {
            return overItem.depth + 1;
        }
        return overItem.depth;
    }

    function getParentId() {
        if (projectedDepth === 0) return null;
        if (projectedDepth === overItem.depth) return overItem.parentId;
        if (projectedDepth > overItem.depth) return overItem.id;

        const newParent = items
            .slice(0, overItemIndex)
            .reverse()
            .find(item => item.depth === projectedDepth - 1);

        return newParent?.id ?? null;
    }
}

// Sortable Tree Item Component
function SortableTreeItem({
    item,
    onToggle,
    isExpanded,
}: {
    item: FlattenedItem;
    onToggle: (id: string) => void;
    isExpanded: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const hasChildren = item.children && item.children.length > 0;

    // Calculate width reduction based on depth (10% per level, max 40%)
    const widthReduction = Math.min(item.depth * 10, 40);
    const itemWidth = `${100 - widthReduction}%`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative mb-2 ${isDragging ? 'opacity-50' : ''}`}
        >
            <div
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all hover:border-blue-400"
                style={{
                    paddingLeft: `${item.depth * 32 + 12}px`,
                    paddingRight: '12px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    marginLeft: `${item.depth * 32}px`,
                    width: itemWidth,
                }}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing hover:bg-gray-100 p-1 rounded"
                >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                {hasChildren ? (
                    <button
                        onClick={() => onToggle(item.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <ChevronRight
                            className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''
                                }`}
                        />
                    </button>
                ) : (
                    <div className="w-6" />
                )}

                {hasChildren ? (
                    <Folder className="w-5 h-5 text-blue-500" />
                ) : (
                    <File className="w-5 h-5 text-gray-400" />
                )}

                <span className="flex-1 text-sm font-medium text-gray-700">{item.name}</span>

                {/* Depth indicator badge */}
                {item.depth > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                        L{item.depth}
                    </span>
                )}
            </div>

            {/* Visual connector line for nested items */}
            {item.depth > 0 && (
                <div
                    className="absolute top-0 bottom-0 w-px bg-gray-200"
                    style={{ left: `${item.depth * 32 - 16}px` }}
                />
            )}
        </div>
    );
}

export default function TreeDragDrop() {
    const [items, setItems] = useState<TreeItem[]>(initialItems);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [expanded, setExpanded] = useState<Set<string>>(
        new Set(['1', '2', '3', '1-3'])
    );

    const flattenedItems = useMemo(() => {
        const flattened = flattenTree(items);
        return flattened.filter(item => {
            if (item.parentId === null) return true;

            let parent = flattened.find(i => i.id === item.parentId);
            while (parent) {
                if (!expanded.has(parent.id)) return false;
                parent = flattened.find(i => i.id === parent?.parentId);
            }
            return true;
        });
    }, [items, expanded]);

    const sortedIds = useMemo(
        () => flattenedItems.map(item => item.id),
        [flattenedItems]
    );

    const activeItem = activeId
        ? flattenedItems.find(item => item.id === activeId)
        : null;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const measuring = {
        droppable: {
            strategy: MeasuringStrategy.Always,
        },
    };

    const projected = useMemo(() => {
        if (!activeId || !overId) return null;
        return getProjection(flattenedItems, activeId, overId, offsetLeft);
    }, [activeId, overId, offsetLeft, flattenedItems]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        setOverId(event.over?.id as string);
        setOffsetLeft(event.delta.x);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        resetState();

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeIndex = flattenedItems.findIndex(item => item.id === active.id);
        const overIndex = flattenedItems.findIndex(item => item.id === over.id);

        if (activeIndex === -1 || overIndex === -1) return;

        // Create new flattened array with reordering
        let newFlatItems = [...flattenedItems];
        newFlatItems = arrayMove(newFlatItems, activeIndex, overIndex);

        // Apply depth changes if projected
        if (projected) {
            const updatedIndex = newFlatItems.findIndex(item => item.id === active.id);
            newFlatItems[updatedIndex] = {
                ...newFlatItems[updatedIndex],
                depth: projected.depth,
                parentId: projected.parentId,
            };
        }

        // Rebuild tree from flattened structure
        const newTree = buildTree(newFlatItems);
        setItems(newTree);
    };

    const handleDragCancel = () => {
        resetState();
    };

    const resetState = () => {
        setActiveId(null);
        setOverId(null);
        setOffsetLeft(0);
    };

    const toggleExpand = (id: string) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Tree Drag & Drop
                    </h1>
                    <p className="text-gray-600">
                        Drag items horizontally to change nesting level, vertically to reorder
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                        measuring={measuring}
                    >
                        <SortableContext
                            items={sortedIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {flattenedItems.map(item => (
                                <SortableTreeItem
                                    key={item.id}
                                    item={item}
                                    onToggle={toggleExpand}
                                    isExpanded={expanded.has(item.id)}
                                />
                            ))}
                        </SortableContext>

                        <DragOverlay>
                            {activeItem && (
                                <div
                                    className="flex items-center gap-2 bg-white border-2 border-blue-500 rounded-lg shadow-2xl"
                                    style={{
                                        paddingLeft: `${(projected?.depth ?? activeItem.depth) * 32 + 12}px`,
                                        paddingRight: '12px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        width: `${100 - Math.min((projected?.depth ?? activeItem.depth) * 10, 40)}%`,
                                    }}
                                >
                                    <GripVertical className="w-4 h-4 text-gray-400" />

                                    {activeItem.children && activeItem.children.length > 0 ? (
                                        <>
                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                            <Folder className="w-5 h-5 text-blue-500" />
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-6" />
                                            <File className="w-5 h-5 text-gray-400" />
                                        </>
                                    )}

                                    <span className="flex-1 text-sm font-medium text-gray-700">
                                        {activeItem.name}
                                    </span>

                                    {(projected?.depth ?? activeItem.depth) > 0 && (
                                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded font-semibold">
                                            L{projected?.depth ?? activeItem.depth}
                                        </span>
                                    )}
                                </div>
                            )}
                        </DragOverlay>
                    </DndContext>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">✨</span> Features
                        </h3>
                        <ul className="text-sm space-y-2 text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">▸</span>
                                <span>Nested items are visually shorter</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">▸</span>
                                <span>Drag left/right to change depth</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">▸</span>
                                <span>Drag up/down to reorder</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">▸</span>
                                <span>Move items between parents</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                            <span className="text-lg">💡</span> Visual Indicators
                        </h3>
                        <ul className="text-sm space-y-2 text-green-800">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">▸</span>
                                <span>Level badge shows nesting depth</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">▸</span>
                                <span>Connector lines show hierarchy</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">▸</span>
                                <span>Width decreases 10% per level</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">▸</span>
                                <span>Hover effects for better feedback</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}