# Tech Debt
* [ ] Combine selection scale/transform to single transform that is all box based
* [ ] Write some Tests
* [ ] Use reselect for more component selectors to speed things up
* [ ] Abstract mousedown to detect clicks and ready for touch support
* [ ] Stop Canvas re-rendering so much (useCallback wrap param passed to useDrag?)
* [ ] Replace random id generation with proper uuid's
* [ ] Dig into performance a bit once reselect done
* [ ] Less OMG UI
* [ ] Refactor the Selection/Pen tool stuff out Canvas
* [ ] Sort out all the floating-point geometry

# Deployment
* [ ] Setup CI
* [x] Setup r3b.dev custom domain
* [x] Deploy to firebase hosting
* [x] Refactor store so selection is separate to diagram elements
* [x] Refactor store so selectionDragBox is separate to selection
* [x] Refactor selectionState so it is part of selectionReducer
* [x] Refactor dragState so it is part of selectionDragBoxReducer

# Canvas Features
* [x] Zoom in/out on just the diagram (as opposed to browser zoom)
* [x] Fixed size Page
* [ ] Canvas margins (so fixed canvas shows up on a background)
* [ ] Infinite sized Page
* [ ] Rulers
* [ ] Touch support as well as mouse
* [ ] Scroll canvas when dragging near the edge of canvas viewport
* [ ] Canvas properties pane
* [ ] Editable grid settings
* [ ] Change page type

## Diagram Elements
* [x] Create SvgRect
* [x] Create SvgLine (start and end point)
* [x] Create Circle element, fixed a/r
* [x] Create SvgEllipse (like circle but changes a/r when scaled)
* [x] Create SvgPolyLine
* [x] Create SvgText using foreignObject
* [ ] Make it easier to click lines
* [ ] Create SvgSquare (like rect but doesn't change a/r when scaled)
* [ ] Create SvgPolygon
* [ ] Create Paths
* [ ] Edit text by double clicking
* [ ] Better editing of Poly's
* [ ] Better editing of Paths
* [ ] Drag to move diagram elements directly without having to select them first
* [ ] Make all elements have text
* [ ] Make line/connection elements have a text anchor

## Selection Tool 
* [x] Click diagram elements to select them
* [x] Shift-click diagram elements to add them to the selection
* [x] Drag a box around diagram elements to select them
* [x] Move selected diagram elements
* [x] Scale selected diagram elements
* [ ] Rotate elements
* [ ] Shift-drag around diagram elements to add them to the selection
* [ ] Move selection to top/bottom
* [ ] Move selection up/down
* [ ] Press delete key to delete selected elements
* [x] Toolbar button to enable Selection Tool

## Pen Tool 
* [x] Toolbar button to select pen tool
* [x] Ability to free-hand draw polylines with a pen
* [x] Switch to Selection Tool after drawing with pen
* [ ] Tackle performance problems as result of Pen tool
* [ ] Change mouse icon for pen tool

## Point Tool
* [ ] Toolbar button to select point tool
* [ ] Move individual points in polylines
* [ ] Move individual points in lines
* [ ] Manipulate paths 

## Chrome
* [x] Basic Window Chrome with header/footer/left/right
* [x] Pane with title component
* [x] Toolbar 
* [ ] Load theme from reducer
* [ ] Expandable/Collapsable left/right columns
* [ ] Resizable width of left/right columns
* [ ] Expandable/Collapsable panes
* [ ] Theme Pane

## Status Bar
* [x] Current canvas-relative mouse coords on statusbar
* [x] Geometry of current selection
* [ ] Geometry of current selectionDragBox
* [ ] Delta of current selection translate
* [ ] Delta of current selection scale

## Element Palette Pane
* [x] An element palette Pane for all types of creatable diagram elements
* [x] Add new diagram elements by clicking on them in the palette
* [ ] Adding element by clicking makes it selected
* [ ] Icons for the element types
* [ ] Create new diagram elements by dragging them from the Pane

## Element Properties Pane
* [x] A Pane to show properties of selected elements
* [x] Show geometry of selected elements
* [ ] Show formatting of selected elements
* [x] Show data of selected elements
* [ ] Edit element geometry from a tool window
* [ ] Edit element formatting from a tool window
* [ ] Edit element data from a tool window
* [ ] Handle editing properties of multiple selected elements

## Selection Pane
* [x] A Pane to show the current selection box
* [x] Selection Pane shows details of any selection transformations

## Elements Pane
* [x] A Pane with the list of the elements in the diagram in render order
* [x] Highlight currently selected elements
* [ ] Clicking the elements in the pane selects them
* [ ] Shift clicking elements adds them to the selection
* [ ] The element in the list reflects its formatting
* [ ] Drag elements to re-order them

## Copy and Paste
* [ ] Copy selected elements to clipboard
* [ ] Cut selected elements to clipboard
* [ ] Paste selected elements to diagram
* [ ] Clipboard pane

## Grouping Elements
* [ ] Convert selection to a group
* [ ] Convert a group back to elements
* [ ] Groups that layout children horizontally
* [ ] Groups that layout children vertically

## Connections
* [ ] Create lines stuck to magnets
* [ ] Connection type (straight, orthogonal, etc)
* [ ] Configurable connection Endings

## Undo and Redo
* [ ] Action Stack
* [ ] Undo action
* [ ] Redo action
* [ ] Action Pane

## Version History
* [ ] Show version history
* [ ] Naming of versions
* [ ] Display older version
* [ ] Revert to older version

## Layers
* [ ] Layers Pane
* [ ] Add/remove layers
* [ ] Select current layer
* [ ] Copy and paste between layers
* [ ] Lock layers for editing/selection

## Collaboration
* [ ] Propagate mouse position
* [ ] Propagate element changes
* [ ] Propagate selections
* [ ] Propagate selection translate/scale
* [ ] Locking of selected elements?
* [ ] Webcam streaming of collaborators
* [ ] P2P collaboration

# Common
* [ ] Authentication
* [ ] Routing with react-router
* [ ] Load and save from textarea
* [ ] Load/Save to local storage
* [ ] Load/Save to remote storage


## Modelling
* Like EA

## Lists
* Arbitrarily nested lists
* TODO lists
* Task lists
* Lists such as this one /|\
## Tables
* Like MS Access
## Spreadsheets
## Graphs
## Gantt Charts
## Tickets / Issues
## Kanban style boards

