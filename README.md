# See the ALPHA version
* https://r3b.dev/
# Getting Started Developing
* (Optional) Install [React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* (Optional) Install [Redux Dev Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
* (Optional) In redux dev tools settings -> Filter Actions in DevTools -> Hide the following "ui/mouseMove" this filters out some of the noise

## In the Server directory
* Run ```yarn install```
* Run ```yarn start```

## In the Client directory
* Run ```yarn install```
* Run ```yarn start```


## Help
* Send pull requests or raise tickets for bugs/features
* Ideally pick stuff off the list below
* Ask before introducing more dependencies

# Tech Debt
* [ ] Use immer better in selectionReducer 
* [ ] Use immer better in selectionDragBoxReducer 
* [ ] Stop mouse position going funky over text
* [ ] Combine selection scale/transform to single transform that is all box based
* [ ] Write some Tests
* [ ] Use reselect for more component selectors to speed things up
* [ ] Abstract mousedown to detect clicks and ready for touch support
* [ ] Dig into performance a bit once reselect done
* [ ] Less OMG UI
* [ ] Fix the jankiness after comitting a transform and waiting for it to come back from server
* [ ] Configure redux-dev-tools in code to omit mousemove actions
* [ ] Configure redux-dev-tools to omit unpersisted persistent actions
* [ ] Maybe migrate the persistence to redux middleware?
* [ ] Have another go at yarn workspaces to share code between client/server
* [ ] Get a VM with more ram to run the server
* [ ] Get the server to auto-restart

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
* [ ] Snap to grid

## Pen Tool 
* [x] Toolbar button to select pen tool
* [x] Ability to free-hand draw polylines with a pen
* [x] Switch to Selection Tool after drawing with pen
* [ ] Tackle performance problems as result of Pen tool
* [ ] Change mouse icon for pen tool

## Point Tool
* [x] Toolbar button to select point tool
* [ ] Move individual points in polylines
* [ ] Move individual points in lines
* [ ] Manipulate paths 

## Connection Tool
* [x] Toolbar button to select connection tool
* [ ] Draw straight lines by dragging between two points

## Shape Tool
* [ ] Toolbar button to select Shape Tool
* [ ] Toolbar button lets you select shape to draw
* [ ] Draw shapes directly on canvas using shape tool

## Chrome
* [x] Basic Window Chrome with header/footer/left/right
* [x] Pane with title component
* [x] Toolbar 
* [ ] Load theme from reducer
* [ ] Expandable/Collapsable left/right columns
* [ ] Resizable width of left/right columns
* [x] Expandable/Collapsable panes
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
* [x] Edit element geometry from a tool window
* [ ] Edit element formatting from a tool window
* [ ] Edit element data from a tool window
* [ ] Handle editing properties of multiple selected elements

## Selection Pane
* [x] A Pane to show the current selection box
* [x] Selection Pane shows details of any selection transformations

## Elements Pane
* [x] A Pane with the list of the elements in the diagram in render order
* [x] Highlight currently selected elements
* [x] Clicking the elements in the pane selects them
* [x] Shift clicking elements adds them to the selection
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
* [ ] History Stack
* [ ] Undo action
* [ ] Redo action
* [ ] History Pane

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

## Presence Pane
* [x] Pane to allow user to set their name
* [x] See list of other people currently using the app
* [ ] Persist local users name in browser storage
* [ ] Ability to manually reconnect if disconnected
* [ ] Automatic reconnection if disconnected

## Collaboration
* [x] Transient actions are sent to other users
* [x] Persistent actions sent to server, given sequence number and sent to all users
* [x] Propagate mouse position with transient action
* [x] Propagate element changes with persistent action
* [x] Propagate selections with transient action
* [x] Propagate selection translate/scale with transient action
* [x] Show users each others mouse position on canvas
* [x] High order reducer to keep track of other users transient state
* [x] High order selector to apply selectors to other users transient state
* [x] Show other users selection state
* [x] Show other users selection transform
* [ ] Locking of elements selected by other users?

## Persistence
* [ ] Persist persistent actions in memory on server
* [ ] Persist persistent actions on disk on server
* [ ] Load current action history from server upon connection
* [ ] Disable editing while reloading state from server
* [ ] Run some of the reducers server-side
* [ ] Support snapshots
* [ ] Some kind of state checksum

## Keyboard
* [ ] Keyboard manager / mapper
* [ ] Arrow keys to move things?

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
