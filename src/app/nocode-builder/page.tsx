"use client";

import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Maximize2,
  Minimize2,
} from "lucide-react";

const Canvas = ({ children }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 p-4 h-[600px] overflow-auto">
      {children}
    </div>
  );
};

const DraggableComponent = ({ type, children }) => {
  const [, drag] = useDrag({
    type: "component",
    item: { type },
  });

  return (
    <div
      ref={drag}
      className="cursor-move bg-primary text-primary-foreground p-2 mb-2 rounded"
    >
      {children}
    </div>
  );
};

const DroppableArea = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "component",
    drop: (item) => onDrop(item.type),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[100px] p-2 ${
        isOver ? "bg-secondary" : "bg-background"
      }`}
    >
      {children}
    </div>
  );
};

const EditableComponent = ({ component, onUpdate }) => {
  const handleContentChange = (e, field = "content") => {
    const newContent =
      field === "content"
        ? e.target.value
        : { ...component.content, [field]: e.target.value };
    onUpdate({ ...component, content: newContent });
  };

  switch (component.type) {
    case "heading":
      return (
        <input
          type="text"
          value={component.content}
          onChange={handleContentChange}
          className="text-2xl font-bold w-full border-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter heading"
        />
      );
    case "paragraph":
      return (
        <textarea
          value={component.content}
          onChange={handleContentChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter paragraph text"
        />
      );
    case "button":
      return (
        <div>
          <Input
            type="text"
            value={component.content}
            onChange={handleContentChange}
            className="mb-2"
            placeholder="Button text"
          />
          <Button>{component.content || "Click me"}</Button>
        </div>
      );
    case "input":
      return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={`input-${component.id}`}>
            <Input
              type="text"
              value={component.content.label || ""}
              onChange={(e) => handleContentChange(e, "label")}
              placeholder="Label text"
              className="mb-2"
            />
          </Label>
          <Input
            type="text"
            id={`input-${component.id}`}
            placeholder={component.content.placeholder || "Placeholder text"}
            value={component.content.placeholder || ""}
            onChange={(e) => handleContentChange(e, "placeholder")}
          />
        </div>
      );
    case "card":
      return (
        <Card>
          <CardHeader>
            <CardTitle>
              <Input
                type="text"
                value={component.content.title || ""}
                onChange={(e) => handleContentChange(e, "title")}
                className="w-full"
                placeholder="Card Title"
              />
            </CardTitle>
            <CardDescription>
              <Input
                type="text"
                value={component.content.description || ""}
                onChange={(e) => handleContentChange(e, "description")}
                className="w-full"
                placeholder="Card Description"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={component.content.body || ""}
              onChange={(e) => handleContentChange(e, "body")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Card Content"
            />
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
};

const Container = ({
  children,
  style,
  onStyleChange,
  onSelect,
  isSelected,
}) => {
  return (
    <div
      style={style}
      className={`p-2 border-2 ${
        isSelected ? "border-blue-500" : "border-gray-300"
      } mb-4 relative`}
      onClick={onSelect}
    >
      {children}
      <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs">
        Container
      </div>
    </div>
  );
};

const FlexControls = ({ style, onStyleChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Display Mode</Label>
        <Select
          value={style.display}
          onValueChange={(value) => onStyleChange({ ...style, display: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select display" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flex">Flex</SelectItem>
            <SelectItem value="block">Block</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {style.display === "flex" && (
        <>
          <div>
            <Label>Justify Content</Label>
            <div className="flex justify-between mt-2">
              <Button
                variant={
                  style.justifyContent === "flex-start" ? "default" : "outline"
                }
                size="icon"
                onClick={() =>
                  onStyleChange({ ...style, justifyContent: "flex-start" })
                }
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant={
                  style.justifyContent === "center" ? "default" : "outline"
                }
                size="icon"
                onClick={() =>
                  onStyleChange({ ...style, justifyContent: "center" })
                }
              >
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
              <Button
                variant={
                  style.justifyContent === "flex-end" ? "default" : "outline"
                }
                size="icon"
                onClick={() =>
                  onStyleChange({ ...style, justifyContent: "flex-end" })
                }
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant={
                  style.justifyContent === "space-between"
                    ? "default"
                    : "outline"
                }
                size="icon"
                onClick={() =>
                  onStyleChange({ ...style, justifyContent: "space-between" })
                }
              >
                |o|
              </Button>
              <Button
                variant={
                  style.justifyContent === "space-around"
                    ? "default"
                    : "outline"
                }
                size="icon"
                onClick={() =>
                  onStyleChange({ ...style, justifyContent: "space-around" })
                }
              >
                o|o
              </Button>
            </div>
          </div>
          <div>
            <Label>Align Items</Label>
            <div className="flex justify-between mt-2">
              <Button
                variant={
                  style.alignItems === "flex-start" ? "default" : "outline"
                }
                size="icon"
                onClick={() =>
                  onStyleChange({ ...style, alignItems: "flex-start" })
                }
              >
                ⇱
              </Button>
              <Button
                variant={style.alignItems === "center" ? "default" : "outline"}
                size="icon"
                onClick={() =>
                  onStyleChange({ ...style, alignItems: "center" })
                }
              >
                ⇔
              </Button>
              <Button
                variant={
                  style.alignItems === "flex-end" ? "default" : "outline"
                }
                size="icon"
                onClick={() =>
                  onStyleChange({ ...style, alignItems: "flex-end" })
                }
              >
                ⇲
              </Button>
            </div>
          </div>
          <div>
            <Label>Direction</Label>
            <Select
              value={style.flexDirection}
              onValueChange={(value) =>
                onStyleChange({ ...style, flexDirection: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Horizontal</SelectItem>
                <SelectItem value="column">Vertical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default function Component() {
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);

  const handleDrop = (type) => {
    if (type === "container") {
      setContainers([
        ...containers,
        {
          id: Date.now(),
          style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "stretch",
          },
          components: [],
        },
      ]);
    } else if (selectedContainer !== null) {
      const newComponent = {
        type,
        id: Date.now(),
        content:
          type === "card"
            ? { title: "", description: "", body: "" }
            : type === "input"
            ? { label: "", placeholder: "" }
            : "",
      };
      const updatedContainers = containers.map((container) =>
        container.id === selectedContainer
          ? {
              ...container,
              components: [...container.components, newComponent],
            }
          : container
      );
      setContainers(updatedContainers);
    }
  };

  const handleUpdate = (updatedComponent) => {
    const updatedContainers = containers.map((container) =>
      container.id === selectedContainer
        ? {
            ...container,
            components: container.components.map((comp) =>
              comp.id === updatedComponent.id ? updatedComponent : comp
            ),
          }
        : container
    );
    setContainers(updatedContainers);
  };

  const handleContainerStyleChange = (containerId, newStyle) => {
    setContainers(
      containers.map((container) =>
        container.id === containerId
          ? { ...container, style: newStyle }
          : container
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Components</h2>
          <DraggableComponent type="container">Container</DraggableComponent>
          <DraggableComponent type="heading">Heading</DraggableComponent>
          <DraggableComponent type="paragraph">Paragraph</DraggableComponent>
          <DraggableComponent type="button">Button</DraggableComponent>
          <DraggableComponent type="input">Input</DraggableComponent>
          <DraggableComponent type="card">Card</DraggableComponent>
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-lg font-bold mb-4">Canvas</h2>
          <Canvas>
            <DroppableArea onDrop={handleDrop}>
              {containers.map((container) => (
                <Container
                  key={container.id}
                  style={container.style}
                  onStyleChange={(newStyle) =>
                    handleContainerStyleChange(container.id, newStyle)
                  }
                  onSelect={() => setSelectedContainer(container.id)}
                  isSelected={selectedContainer === container.id}
                >
                  {container.components.map((component) => (
                    <EditableComponent
                      key={component.id}
                      component={component}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </Container>
              ))}
            </DroppableArea>
          </Canvas>
        </div>
        <div className="w-1/4 p-4 border-l">
          <h2 className="text-lg font-bold mb-4">Layout</h2>
          {selectedContainer !== null && (
            <FlexControls
              style={containers.find((c) => c.id === selectedContainer).style}
              onStyleChange={(newStyle) =>
                handleContainerStyleChange(selectedContainer, newStyle)
              }
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
